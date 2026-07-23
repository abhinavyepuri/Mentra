import React, { useState } from 'react';
import { PeerPod, User } from '../../types';
import { Users, Target, MessageSquare, Send, Sparkles, BookOpen } from 'lucide-react';

interface PeerPodHubProps {
  pod: PeerPod | null;
  currentUser: User;
}

export const PeerPodHub: React.FC<PeerPodHubProps> = ({ pod, currentUser }) => {
  const [notes, setNotes] = useState<string>(
    "Alex: I mapped out the hollow vs solid cylinder ramp equations. Let's compare the inertia integrals in our study session!"
  );
  const [newNote, setNewNote] = useState<string>('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes((prev) => `${prev}\n${currentUser.name}: ${newNote}`);
    setNewNote('');
  };

  if (!pod) {
    return (
      <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-3">
        <Users className="w-12 h-12 text-[#A1A1AA] mx-auto" />
        <h2 className="text-sm font-bold text-white">No AI Peer Pod assigned yet</h2>
        <p className="text-xs text-[#A1A1AA]">Your teacher will cluster peer study pods soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Users className="w-3.5 h-3.5 text-[#8E75FF]" />
            AI Peer Pod Collaborative Hub
          </div>
          <h1 className="text-2xl font-serif italic text-white">{pod.podName}</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Focus Area: <strong className="text-[#8E75FF]">{pod.focusConcept}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Teammates & Roles) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-4">
            <h2 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Pod Teammates & Roles</h2>
            <div className="space-y-3">
              {(pod?.members || []).map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex items-start gap-3">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#8E75FF]/30" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{m.name}</span>
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-[#161618] text-[#8E75FF] border border-[#27272A] shrink-0">
                        {m.assignedRole}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                      <strong>Strengths:</strong> {m.strengths.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Discussion Prompt & Collaboration Scratchpad) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt */}
          <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl border border-[#27272A] shadow space-y-3">
            <div className="flex items-center gap-2 text-[#8E75FF] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#8E75FF]" />
              AI Study Prompt for Your Group
            </div>
            <p className="text-sm font-medium leading-relaxed italic text-[#EDEDED]">
              "{pod.studyPrompt}"
            </p>
            <p className="text-xs text-[#A1A1AA] pt-2 border-t border-[#27272A]">
              <strong>Recommended Activity:</strong> {pod.recommendedActivity}
            </p>
          </div>

          {/* Peer Scratchpad */}
          <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
            <h2 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#8E75FF]" />
              Pod Collaborative Scratchpad
            </h2>

            <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] text-xs text-[#EDEDED] font-mono whitespace-pre-wrap leading-relaxed min-h-32">
              {notes}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Share a study note or formula with your pod..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
