import React, { useState } from 'react';
import { AssessmentReport, Classroom } from '../../types';
import {
  BarChart3,
  Sparkles,
  Upload,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface AssessmentAnalyzerProps {
  reports: AssessmentReport[];
  activeClassroom: Classroom;
  onAnalyzeAssessment: (title: string, rawText: string) => Promise<AssessmentReport>;
}

export const AssessmentAnalyzer: React.FC<AssessmentAnalyzerProps> = ({
  reports,
  activeClassroom,
  onAnalyzeAssessment,
}) => {
  const [title, setTitle] = useState<string>('Midterm Mechanics Exam');
  const [rawText, setRawText] = useState<string>(
    `Student Scores & Item Analysis:
Q1 (Rotational Inertia): 12 Correct, 16 Missed (64% picked choice B - confusing scalar mass)
Q2 (Torque Direction): 18 Correct, 10 Missed
Q3 (Conservation of Angular Momentum): 22 Correct, 6 Missed
Class Scores: 92, 88, 85, 84, 80, 78, 76, 75, 72, 70, 68, 65, 62, 58, 55, 48`
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<AssessmentReport | null>(reports[0] || null);

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await onAnalyzeAssessment(title, rawText);
      setSelectedReport(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-[#8E75FF]" />
            Assessment Data & Psychometric Analyzer
          </div>
          <h1 className="text-2xl font-serif italic text-white">Deep Exam Item Diagnostic</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-2xl">
            Upload exam CSVs or paste item analysis text. Gemini extracts grade distributions, distractor choice patterns, and specific concept remediation triggers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Upload / Text Input Form) */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#8E75FF]" />
            Upload Exam Data
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Raw Score / Item Breakdown Text
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste score lists, item response frequencies, or distractor analysis..."
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#8E75FF] leading-relaxed font-mono placeholder-[#A1A1AA]"
              ></textarea>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="w-full py-2.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              {isAnalyzing ? 'Analyzing Item Responses...' : 'Run Gemini Diagnostic'}
            </button>
          </div>

          {/* Past Reports List */}
          <div className="pt-4 border-t border-[#27272A] space-y-2">
            <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Saved Diagnostic Reports</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {reports.map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                    selectedReport?.id === rep.id
                      ? 'bg-[#1C1C1E] text-[#8E75FF] border border-[#8E75FF]/40 font-bold'
                      : 'bg-[#1C1C1E] text-[#EDEDED] border border-[#27272A] hover:bg-[#27272A]'
                  }`}
                >
                  <span className="truncate">{rep.title}</span>
                  <span className="text-[10px] text-[#A1A1AA] shrink-0 ml-2">{rep.averageScore}% avg</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Diagnostic Analysis Dashboard View) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedReport ? (
            <div className="space-y-6">
              {/* Stat Overview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-[#161618] p-4 rounded-2xl border border-[#27272A]">
                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase block">Total Assessed</span>
                  <span className="text-2xl font-light text-white mt-1 block">
                    {selectedReport.totalStudents} Students
                  </span>
                </div>
                <div className="bg-[#161618] p-4 rounded-2xl border border-[#27272A]">
                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase block">Class Mean Score</span>
                  <span className="text-2xl font-light text-[#8E75FF] mt-1 block">
                    {selectedReport.averageScore}%
                  </span>
                </div>
                <div className="bg-[#161618] p-4 rounded-2xl border border-[#27272A] col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase block">Diagnostic Status</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded inline-block mt-2">
                    Action Plan Ready
                  </span>
                </div>
              </div>

              {/* Grade Distribution Chart */}
              <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
                <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">
                  Grade Spectrum Distribution
                </h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedReport.gradeDistribution}>
                      <XAxis dataKey="grade" stroke="#A1A1AA" fontSize={10} />
                      <YAxis stroke="#A1A1AA" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', borderColor: '#27272A', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {selectedReport.gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Concept Breakdown */}
              <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
                <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">
                  Concept Mastery Breakdown
                </h3>
                <div className="space-y-3">
                  {selectedReport.conceptBreakdown.map((cb, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{cb.concept}</span>
                        <span className="text-[10px] text-[#A1A1AA] capitalize">Status: {cb.status.replace('_', ' ')}</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cb.masteryPercentage >= 75 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-900/30 text-rose-400 border border-rose-800/40'}`}>
                        {cb.masteryPercentage}% Mastery
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distractor Insights & Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1C1C1E] p-5 rounded-2xl border border-[#27272A] space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Distractor Analysis
                  </h4>
                  <ul className="space-y-2 text-xs text-[#EDEDED] list-disc list-inside">
                    {selectedReport.distractorInsights.map((insight, idx) => (
                      <li key={idx} className="leading-relaxed">{insight}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#1C1C1E] p-5 rounded-2xl border border-[#27272A] space-y-3">
                  <h4 className="text-xs font-bold text-[#8E75FF] uppercase flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-[#8E75FF]" />
                    Recommended Interventions
                  </h4>
                  <ul className="space-y-2 text-xs text-[#EDEDED] list-disc list-inside">
                    {selectedReport.actionPlan.map((act, idx) => (
                      <li key={idx} className="leading-relaxed">{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center text-[#A1A1AA]">
              Run or select an assessment report to view item response diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
