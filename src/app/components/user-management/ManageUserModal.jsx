"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { authFetch, ROLE_LABELS } from "../../../lib/auth";

export default function ManageUserModal({ user, currentUserId, onClose, onChanged }) {
  const [role, setRole] = useState(user.role);
  const [isInternal, setIsInternal] = useState(user.is_internal);
  const [active, setActive] = useState(user.active !== false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isSelf = user.id === currentUserId;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await authFetch(`/api/v1/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, is_internal: isInternal, active }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update user.");
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPassword = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await authFetch(`/api/v1/users/${user.id}/reset-password`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to reset password.");
      setTempPassword(data.temp_password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await authFetch(`/api/v1/users/${user.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete user.");
      onChanged();
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#111827] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {tempPassword ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-300">
              Password reset. Share this temporary password securely — it will not be shown again.
            </p>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-mono text-sm text-cyan-300 break-all">
              {tempPassword}
            </div>
            <button
              onClick={onChanged}
              className="w-full rounded-xl bg-cyan-500 py-3 font-medium text-white hover:bg-cyan-400 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSelf}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-[#1F2937] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-50"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {isSelf && <p className="mt-1 text-xs text-gray-500">You cannot change your own role.</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-[#1F2937] accent-cyan-500"
              />
              Internal staff member
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                disabled={isSelf}
                className="h-4 w-4 rounded border-gray-700 bg-[#1F2937] accent-cyan-500 disabled:opacity-50"
              />
              Account active
            </label>

            {error && <p className="text-sm font-medium text-red-400">{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-cyan-500 py-3 font-medium text-white hover:bg-cyan-400 transition disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleResetPassword}
                disabled={isSaving}
                className="rounded-xl border border-gray-700 px-4 py-3 text-sm text-gray-300 hover:border-white transition disabled:opacity-50"
              >
                Reset Password
              </button>
            </div>

            <div className="border-t border-gray-800 pt-4">
              {confirmDelete ? (
                <div className="flex items-center gap-3">
                  <p className="flex-1 text-sm text-red-400">Delete this user permanently?</p>
                  <button
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 transition disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-white transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  disabled={isSelf}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition disabled:opacity-40"
                  title={isSelf ? "You cannot delete your own account." : undefined}
                >
                  Delete User
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
