"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  FolderIcon,
  SpeakerWaveIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./components/Sidebar";

export default function SecuritySOCDesk() {
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <Bars3Icon className="w-7 h-7 text-slate-700" />
        </button>

        <div className="bg-slate-100 p-1 rounded-full flex">
          <button className="px-5 py-1.5 bg-blue-600 text-white rounded-full text-sm">
            AI Chat Bot
          </button>
          <button className="px-5 py-1.5 text-slate-600 text-sm">
            GRC Co-Pilot (Auditing)
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              LT
            </div>
            <span className="font-medium text-slate-700 hidden sm:block">
              Lawal Tumininu
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-5 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50">
              <div className="px-6 py-5 border-b">
                <button className="w-full text-left text-2xl font-semibold text-slate-800 hover:text-blue-600">
                  My Account
                </button>
              </div>

              <div className="border-b py-2">
                <button className="w-full text-left px-6 py-3 text-xl hover:bg-slate-100">
                  Profile Settings
                </button>
                <button className="w-full text-left px-6 py-3 text-xl hover:bg-slate-100">
                  Preferences
                </button>
              </div>

              <div className="py-2">
                <button className="w-full text-left px-6 py-3 text-xl hover:bg-slate-100">
                  Register New User
                </button>
                <button className="w-full text-left px-6 py-3 text-xl text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-8">
        <div className="bg-white rounded-2xl border shadow min-h-[650px] flex flex-col">
          <div className="bg-[#1a2333] p-8 text-center">
            <h1 className="text-white text-2xl font-bold">
              Autonomous Cybersecurity Operations Center Desk
            </h1>
            <p className="text-slate-400 text-sm">
              AI-Powered Security Operations & Incident Response
            </p>
          </div>

          <div className="flex-1 p-6">
            <div className="bg-slate-50 rounded-2xl p-4">
              Welcome to the Autonomous Cybersecurity Operations Center Desk.
            </div>
          </div>

          <div className="border-t p-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <button className="p-3 bg-white rounded-full border"><PaperClipIcon className="w-5 h-5"/></button>
              <input
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Type your security query..."
                className="flex-1 rounded-xl bg-white border px-4 py-3"
              />
              <button className="p-3 bg-white rounded-full border"><MicrophoneIcon className="w-5 h-5"/></button>
              <button className="p-3 bg-blue-600 rounded-full text-white"><PaperAirplaneIcon className="w-5 h-5 -rotate-45"/></button>
            </div>

            <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
              <button className="flex items-center gap-1"><PhotoIcon className="w-4 h-4"/>Images</button>
              <button className="flex items-center gap-1"><FolderIcon className="w-4 h-4"/>Folders</button>
              <button className="flex items-center gap-1"><SpeakerWaveIcon className="w-4 h-4"/>Audio</button>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-5 right-5 p-3 rounded-full bg-slate-900 text-white">
        <QuestionMarkCircleIcon className="w-6 h-6"/>
      </button>
    </div>
  );
}
