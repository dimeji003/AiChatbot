"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { authFetch, ROLE_LABELS } from "../../../lib/auth";

export default function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", role: "user", is_internal: true });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      setError("Name, email, and role are all required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const response = await authFetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create user.");
      }
      setTempPassword(data.temp_password);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#111827] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Register New User</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {tempPassword ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-300">
              User created. Share this temporary password with them securely — it will not be shown again.
            </p>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-mono text-sm text-cyan-300 break-all">
              {tempPassword}
            </div>
            <button
              onClick={onCreated}
              className="w-full rounded-xl bg-cyan-500 py-3 font-medium text-white hover:bg-cyan-400 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-[#1F2937] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-[#1F2937] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="jane.doe@sterlingtrust.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-700 bg-[#1F2937] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.is_internal}
                onChange={(e) => setForm((p) => ({ ...p, is_internal: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-700 bg-[#1F2937] accent-cyan-500"
              />
              Internal staff member
            </label>

            {error && <p className="text-sm font-medium text-red-400">{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={isSaving}
                className="flex-1 rounded-xl bg-cyan-500 py-3 font-medium text-white hover:bg-cyan-400 transition disabled:opacity-50"
              >
                {isSaving ? "Creating..." : "Create User"}
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-gray-700 px-5 py-3 text-sm text-gray-300 hover:border-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
