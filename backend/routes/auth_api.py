"""
Authentication API: login and current-session lookup.
"""
from flask import Blueprint, current_app, jsonify, request

from engine.audit_log import get_audit_log_store
from engine.auth import get_current_user, issue_token, login_required
from engine.user_store import ROLE_LABELS, get_user_store

auth_bp = Blueprint("auth_api", __name__, url_prefix="/api/v1/auth")


def _serialize_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "role_label": ROLE_LABELS.get(user["role"], user["role"]),
    }


@auth_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    store = get_user_store(current_app.config["USER_STORE_PATH"])
    user = store.authenticate(email, password)
    audit_log = get_audit_log_store(current_app.config["AUDIT_LOG_DB_PATH"])

    if user is None:
        existing = store.get_by_email(email)
        audit_log.record(
            existing or {"id": None, "name": email, "role": None},
            "login_failed",
            "Inactive account login attempt" if existing and not existing.get("active", True)
            else "Invalid email or password",
            category="auth",
        )
        return jsonify({"error": "Invalid email or password."}), 401

    token = issue_token(user["id"])
    audit_log.record(user, "login_success", f"{user['name']} logged in", category="auth")
    return jsonify({"token": token, "user": _serialize_user(user)}), 200


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({"user": _serialize_user(request.current_user)}), 200
