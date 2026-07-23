import React, { useState } from 'react';
import { Quiz, QuizQuestion, Classroom } from '../../types';
import {
  FileQuestion,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Edit2,
  Save,
  BookOpen,
  Clock,
  Layers,
} from 'lucide-react';

interface QuizBuilderProps {
  quizzes: Quiz[];
  activeClassroom: Classroom;
  onGenerateQuiz: (syllabusText: string, topicTag: string, numQuestions: number) => Promise<Quiz>;
  onSaveQuiz: (quiz: Quiz) => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({
  quizzes,
  activeClassroom,
  onGenerateQuiz,
  onSaveQuiz,
}) => {
  const [syllabusText, setSyllabusText] = useState<string>(
    'Rotational kinematics involves rotational displacement, angular velocity, and angular acceleration. Torque (r x F) produces angular acceleration alpha = torque / I, where I is the moment of inertia.'
  );
  const [topicTag, setTopicTag] = useState<string>('Rotational Dynamics');
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!syllabusText.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerateQuiz(syllabusText, topicTag, numQuestions);
      setActiveQuiz(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateQuestion = (qId: string, updatedFields: Partial<QuizQuestion>) => {
    if (!activeQuiz) return;
    const updatedQuestions = activeQuiz.questions.map((q) =>
      q.id === qId ? { ...q, ...updatedFields } : q
    );
    setActiveQuiz({ ...activeQuiz, questions: updatedQuestions });
  };

  const handleSave = () => {
    if (!activeQuiz) return;
    onSaveQuiz(activeQuiz);
    alert('Quiz saved to classroom assessments!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <FileQuestion className="w-3.5 h-3.5 text-[#8E75FF]" />
            AI Assessment & Quiz Builder
          </div>
          <h1 className="text-2xl font-serif italic text-white">Generate Quizzes from Syllabus Text</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-2xl">
            Input course text, lecture notes, or syllabus guidelines. Gemini automatically formulates Bloom's taxonomy-aligned questions with distractor explanations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Input Generator Form) */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8E75FF]" />
            Generator Inputs
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Topic Name / Unit Tag
              </label>
              <input
                type="text"
                value={topicTag}
                onChange={(e) => setTopicTag(e.target.value)}
                placeholder="e.g. Torque & Inertia"
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#8E75FF] placeholder-[#A1A1AA]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Syllabus / Lecture Notes Source
              </label>
              <textarea
                rows={6}
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste lecture notes, textbook excerpts, or learning objectives here..."
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#8E75FF] leading-relaxed placeholder-[#A1A1AA]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs text-[#EDEDED]"
              >
                <option value={2}>2 Questions</option>
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !syllabusText.trim()}
              className="w-full py-2.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Formulating Quiz...' : 'Generate AI Quiz Draft'}
            </button>
          </div>

          {/* Saved Quizzes List */}
          <div className="pt-4 border-t border-[#27272A] space-y-2">
            <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Classroom Quiz Bank</h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {quizzes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuiz(q)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    activeQuiz?.id === q.id
                      ? 'bg-[#1C1C1E] text-[#8E75FF] border border-[#8E75FF]/40 font-bold'
                      : 'bg-[#1C1C1E] text-[#EDEDED] border border-[#27272A] hover:bg-[#27272A]'
                  }`}
                >
                  <span className="truncate">{q.title}</span>
                  <span className="text-[10px] text-[#A1A1AA] shrink-0 ml-2">{q.questions.length} Qs</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Interactive Quiz Editor View) */}
        <div className="lg:col-span-2 space-y-6">
          {activeQuiz ? (
            <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
                <div>
                  <input
                    type="text"
                    value={activeQuiz.title}
                    onChange={(e) => setActiveQuiz({ ...activeQuiz, title: e.target.value })}
                    className="text-lg font-bold text-white bg-transparent border-b border-dashed border-[#27272A] focus:outline-none focus:border-[#8E75FF] w-full"
                  />
                  <p className="text-xs text-[#A1A1AA] mt-1">{activeQuiz.description}</p>
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Quiz Draft
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeQuiz.questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#27272A] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#8E75FF] text-white font-bold text-xs flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#27272A] text-[#8E75FF] border border-[#3F3F46]">
                          Bloom: {q.bloomsTaxonomy}
                        </span>
                        <span className="text-[10px] font-semibold text-[#A1A1AA]">
                          Tag: {q.conceptTag}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#A1A1AA]">{q.points} pts</span>
                    </div>

                    {/* Question Text */}
                    <textarea
                      rows={2}
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(q.id, { questionText: e.target.value })}
                      className="w-full p-2.5 bg-[#161618] border border-[#27272A] rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
                    />

                    {/* Options */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-[#A1A1AA] uppercase">
                        Answer Options (Click checkmark to set correct answer)
                      </label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuestion(q.id, { correctOptionIndex: optIdx })}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                              q.correctOptionIndex === optIdx
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46]'
                            }`}
                          >
                            {q.correctOptionIndex === optIdx ? <Check className="w-3.5 h-3.5" /> : String.fromCharCode(65 + optIdx)}
                          </button>

                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...q.options];
                              newOpts[optIdx] = e.target.value;
                              handleUpdateQuestion(q.id, { options: newOpts });
                            }}
                            className={`flex-1 px-3 py-1.5 rounded-lg text-xs border transition ${
                              q.correctOptionIndex === optIdx
                                ? 'border-emerald-500/50 bg-emerald-500/10 text-white font-medium'
                                : 'border-[#27272A] bg-[#161618] text-[#EDEDED]'
                            }`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 rounded-xl bg-[#161618] border border-[#27272A]">
                      <label className="block text-[10px] font-bold text-[#8E75FF] uppercase mb-1">
                        Answer Explanation
                      </label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => handleUpdateQuestion(q.id, { explanation: e.target.value })}
                        className="w-full text-xs text-[#EDEDED] bg-transparent border-b border-[#27272A] focus:outline-none focus:border-[#8E75FF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center text-[#A1A1AA]">
              Select or generate a quiz draft to start editing questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
