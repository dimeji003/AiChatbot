"""
SLA Configuration API: lets Service Desk Officers / CISO pre-define SLA time
limits per urgency for internal and external staff, and mark a user as
internal or external.
"""
import secrets

from flask import Blueprint, current_app, jsonify, request

from engine.audit_log import get_audit_log_store
from engine.auth import roles_required
from engine.mailer import send_mail
from engine.sla_config import get_sla_config_store
from engine.user_store import ROLE_LABELS, get_user_store

sla_bp = Blueprint("sla_api", __name__, url_prefix="/api/v1")

CONFIG_ROLES = ("service_desk_officer", "ciso")
VALID_ROLES = set(ROLE_LABELS.keys())


@sla_bp.route("/sla-config", methods=["GET"])
@roles_required(*CONFIG_ROLES)
def get_sla_config():
    store = get_sla_config_store(current_app.config["SLA_CONFIG_STORE_PATH"])
    return jsonify({"sla_config": store.get_config()}), 200


@sla_bp.route("/sla-config", methods=["POST"])
@roles_required(*CONFIG_ROLES)
def set_sla_config():
    payload = request.get_json(silent=True) or {}
    staff_type = payload.get("staff_type")
    urgency = payload.get("urgency")
    hours = payload.get("hours")

    if staff_type not in ("internal", "external") or not urgency or hours is None:
        return jsonify({"error": "Fields 'staff_type' (internal/external), 'urgency', 'hours' are required."}), 400
    try:
        hours = float(hours)
    except (TypeError, ValueError):
        return jsonify({"error": "Field 'hours' must be a number."}), 400

    store = get_sla_config_store(current_app.config["SLA_CONFIG_STORE_PATH"])
    config = store.set_hours(staff_type, urgency, hours)
    return jsonify({"sla_config": config}), 200


@sla_bp.route("/users", methods=["GET"])
@roles_required(*CONFIG_ROLES)
def list_users():
    store = get_user_store(current_app.config["USER_STORE_PATH"])
    users = store.list_all()
    for u in users:
        u["role_label"] = ROLE_LABELS.get(u["role"], u["role"])
    return jsonify({"users": users, "count": len(users)}), 200


@sla_bp.route("/users", methods=["POST"])
@roles_required("ciso")
def create_user():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    role = payload.get("role")
    is_internal = payload.get("is_internal", True)

    if not name or not email or not role:
        return jsonify({"error": "Fields 'name', 'email', and 'role' are required."}), 400
    if role not in VALID_ROLES:
        return jsonify({"error": f"Role must be one of: {', '.join(sorted(VALID_ROLES))}."}), 400

    temp_password = secrets.token_urlsafe(9)
    store = get_user_store(current_app.config["USER_STORE_PATH"])
    user = store.create(name, email, role, temp_password, is_internal=bool(is_internal))
    if user is None:
        return jsonify({"error": "A user with that email already exists."}), 409

    user["role_label"] = ROLE_LABELS.get(user["role"], user["role"])

    send_mail(
        current_app.config,
        email,
        "Your Sterling Trust Bank account",
        f"Hello {name},\n\nAn account has been created for you.\n"
        f"Email: {email}\nTemporary password: {temp_password}\n\n"
        "Please log in and change your password as soon as possible.",
    )

    audit_log = get_audit_log_store(current_app.config["AUDIT_LOG_DB_PATH"])
    audit_log.record(
        request.current_user, "user_created", f"Created user {email} ({role})", category="user_management",
    )

    return jsonify({"user": user, "temp_password": temp_password}), 201


@sla_bp.route("/users/<user_id>", methods=["PATCH"])
@roles_required("ciso")
def update_user(user_id):
    payload = request.get_json(silent=True) or {}
    allowed_fields = {"is_internal", "active", "name", "role", "email"}
    updates = {k: v for k, v in payload.items() if k in allowed_fields}
    if not updates:
        return jsonify({"error": "No valid fields supplied. Allowed: is_internal, active, name, role, email."}), 400
    if "role" in updates and updates["role"] not in VALID_ROLES:
        return jsonify({"error": f"Role must be one of: {', '.join(sorted(VALID_ROLES))}."}), 400

    store = get_user_store(current_app.config["USER_STORE_PATH"])
    updated = store.update(user_id, updates)
    if updated is None:
        return jsonify({"error": f"User {user_id} not found."}), 404

    updated["role_label"] = ROLE_LABELS.get(updated["role"], updated["role"])

    audit_log = get_audit_log_store(current_app.config["AUDIT_LOG_DB_PATH"])
    audit_log.record(
        request.current_user, "user_updated", f"Updated user {updated['email']}: {list(updates.keys())}",
        category="user_management",
    )

    return jsonify({"user": updated}), 200


@sla_bp.route("/users/<user_id>", methods=["DELETE"])
@roles_required("ciso")
def delete_user(user_id):
    if user_id == request.current_user["id"]:
        return jsonify({"error": "You cannot delete your own account."}), 400

    store = get_user_store(current_app.config["USER_STORE_PATH"])
    target = store.get_by_id(user_id)
    deleted = store.delete(user_id)
    if not deleted:
        return jsonify({"error": f"User {user_id} not found."}), 404

    audit_log = get_audit_log_store(current_app.config["AUDIT_LOG_DB_PATH"])
    audit_log.record(
        request.current_user, "user_deleted",
        f"Deleted user {target['email'] if target else user_id}", category="user_management",
    )

    return jsonify({"deleted": True}), 200


@sla_bp.route("/users/<user_id>/reset-password", methods=["POST"])
@roles_required("ciso")
def reset_user_password(user_id):
    store = get_user_store(current_app.config["USER_STORE_PATH"])
    target = store.get_by_id(user_id)
    if target is None:
        return jsonify({"error": f"User {user_id} not found."}), 404

    temp_password = secrets.token_urlsafe(9)
    store.set_password(user_id, temp_password)

    send_mail(
        current_app.config,
        target["email"],
        "Your Sterling Trust Bank password was reset",
        f"Hello {target['name']},\n\nYour password has been reset.\n"
        f"Temporary password: {temp_password}\n\nPlease log in and change it as soon as possible.",
    )

    audit_log = get_audit_log_store(current_app.config["AUDIT_LOG_DB_PATH"])
    audit_log.record(
        request.current_user, "user_password_reset", f"Reset password for {target['email']}",
        category="user_management",
    )

    return jsonify({"reset": True, "temp_password": temp_password}), 200
