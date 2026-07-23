import React from 'react';
import { Classroom, Doubt, ClassroomInsight, Announcement, User, TeacherAlert } from '../../types';
import {
  LayoutDashboard,
  MessageSquareWarning,
  Sparkles,
  Users,
  FileQuestion,
  BarChart3,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Pin,
  ShieldAlert,
  CheckCircle2,
  UserPlus,
  Send,
} from 'lucide-react';

interface TeacherDashboardProps {
  activeClassroom: Classroom;
  doubts: Doubt[];
  insight: ClassroomInsight | null;
  announcements: Announcement[];
  enrolledStudents: User[];
  alerts?: TeacherAlert[];
  onResolveAlert?: (alertId: string) => void;
  onNavigate: (tab: string) => void;
  onGenerateRemedialPlan: (doubt: Doubt) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  activeClassroom,
  doubts,
  insight,
  announcements,
  enrolledStudents,
  alerts = [],
  onResolveAlert,
  onNavigate,
  onGenerateRemedialPlan,
}) => {
  const unresolvedDoubts = doubts.filter((d) => d.status === 'unresolved');
  const classAnnouncements = announcements.filter((a) => a.classroomId === activeClassroom.id);
  const activeAlerts = alerts.filter((a) => !a.isResolved);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8E75FF]" />
            Teacher Dashboard
          </div>
          <h1 className="text-2xl font-serif italic text-white">Welcome, {activeClassroom.teacherName}</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Class: <strong className="text-[#8E75FF] font-sans">{activeClassroom.name} ({activeClassroom.code})</strong> • {enrolledStudents.length} Students Enrolled
          </p>
        </div>

        <button
          onClick={() => onNavigate('teacher-doubts')}
          className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <MessageSquareWarning className="w-4 h-4" />
          View {unresolvedDoubts.length} Student Doubts
        </button>
      </div>

      {/* REAL-TIME ALERT SYSTEM FOR TEACHER */}
      {activeAlerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#1C1C24] to-[#161618] border border-rose-800/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Real-Time Student Alerts ({activeAlerts.length})
                </h2>
                <p className="text-[11px] text-[#A1A1AA]">
                  Instant notifications for struggling students, doubt buildup, or disengagement.
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-full border border-rose-500/30">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeAlerts.map((alt) => {
              const isStruggling = alt.type === 'struggling';
              const isHighDoubts = alt.type === 'high_doubts';

              return (
                <div
                  key={alt.id}
                  className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-3 flex flex-col justify-between shadow"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        isStruggling
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : isHighDoubts
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {alt.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-[#A1A1AA]">{alt.createdAt}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white">{alt.title}</h3>
                    <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{alt.message}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#27272A]">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const targetDoubt = doubts.find((d) => d.studentId === alt.studentId) || doubts[0];
                          if (targetDoubt) onGenerateRemedialPlan(targetDoubt);
                        }}
                        className="px-2.5 py-1.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-[10px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Create Lesson Plan
                      </button>

                      {onResolveAlert && (
                        <button
                          onClick={() => onResolveAlert(alt.id)}
                          className="px-2.5 py-1.5 bg-[#27272A] hover:bg-[#323236] text-emerald-400 text-[10px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#8E75FF] uppercase tracking-wider block">Class Confidence Level</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-white">
              {insight ? insight.sentimentScore : 72}
              <span className="text-xs font-normal text-[#A1A1AA]">/100</span>
            </span>
            <span className="text-xs font-semibold text-yellow-500 bg-[#1C1C1E] border border-[#27272A] px-2 py-0.5 rounded">
              {insight ? insight.sentimentLabel : 'Moderate'}
            </span>
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#8E75FF] uppercase tracking-wider block">Unresolved Doubts</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-rose-400">
              {unresolvedDoubts.length}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">Live Feed</span>
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#8E75FF] uppercase tracking-wider block">Enrolled Students</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-[#4285F4]">
              {enrolledStudents.length}
            </span>
            <span className="text-[10px] text-[#A1A1AA]">{activeClassroom.code}</span>
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#8E75FF] uppercase tracking-wider block">Completed Reviews</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-emerald-400">14</span>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Resolved</span>
          </div>
        </div>
      </div>

      {/* Teacher Tools Section */}
      <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <h2 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Teacher Tools & Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('teacher-insights')}
            className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] hover:border-[#8E75FF] text-left transition group space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#EDEDED] group-hover:text-[#8E75FF] transition">
              Class Insights & Agenda
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">See common confusion points and lecture recommendations.</p>
          </button>

          <button
            onClick={() => onNavigate('teacher-pods')}
            className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] hover:border-[#8E75FF] text-left transition group space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4285F4]/20 text-[#4285F4] flex items-center justify-center border border-[#4285F4]/30">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#EDEDED] group-hover:text-[#8E75FF] transition">
              Group Study Pods
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">Group students into balanced study pods based on strengths.</p>
          </button>

          <button
            onClick={() => onNavigate('teacher-quiz')}
            className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] hover:border-[#8E75FF] text-left transition group space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#8E75FF]/20 text-[#8E75FF] flex items-center justify-center border border-[#8E75FF]/30">
              <FileQuestion className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#EDEDED] group-hover:text-[#8E75FF] transition">
              Quiz Creator
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">Create quizzes quickly from syllabus topics.</p>
          </button>

          <button
            onClick={() => onNavigate('teacher-assessment')}
            className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] hover:border-[#8E75FF] text-left transition group space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#EDEDED] group-hover:text-[#8E75FF] transition">
              Quiz Grade Analyzer
            </h3>
            <p className="text-[11px] text-[#A1A1AA]">Upload exam scores to see class breakdown and weak areas.</p>
          </button>
        </div>
      </div>

      {/* Recent Silent Doubts Overview */}
      <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageSquareWarning className="w-4 h-4 text-rose-400" />
            Recent Unresolved Student Doubts
          </h2>
          <button
            onClick={() => onNavigate('teacher-doubts')}
            className="text-xs text-[#8E75FF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All ({unresolvedDoubts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {unresolvedDoubts.slice(0, 3).map((d) => (
            <div key={d.id} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EDEDED]">{d.studentName}</span>
                  <span className="text-[10px] text-[#A1A1AA]">• Topic: {d.conceptTag}</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.2 rounded bg-rose-900/30 text-rose-400 border border-rose-800/40">
                    {d.severity} Priority
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-1 italic">"{d.doubtSnippet}"</p>
              </div>

              <button
                onClick={() => onGenerateRemedialPlan(d)}
                className="px-3 py-1.5 rounded-lg bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Lesson Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

