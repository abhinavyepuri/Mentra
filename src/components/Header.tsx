import React from 'react';
import { User, Role, Classroom } from '../types';
import {
  Sparkles,
  UserCheck,
  RotateCcw,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Bot,
  ChevronDown,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  activeClassroom: Classroom;
  allClassrooms: Classroom[];
  onSelectClassroom: (classroom: Classroom) => void;
  onResetData: () => void;
  isResetting: boolean;
  activeAlertCount?: number;
  onOpenAlerts?: () => void;
  onOpenIntegrations?: () => void;
  isLowPowerMode?: boolean;
  onToggleLowPowerMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeClassroom,
  allClassrooms,
  onSelectClassroom,
  onResetData,
  isResetting,
  activeAlertCount = 0,
  onOpenAlerts,
  onOpenIntegrations,
  isLowPowerMode = false,
  onToggleLowPowerMode,
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-[#8E75FF]/20 text-[#8E75FF] border-[#8E75FF]/30';
      case 'teacher':
        return 'bg-[#4285F4]/20 text-[#4285F4] border-[#4285F4]/30';
      case 'student':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111113] border-b border-[#27272A] px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4285F4] to-[#8E75FF] flex items-center justify-center text-white shadow-md shadow-[#8E75FF]/10">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">
                Mentra
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A]">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#8E75FF] font-semibold hidden sm:block">
              Mentra AI Learning Platform
            </p>
          </div>
        </div>

        {/* Global Controls & Switchers */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Real-time Alerts Notification Button for Teachers */}
          {currentUser?.role === 'teacher' && onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className="relative flex items-center gap-1.5 bg-[#1C1C1E] hover:bg-[#27272A] px-3 py-1.5 rounded-lg border border-[#27272A] text-xs text-[#EDEDED] transition cursor-pointer"
              title="Real-time Student Alerts"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline font-semibold text-[11px]">Alerts</span>
              {activeAlertCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                  {activeAlertCount}
                </span>
              )}
            </button>
          )}

          {/* Integrations Modal Trigger */}
          {onOpenIntegrations && (
            <button
              onClick={onOpenIntegrations}
              className="flex items-center gap-1.5 bg-[#1C1C1E] hover:bg-[#27272A] px-3 py-1.5 rounded-lg border border-[#27272A] text-xs text-[#EDEDED] transition cursor-pointer"
              title="Classroom & LMS Integrations"
            >
              <GraduationCap className="w-4 h-4 text-[#4285F4]" />
              <span className="hidden md:inline font-semibold text-[11px]">Integrations</span>
            </button>
          )}

          {/* Active Classroom Selector */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-[#1C1C1E] hover:bg-[#27272A] px-3 py-1.5 rounded-lg border border-[#27272A] transition cursor-pointer text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#4285F4]" />
              <div className="text-left">
                <span className="block text-[10px] text-[#A1A1AA] font-normal leading-tight">Classroom</span>
                <span className="text-[#EDEDED] font-semibold">{activeClassroom?.code || 'Select Class'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA] ml-1" />
            </div>
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#161618] rounded-xl shadow-xl border border-[#27272A] py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#A1A1AA] border-b border-[#27272A]">
                Switch Classroom View
              </div>
              {(allClassrooms || []).map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => onSelectClassroom(cls)}
                  className={`w-full text-left px-3 py-2 hover:bg-[#1C1C1E] flex items-center justify-between transition ${
                    cls.id === activeClassroom?.id ? 'bg-[#1C1C1E] text-[#8E75FF] font-semibold' : 'text-[#EDEDED]'
                  }`}
                >
                  <div>
                    <span className="block text-xs">{cls.name}</span>
                    <span className="text-[10px] text-[#A1A1AA]">{cls.code} • {cls.teacherName}</span>
                  </div>
                  {cls.id === activeClassroom?.id && <span className="w-1.5 h-1.5 rounded-full bg-[#8E75FF]"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2.5 bg-[#1C1C1E] hover:bg-[#27272A] px-3 py-1.5 rounded-lg border border-[#27272A] transition cursor-pointer text-xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#8E75FF]/30"
              />
              <div className="text-left hidden md:block">
                <span className="block font-semibold text-[#EDEDED]">{currentUser.name}</span>
                <span className={`inline-block text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
            </button>

            {/* User Selection Menu */}
            <div className="absolute right-0 top-full mt-1 w-72 bg-[#161618] rounded-xl shadow-xl border border-[#27272A] py-1 hidden group-hover:block z-50">
              <div className="px-3 py-2 border-b border-[#27272A]">
                <p className="text-[11px] font-semibold text-[#8E75FF] uppercase tracking-wider">Demo User Portal Switcher</p>
                <p className="text-[11px] text-[#A1A1AA]">Select role to test dedicated portals</p>
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {(allUsers || []).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => onSelectUser(u)}
                    className={`w-full text-left px-3 py-2 hover:bg-[#1C1C1E] flex items-center gap-3 transition ${
                      u.id === currentUser.id ? 'bg-[#1C1C1E] border-l-2 border-[#8E75FF]' : ''
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#EDEDED] truncate">{u.name}</p>
                      <p className="text-[10px] text-[#A1A1AA] truncate">{u.email}</p>
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Low Power / Performance Mode Toggle Button */}
          {onToggleLowPowerMode && (
            <button
              onClick={onToggleLowPowerMode}
              title={isLowPowerMode ? 'Low Power Mode Active (Animations & Blurs disabled for maximum performance)' : 'Toggle Low Power Mode for low-spec CPU/Chromebooks'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition cursor-pointer ${
                isLowPowerMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold'
                  : 'bg-[#1C1C1E] border-[#27272A] text-[#A1A1AA] hover:text-white hover:bg-[#27272A]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isLowPowerMode ? 'fill-amber-400' : ''}`} />
              <span className="hidden lg:inline text-[11px]">
                {isLowPowerMode ? 'Low Power On' : 'Performance Mode'}
              </span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset platform data to default state"
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#27272A] rounded-lg transition"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-[#8E75FF]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
