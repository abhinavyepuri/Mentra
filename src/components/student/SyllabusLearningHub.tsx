import React from 'react';
import { Classroom, StudentMastery } from '../../types';
import { Layers, Bot, CheckCircle2, ArrowRight } from 'lucide-react';

interface SyllabusLearningHubProps {
  activeClassroom: Classroom;
  studentMasteries: StudentMastery[];
  onOpenSocraticTopic: (topicTitle: string) => void;
}

export const SyllabusLearningHub: React.FC<SyllabusLearningHubProps> = ({
  activeClassroom,
  studentMasteries,
  onOpenSocraticTopic,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Layers className="w-3.5 h-3.5 text-[#8E75FF]" />
            Syllabus Mastery Hub
          </div>
          <h1 className="text-2xl font-serif italic text-white">{activeClassroom.name} Course Topics</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Track concept progress and launch Socratic AI discussions directly for specific syllabus topics.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {(activeClassroom?.syllabus || []).map((topic) => {
          // Find matching mastery
          const matchingMastery = (studentMasteries || []).find((m) =>
            (topic.keyConcepts || []).some((kc) => m.concept.toLowerCase().includes(kc.toLowerCase()))
          );
          const level = matchingMastery ? matchingMastery.masteryLevel : 65;

          return (
            <div
              key={topic.id}
              className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] shadow-sm hover:border-[#8E75FF]/40 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
                <div>
                  <span className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">
                    Week {topic.weekNumber} Unit
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{topic.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase block">Concept Mastery</span>
                    <span className={`text-sm font-light ${level >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {level}%
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenSocraticTopic(topic.title)}
                    className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    Ask Tutor
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">{topic.description}</p>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-[#1C1C1E] h-2 rounded-full overflow-hidden border border-[#27272A]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${level >= 70 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${level}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Concept Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
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
          );
        })}
      </div>
    </div>
  );
};
