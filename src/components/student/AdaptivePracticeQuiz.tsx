import React, { useState } from 'react';
import { Quiz, User } from '../../types';
import { Sparkles, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, HelpCircle } from 'lucide-react';

interface AdaptivePracticeQuizProps {
  currentUser: User;
  weakConcepts: string[];
  onGenerateAdaptiveQuiz: (studentId: string, weakConcepts: string[]) => Promise<Quiz>;
  onCompleteQuiz: (quizTitle: string, score: number, total: number) => void;
}

export const AdaptivePracticeQuiz: React.FC<AdaptivePracticeQuizProps> = ({
  currentUser,
  weakConcepts,
  onGenerateAdaptiveQuiz,
  onCompleteQuiz,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    try {
      const generated = await onGenerateAdaptiveQuiz(currentUser.id, weakConcepts);
      setActiveQuiz(generated);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setSubmittedQuestions({});
      setIsFinished(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (submittedQuestions[qIdx]) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const handleSubmitAnswer = (qIdx: number) => {
    setSubmittedQuestions({ ...submittedQuestions, [qIdx]: true });
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    setIsFinished(true);
    onCompleteQuiz(activeQuiz.title, score, activeQuiz.questions.length);
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Practice Quiz (+50 PTS)
          </div>
          <h1 className="text-2xl font-serif italic text-white">Targeted Practice Quiz</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl">
            Generated to help you practice key topics: <strong className="text-white">{weakConcepts.join(', ')}</strong>.
          </p>
        </div>

        {!activeQuiz && (
          <button
            onClick={handleStartQuiz}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold shadow flex items-center gap-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Building Quiz...' : 'Generate Adaptive Practice Quiz'}
          </button>
        )}
      </div>

      {/* Start State */}
      {!activeQuiz && !isGenerating && (
        <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-4">
          <Sparkles className="w-12 h-12 text-[#8E75FF] mx-auto" />
          <h2 className="text-lg font-bold text-white">Ready to boost your concept mastery?</h2>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            Click above to generate a 3-question adaptive quiz tailored by Gemini to strengthen your exact friction points.
          </p>
          <button
            onClick={handleStartQuiz}
            className="px-6 py-3 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            Start Practice Session
          </button>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8E75FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-[#A1A1AA]">
            Gemini is formulating diagnostic questions targeting {weakConcepts[0]}...
          </p>
        </div>
      )}

      {/* Quiz Active View */}
      {activeQuiz && !isFinished && (
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-6">
          {/* Quiz Header Progress */}
          <div className="flex items-center justify-between pb-4 border-b border-[#27272A] text-xs">
            <span className="font-bold text-white">{activeQuiz.title}</span>
            <span className="font-bold text-[#8E75FF] bg-[#1C1C1E] px-3 py-1 rounded-full border border-[#27272A]">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </span>
          </div>

          {/* Current Question */}
          {(() => {
            const q = activeQuiz.questions[currentQuestionIndex];
            const isSubmitted = submittedQuestions[currentQuestionIndex];
            const selectedOpt = selectedAnswers[currentQuestionIndex];

            return (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A]">
                      Bloom: {q.bloomsTaxonomy}
                    </span>
                    <span className="text-[10px] font-semibold text-[#A1A1AA]">
                      Target Concept: {q.conceptTag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-relaxed">
                    {q.questionText}
                  </h3>
                </div>

                {/* Choices */}
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selectedOpt === optIdx;
                    const isCorrect = optIdx === q.correctOptionIndex;

                    let optStyle = 'border-[#27272A] bg-[#1C1C1E] text-[#EDEDED] hover:bg-[#27272A]';
                    if (isSubmitted) {
                      if (isCorrect) {
                        optStyle = 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400 font-bold';
                      } else if (isChosen && !isCorrect) {
                        optStyle = 'border-rose-800/50 bg-rose-900/30 text-rose-400';
                      }
                    } else if (isChosen) {
                      optStyle = 'border-[#8E75FF] bg-[#1C1C1E] text-white font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#161618] border border-[#27272A] flex items-center justify-center font-bold text-[11px] shrink-0 text-white">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Output */}
                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-1 animate-in fade-in">
                    <span className="text-[10px] font-semibold text-[#8E75FF] uppercase block">
                      AI Explanation & Solution Breakdown
                    </span>
                    <p className="text-xs text-[#EDEDED] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:bg-[#1C1C1E] transition disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>

                  {!isSubmitted ? (
                    <button
                      onClick={() => handleSubmitAnswer(currentQuestionIndex)}
                      disabled={selectedOpt === undefined}
                      className="px-5 py-2.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-40 cursor-pointer"
                    >
                      Check Answer
                    </button>
                  ) : currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="px-5 py-2.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
                    >
                      Next Question <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
                    >
                      Complete Session & Calculate Mastery
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Finished Score Summary View */}
      {isFinished && activeQuiz && (
        <div className="bg-[#161618] p-8 rounded-2xl border border-[#27272A] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow">
            <Trophy className="w-8 h-8 animate-bounce text-amber-400" />
          </div>

          <div>
            <h2 className="text-2xl font-serif italic text-white">Practice Session Complete!</h2>
            <p className="text-xs text-[#A1A1AA] mt-1">You finished the practice quiz for {weakConcepts[0] || 'Physics'}</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C1C1E] border border-[#27272A] max-w-sm mx-auto space-y-3">
            <span className="text-xs font-semibold text-[#A1A1AA] uppercase">Your Quiz Score</span>
            <div className="text-4xl font-light text-emerald-400">
              {calculateScore()} / {activeQuiz.questions.length}
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold">
              🎉 +50 Learning Points Earned!
            </div>
            <p className="text-xs text-emerald-400 font-bold pt-1">
              Topic Mastery Updated
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
          >
            Take Another Practice Quiz
          </button>
        </div>
      )}
    </div>
  );
};
