import React from 'react';
import { User, Classroom, StudentMastery, PeerPod, Announcement, StudentGamification } from '../../types';
import {
  Sparkles,
  Bot,
  Users,
  Trophy,
  Pin,
  ArrowRight,
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Flame,
  Zap,
  Brain,
  Star,
  CheckCircle2,
  HelpCircle,
  Info,
} from 'lucide-react';

interface StudentDashboardProps {
  currentUser: User;
  allStudents?: User[];
  activeClassroom: Classroom;
  studentMasteries: StudentMastery[];
  assignedPod: PeerPod | null;
  announcements: Announcement[];
  gamificationData?: StudentGamification;
  allGamification?: Record<string, StudentGamification>;
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  allStudents = [],
  activeClassroom,
  studentMasteries,
  assignedPod,
  announcements,
  gamificationData,
  allGamification = {},
  onNavigate,
}) => {
  const classAnnouncements = announcements.filter((a) => a.classroomId === activeClassroom.id);

  const averageMastery =
    studentMasteries.length > 0
      ? Math.round(studentMasteries.reduce((sum, m) => sum + m.masteryLevel, 0) / studentMasteries.length)
      : 65;

  const points = gamificationData?.points || 420;
  const level = gamificationData?.level || 3;
  const streakDays = gamificationData?.streakDays || 4;
  const badges = gamificationData?.badges || [];

  // Build Leaderboard
  const leaderboardList = allStudents.map((st) => {
    const gData = allGamification[st.id] || { points: 200, badges: [] };
    const unlockedCount = gData.badges?.filter((b) => b.isUnlocked).length || 0;
    return {
      studentId: st.id,
      name: st.name,
      avatar: st.avatar,
      points: gData.points || 200,
      badgeCount: unlockedCount,
      streakDays: gData.streakDays || 1,
    };
  }).sort((a, b) => b.points - a.points);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-emerald-400" />;
      default:
        return <Star className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBadgeRequirement = (name: string, description: string) => {
    switch (name) {
      case 'Socratic Explorer':
        return 'How to earn: Ask 5 questions to the AI Study Helper in your study sessions.';
      case 'Quiz Master':
        return 'How to earn: Score 80% or higher on any practice quiz.';
      case '4-Day Streak':
      case '6-Day Streak':
        return 'How to earn: Log in and complete at least one study activity every day.';
      case 'Pod Leader':
        return 'How to earn: Post helpful answers in your Group Study Pod chat.';
      case 'Physics Champion':
        return 'How to earn: Reach an 80% mastery level across 3 physics topics.';
      default:
        return `How to earn: ${description}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Gamification Quick Stats */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#161618] via-[#1C1C24] to-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background highlight */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#8E75FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {streakDays} Day Streak
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Level {level} Scholar
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif italic text-white">Welcome back, {currentUser.name}!</h1>
          <p className="text-xs text-[#A1A1AA]">
            Class: <strong className="text-white">{activeClassroom.name}</strong> • Learning Style: <span className="font-semibold text-emerald-400">{currentUser.learningStyle || 'Visual'}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
          <div className="bg-[#1C1C1E] border border-[#27272A] px-4 py-2.5 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#A1A1AA]">Learning Points</span>
                <span className="text-lg font-extrabold text-amber-400">{points} PTS</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('student-socratic')}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer shrink-0"
          >
            <Bot className="w-4 h-4" />
            Ask AI Study Helper
          </button>
        </div>
      </div>

      {/* Level & XP Progress Banner */}
      <div className="p-4 rounded-2xl bg-[#161618] border border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8E75FF] to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            L{level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Level {level} Progress</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +50 PTS on next quiz!
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              {gamificationData?.xpCurrentLevel || 120} / {gamificationData?.xpNextLevel || 250} XP to Level {level + 1}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 bg-[#1C1C1E] border border-[#27272A] h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-[#8E75FF] rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                Math.round(
                  ((gamificationData?.xpCurrentLevel || 120) / (gamificationData?.xpNextLevel || 250)) * 100
                )
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Gamification Grid: Leaderboard & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Leaderboard */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Class Leaderboard
              </h2>
              {/* Leaderboard Info Tooltip */}
              <div className="relative group/lb">
                <Info className="w-3.5 h-3.5 text-[#A1A1AA] hover:text-amber-400 cursor-pointer transition" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/lb:block w-64 p-3 bg-[#1C1C24] border border-amber-500/30 rounded-xl shadow-2xl text-[11px] text-[#EDEDED] z-30 pointer-events-none">
                  <p className="font-bold text-amber-400 mb-1">How Points & Ranking Work</p>
                  <ul className="space-y-1 text-[#A1A1AA]">
                    <li>• <strong className="text-white">+50 PTS:</strong> Complete practice quizzes</li>
                    <li>• <strong className="text-white">+10 PTS:</strong> Ask the AI Study Helper</li>
                    <li>• <strong className="text-white">Streak Bonus:</strong> Log in daily to climb higher</li>
                  </ul>
                </div>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1C1C1E] px-2 py-0.5 rounded border border-[#27272A]">
              Top Scholars
            </span>
          </div>

          <div className="space-y-2.5">
            {leaderboardList.map((st, rankIdx) => {
              const isCurrentUser = st.studentId === currentUser.id;
              let rankBadge = null;
              if (rankIdx === 0) rankBadge = <span className="text-xs font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">🥇 #1</span>;
              else if (rankIdx === 1) rankBadge = <span className="text-xs font-extrabold text-slate-300 bg-slate-400/20 border border-slate-400/30 px-2 py-0.5 rounded-full">🥈 #2</span>;
              else if (rankIdx === 2) rankBadge = <span className="text-xs font-extrabold text-amber-600 bg-amber-700/20 border border-amber-700/30 px-2 py-0.5 rounded-full">🥉 #3</span>;
              else rankBadge = <span className="text-xs font-bold text-[#A1A1AA]">#{rankIdx + 1}</span>;

              return (
                <div
                  key={st.studentId}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 border transition ${
                    isCurrentUser
                      ? 'bg-[#1C1C24] border-[#8E75FF]/50 ring-1 ring-[#8E75FF]/30'
                      : 'bg-[#1C1C1E] border-[#27272A]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 text-center">{rankBadge}</div>
                    <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/30 shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
                        {st.name} {isCurrentUser && '(You)'}
                      </p>
                      <span className="text-[10px] text-[#A1A1AA]">
                        {st.badgeCount} Badges • 🔥 {st.streakDays}d Streak
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-amber-400 block">{st.points} PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges & Milestones */}
        <div className="lg:col-span-2 bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Achievements & Badges
              </h2>
              <span className="text-[10px] text-[#A1A1AA] bg-[#1C1C1E] px-2 py-0.5 rounded border border-[#27272A] hidden sm:inline-block">
                Hover any badge to see how to earn it
              </span>
            </div>

            <span className="text-xs text-[#A1A1AA]">
              {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition relative group cursor-pointer ${
                  b.isUnlocked
                    ? 'bg-[#1C1C24] border-emerald-500/30 shadow-sm hover:border-emerald-500/60'
                    : 'bg-[#1C1C1E]/50 border-[#27272A] opacity-75 hover:opacity-100 hover:border-[#8E75FF]/40'
                }`}
              >
                {/* Badge Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 rounded-xl bg-[#1C1C24] border border-emerald-500/40 shadow-2xl z-30 pointer-events-none transition animate-in fade-in">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      {b.isUnlocked ? '✨ Badge Unlocked' : '🔒 How to Unlock'}
                    </span>
                    <span className="text-[9px] text-[#A1A1AA]">
                      {b.isUnlocked ? `Earned ${b.unlockedAt || ''}` : 'Locked'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1">{b.name}</p>
                  <p className="text-[11px] text-emerald-300 font-medium leading-relaxed">
                    {getBadgeRequirement(b.name, b.description)}
                  </p>
                </div>

                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition ${
                    b.isUnlocked
                      ? 'bg-emerald-500/20 border-emerald-500/40 group-hover:bg-emerald-500/30'
                      : 'bg-[#161618] border-[#27272A]'
                  }`}
                >
                  {getBadgeIcon(b.iconName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs font-bold truncate ${b.isUnlocked ? 'text-white' : 'text-[#A1A1AA]'}`}>
                      {b.name}
                    </h4>
                    {b.isUnlocked ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-[#A1A1AA] bg-[#161618] px-1.5 py-0.2 rounded border border-[#27272A]">
                        Hover for info
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] mt-1 leading-tight">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Topic Progress & Group Study Pod */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Progress Bars */}
        <div className="lg:col-span-2 bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#8E75FF] uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#8E75FF]" />
              Topic Progress & Mastery
            </h2>
            <button onClick={() => onNavigate('student-adaptive-quiz')} className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer">
              Take Practice Quiz (+50 PTS) →
            </button>
          </div>

          <div className="space-y-4">
            {studentMasteries.map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{m.concept}</span>
                  <span className={`font-bold ${m.masteryLevel >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {m.masteryLevel}%
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1E] border border-[#27272A] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${m.masteryLevel >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'}`}
                    style={{ width: `${m.masteryLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Study Pod Card */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
              Group Study Pod
            </span>
            <h3 className="text-lg font-bold text-white">{assignedPod?.podName || 'Quantum Pioneers'}</h3>
            <p className="text-xs text-[#A1A1AA] mt-1">Focus Topic: {assignedPod?.focusConcept || 'Rotational Mechanics'}</p>

            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase block">Teammates</span>
              {assignedPod?.members.map((mem, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#EDEDED]">
                  <img src={mem.avatar} alt={mem.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/30" />
                  <span className="font-medium">{mem.name}</span>
                  <span className="text-[9px] bg-[#1C1C1E] border border-[#27272A] px-1.5 py-0.5 rounded text-[#A1A1AA] ml-auto">
                    {mem.assignedRole}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('student-pod')}
            className="w-full py-2.5 bg-[#1C1C1E] border border-[#27272A] hover:bg-[#27272A] text-emerald-400 font-bold text-xs rounded-xl transition mt-4 cursor-pointer"
          >
            Open Group Study Pod
          </button>
        </div>
      </div>

      {/* Class Announcements */}
      <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <h2 className="text-xs font-bold text-[#8E75FF] uppercase tracking-wider">Announcements from {activeClassroom.teacherName}</h2>
        <div className="space-y-3">
          {classAnnouncements.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-400" />}
                  {a.title}
                </span>
                <span className="text-[10px] text-[#A1A1AA]">{a.date}</span>
              </div>
              <p className="text-xs text-[#EDEDED] leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

