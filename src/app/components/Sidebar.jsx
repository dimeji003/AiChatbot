"use client";

import Link from "next/link";
import {
  XMarkIcon,
  HomeIcon,
  ShieldCheckIcon,
  FolderIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  {
    name: "AI Chat",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Requests",
    href: "/requests",
    icon: ShieldCheckIcon,
  },
  {
    name: "Service Teams",
    href: "/serviceteams",
    icon: FolderIcon,
  },
  {
    name: "Service Desk",
    href: "/servicedesk",
    icon: UserCircleIcon,
  },
  {
    name: "GRC Management",
    href: "/grcmanagement",
    icon: Cog6ToothIcon,
  },
  {
    name: "GRC Query",
    href: "/grcquery",
    icon: Cog6ToothIcon,
  },
  {
    name: "User Management",
    href: "/usermanagement",
    icon: UsersIcon,
  },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 transform bg-[#101827] text-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
          <h2 className="text-lg font-bold">
            Security SOC
          </h2>

          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}