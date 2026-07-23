import React from 'react';
import { RemedialPlan } from '../../types';
import {
  X,
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';

interface RemedialPlanModalProps {
  plan: RemedialPlan | null;
  onClose: () => void;
  isLoading?: boolean;
}

export const RemedialPlanModal: React.FC<RemedialPlanModalProps> = ({
  plan,
  onClose,
  isLoading = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!plan && !isLoading) return null;

  const handleCopy = () => {
    if (!plan) return;
    const text = `MENTRA AI REMEDIAL PLAN
Concept: ${plan.concept}
Target Student: ${plan.targetStudentName || 'Classroom-wide'}
Core Misconception: ${plan.coreMisconception}

Visual Analogy:
${plan.visualAnalogy}

3-Step Action Plan:
${plan.stepByStepActionPlan.map((s) => `Step ${s.step}: ${s.title}\n${s.description}`).join('\n\n')}

Diagnostic Question:
${plan.diagnosticQuestions[0]?.question || ''}
Expected Answer: ${plan.diagnosticQuestions[0]?.expectedAnswer || ''}

Quick Classroom Activity:
${plan.quickClassActivity}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#161618] border border-[#27272A] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200 text-white">
        {/* Header */}
        <div className="bg-[#161618] border-b border-[#27272A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#8E75FF] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Gemini 3.6 Flash • AI Remedial Plan Generator
          </div>
          <h2 className="text-2xl font-serif italic text-white mt-1">
            {isLoading ? 'Generating Remedial Plan...' : plan?.concept}
          </h2>
          {plan?.targetStudentName && (
            <p className="text-sm text-[#A1A1AA] mt-0.5">
              Targeted Remediation for: <span className="font-semibold text-white">{plan.targetStudentName}</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#8E75FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#A1A1AA] font-medium text-xs">
              Gemini is diagnosing conceptual gaps and constructing a step-by-step action plan...
            </p>
          </div>
        ) : plan ? (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Core Misconception */}
            <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A]">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Identified Core Misconception</span>
              </div>
              <p className="text-sm text-[#EDEDED] mt-1.5 leading-relaxed">
                {plan.coreMisconception}
              </p>
            </div>

            {/* Visual Analogy */}
            <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A]">
              <div className="flex items-center gap-2 text-[#8E75FF] font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#8E75FF]" />
                <span>Intuitive Visual Analogy</span>
              </div>
              <p className="text-sm text-[#EDEDED] mt-1.5 italic leading-relaxed">
                "{plan.visualAnalogy}"
              </p>
            </div>

            {/* Step by Step Action Plan */}
            <div>
              <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider mb-3">
                3-Step Pedagogical Action Plan
              </h3>
              <div className="space-y-3">
                {plan.stepByStepActionPlan.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#8E75FF] text-white font-bold flex items-center justify-center shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Questions */}
            <div>
              <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider mb-3">
                Diagnostic Check Question
              </h3>
              {plan.diagnosticQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-2">
                  <div className="flex items-start gap-2 text-white font-medium text-sm">
                    <HelpCircle className="w-4 h-4 text-[#8E75FF] shrink-0 mt-0.5" />
                    <span>{q.question}</span>
                  </div>
                  <div className="pl-6 text-xs text-emerald-400 font-medium">
                    Expected Target Answer: {q.expectedAnswer}
                  </div>
                  <div className="pl-6 text-[11px] text-[#A1A1AA]">
                    Triggers: {q.misconceptionTrigger}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Class Activity */}
            <div className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A]">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5-Minute Classroom Micro-Activity</span>
              </div>
              <p className="text-sm text-[#EDEDED] mt-1.5 leading-relaxed">
                {plan.quickClassActivity}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
              <p className="text-xs text-[#A1A1AA]">Saved to classroom remedial records</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl border border-[#27272A] bg-[#1C1C1E] text-xs font-semibold text-[#EDEDED] hover:bg-[#27272A] transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Plan'}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold shadow transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
