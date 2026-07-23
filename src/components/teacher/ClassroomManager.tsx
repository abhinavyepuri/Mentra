import React, { useState } from 'react';
import { Classroom, Announcement, User, StudentMastery } from '../../types';
import { BookOpenCheck, Pin, Plus, Users, Send, Layers, CheckCircle } from 'lucide-react';

interface ClassroomManagerProps {
  activeClassroom: Classroom;
  announcements: Announcement[];
  enrolledStudents: User[];
  studentMasteries: StudentMastery[];
  onPostAnnouncement: (title: string, content: string) => void;
  onUpdateSyllabusTopic: (classroom: Classroom) => void;
}

export const ClassroomManager: React.FC<ClassroomManagerProps> = ({
  activeClassroom,
  announcements,
  enrolledStudents,
  studentMasteries,
  onPostAnnouncement,
  onUpdateSyllabusTopic,
}) => {
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [activeTab, setActiveTab] = useState<'syllabus' | 'announcements' | 'roster'>('syllabus');

  const classAnnouncements = announcements.filter((a) => a.classroomId === activeClassroom.id);

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    onPostAnnouncement(annTitle, annContent);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <BookOpenCheck className="w-3.5 h-3.5 text-[#8E75FF]" />
            Classroom & Syllabus Operations
          </div>
          <h1 className="text-2xl font-serif italic text-white">{activeClassroom.name} ({activeClassroom.code})</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Instructor: {activeClassroom.teacherName} • Schedule: {activeClassroom.schedule}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#27272A] gap-4">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'syllabus'
              ? 'border-[#8E75FF] text-[#8E75FF]'
              : 'border-transparent text-[#A1A1AA] hover:text-white'
          }`}
        >
          Syllabus Breakdown ({activeClassroom.syllabus.length} Units)
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`pb-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'announcements'
              ? 'border-[#8E75FF] text-[#8E75FF]'
              : 'border-transparent text-[#A1A1AA] hover:text-white'
          }`}
        >
          Announcements ({classAnnouncements.length})
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
            activeTab === 'roster'
              ? 'border-[#8E75FF] text-[#8E75FF]'
              : 'border-transparent text-[#A1A1AA] hover:text-white'
          }`}
        >
          Enrolled Roster ({enrolledStudents.length} Students)
        </button>
      </div>

      {/* Tab 1: Syllabus */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          {activeClassroom.syllabus.map((topic) => (
            <div
              key={topic.id}
              className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#8E75FF] uppercase tracking-wider">
                  Week {topic.weekNumber}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    topic.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : topic.status === 'in_progress'
                      ? 'bg-[#8E75FF]/20 text-[#8E75FF] border border-[#8E75FF]/30'
                      : 'bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]'
                  }`}
                >
                  {topic.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{topic.title}</h3>
              <p className="text-xs text-[#EDEDED]">{topic.description}</p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {topic.keyConcepts.map((kc, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-[#1C1C1E] text-[#EDEDED] px-2.5 py-1 rounded-md border border-[#27272A]"
                  >
                    {kc}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Post New Announcement */}
          <form onSubmit={handleAnnouncementSubmit} className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-3">
            <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Post Classroom Announcement</h3>
            <input
              type="text"
              placeholder="Announcement Title"
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF] text-white placeholder-[#A1A1AA]"
            />
            <textarea
              rows={3}
              placeholder="Announcement Details..."
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF] text-white placeholder-[#A1A1AA]"
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Announcement
            </button>
          </form>

          {/* List */}
          <div className="space-y-3">
            {classAnnouncements.map((a) => (
              <div key={a.id} className="bg-[#161618] p-4 rounded-2xl border border-[#27272A] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {a.pinned && <Pin className="w-3.5 h-3.5 text-[#8E75FF]" />}
                    {a.title}
                  </h4>
                  <span className="text-[10px] text-[#A1A1AA]">{a.date}</span>
                </div>
                <p className="text-xs text-[#EDEDED] leading-relaxed">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Roster */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledStudents.map((st) => {
            const masteries = studentMasteries.filter((m) => m.studentId === st.id);
            return (
              <div key={st.id} className="bg-[#161618] p-4 rounded-2xl border border-[#27272A] flex items-start gap-4">
                <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8E75FF]/30" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{st.name}</h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A]">
                      {st.learningStyle || 'Visual'} Learner
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A1A1AA]">{st.email}</p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-semibold text-[#8E75FF] uppercase block">Concept Mastery:</span>
                    {masteries.length > 0 ? (
                      masteries.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-[#EDEDED] truncate max-w-[140px]">{m.concept}</span>
                          <span className={`font-bold ${m.masteryLevel >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {m.masteryLevel}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[10px] text-[#A1A1AA] italic">No recent diagnostic tests</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
