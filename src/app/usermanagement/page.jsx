"use client";

import { useCallback, useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";

import Sidebar from "../components/Sidebar";
import { authFetch, useAuthGuard } from "../../lib/auth";

import ActionCards from "../components/user-management/ActionCards";
import CreateUserModal from "../components/user-management/CreateUserModal";
import Header from "../components/user-management/Header";
import LoginHistory from "../components/user-management/LoginHistory";
import ManageUserModal from "../components/user-management/ManageUserModal";
import ModuleAccessMatrix from "../components/user-management/ModuleAccessMatrix";
import StakeholderMatrix from "../components/user-management/StakeholderMatrix";
import StatsCards from "../components/user-management/StatsCards";
import TokenMonitor from "../components/user-management/TokenMonitor";
import ViolationLog from "../components/user-management/ViolationLog";

export default function UserManagement() {
  const { user, checked } = useAuthGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [manageTarget, setManageTarget] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await authFetch("/api/v1/users");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load users.");
      }
      setUsers(data.users || []);
      setUsersError(null);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (checked) fetchUsers();
  }, [checked, fetchUsers]);

  if (!checked) return null;

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="min-h-screen bg-[#0B1220]">

        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-700 bg-[#101827] flex items-center justify-between px-6 sticky top-0 z-40">

          {/* Left */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>

          {/* Middle */}
          <div className="bg-slate-800 p-1 rounded-full flex items-center">
            <button className="px-5 py-1.5 text-slate-300 text-sm rounded-full">
              AI Chat Bot
            </button>

            <button className="px-5 py-1.5 bg-cyan-500 text-white rounded-full text-sm font-medium">
              User Management
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>

            <span className="hidden md:block text-slate-300 font-medium">
              {user.name}
            </span>
          </div>

        </header>

        {/* Main Content */}
        <main className="max-w-[1650px] mx-auto px-8 py-8">

          <div className="mb-8">
            <Header onRegister={() => setShowCreateModal(true)} />
          </div>

          <div className="mb-8">
            <StatsCards users={users} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

            <div className="xl:col-span-8 space-y-8">
              <StakeholderMatrix
                users={users}
                isLoading={isLoadingUsers}
                error={usersError}
                onManage={(u) => setManageTarget(u)}
              />
              <ModuleAccessMatrix />
              <LoginHistory />
              <ActionCards users={users} onCreateUser={() => setShowCreateModal(true)} />
            </div>

            <div className="xl:col-span-4 space-y-8">
              <TokenMonitor />
              <ViolationLog />
            </div>

          </div>

        </main>

      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchUsers();
          }}
        />
      )}

      {manageTarget && (
        <ManageUserModal
          user={manageTarget}
          currentUserId={user.id}
          onClose={() => setManageTarget(null)}
          onChanged={() => {
            setManageTarget(null);
            fetchUsers();
          }}
        />
      )}
    </>
  );
}
