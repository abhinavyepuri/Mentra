import React from 'react';
import { Role } from '../types';
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquareWarning,
  Lightbulb,
  Users,
  FileQuestion,
  BarChart3,
  BookOpenCheck,
  Building2,
  UserCog,
  Sparkles,
  Bot,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  role: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unresolvedDoubtCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabChange,
  unresolvedDoubtCount,
}) => {
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'School Overview', icon: LayoutDashboard },
          { id: 'admin-departments', label: 'Departments', icon: Building2 },
          { id: 'admin-users', label: 'User Roster & Roles', icon: UserCog },
        ];
      case 'teacher':
        return [
          { id: 'teacher-dashboard', label: 'Class Overview', icon: LayoutDashboard },
          {
            id: 'teacher-doubts',
            label: 'Student Doubt Feed',
            icon: MessageSquareWarning,
            badge: unresolvedDoubtCount > 0 ? unresolvedDoubtCount : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          { id: 'teacher-insights', label: 'Class Insights & Agenda', icon: Lightbulb },
          { id: 'teacher-pods', label: 'Group Study Pods', icon: Users },
          { id: 'teacher-quiz', label: 'Quiz Creator', icon: FileQuestion },
          { id: 'teacher-assessment', label: 'Quiz Grade Analyzer', icon: BarChart3 },
          { id: 'teacher-classroom', label: 'Class & Syllabus', icon: BookOpenCheck },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'My Learning Hub', icon: LayoutDashboard },
          { id: 'student-socratic', label: 'AI Study Helper', icon: Bot, highlight: true },
          { id: 'student-adaptive-quiz', label: 'Practice Quiz', icon: Sparkles },
          { id: 'student-pod', label: 'Group Study Pod', icon: Users },
          { id: 'student-syllabus', label: 'Syllabus & Topics', icon: Layers },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems() || [];

  return (
    <aside className="w-full md:w-64 bg-[#111113] border-r border-[#27272A] p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        {/* Role Portal Indicator */}
        <div className="px-3 py-2 rounded-xl bg-[#161618] border border-[#27272A]">
          <span className="text-[10px] font-semibold tracking-widest text-[#8E75FF] uppercase block">
            Active Navigation
          </span>
          <span className="text-sm font-bold text-[#EDEDED] flex items-center gap-1.5 capitalize mt-0.5">
            <Sparkles className="w-4 h-4 text-[#8E75FF]" />
            {role} Portal
          </span>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#8E75FF] text-white shadow-md shadow-[#8E75FF]/20'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#8E75FF]' : 'text-[#A1A1AA]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white text-[#8E75FF]' : item.badgeColor || 'bg-[#27272A] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Card */}
      <div className="mt-8 pt-4 border-t border-[#27272A]">
        <div className="p-3 rounded-xl bg-[#161618] border border-[#27272A]">
          <div className="flex items-center gap-2 text-[#8E75FF] font-bold text-xs">
            <BrainCircuit className="w-4 h-4" />
            <span>Automatic Doubt Feed</span>
          </div>
          <p className="text-[11px] text-[#A1A1AA] mt-1 leading-snug">
            Questions asked to the AI helper are automatically sent to your teacher when you need extra help.
          </p>
        </div>
      </div>
    </aside>
  );
};
