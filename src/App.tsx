import React, { useState, useEffect } from 'react';
import {
  User,
  Role,
  Classroom,
  Doubt,
  RemedialPlan,
  ClassroomInsight,
  PeerPod,
  Quiz,
  AssessmentReport,
  Announcement,
  Department,
  StudentMastery,
  SocraticMessage,
  TeacherAlert,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_CLASSROOMS,
  INITIAL_DOUBTS,
  INITIAL_DEPARTMENTS,
  INITIAL_INSIGHTS,
  INITIAL_PEER_PODS,
  INITIAL_QUIZZES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_STUDENT_MASTERY,
  INITIAL_GAMIFICATION,
  INITIAL_TEACHER_ALERTS,
} from './data/mockData';

// Layout Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Teacher Components
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { SilentDoubtFeed } from './components/teacher/SilentDoubtFeed';
import { InsightsCompiler } from './components/teacher/InsightsCompiler';
import { PeerPodClusterer } from './components/teacher/PeerPodClusterer';
import { QuizBuilder } from './components/teacher/QuizBuilder';
import { AssessmentAnalyzer } from './components/teacher/AssessmentAnalyzer';
import { ClassroomManager } from './components/teacher/ClassroomManager';
import { RemedialPlanModal } from './components/teacher/RemedialPlanModal';
import { IntegrationsModal } from './components/IntegrationsModal';

// Student Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { SocraticTutor } from './components/student/SocraticTutor';
import { AdaptivePracticeQuiz } from './components/student/AdaptivePracticeQuiz';
import { PeerPodHub } from './components/student/PeerPodHub';
import { SyllabusLearningHub } from './components/student/SyllabusLearningHub';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  // User & Classroom State
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(
    INITIAL_USERS.find((u) => u.role === 'teacher') || INITIAL_USERS[0]
  );

  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [activeClassroom, setActiveClassroom] = useState<Classroom>(INITIAL_CLASSROOMS[0]);
  const [currentTab, setCurrentTab] = useState<string>('teacher-dashboard');

  // Domain Data States
  const [doubts, setDoubts] = useState<Doubt[]>(INITIAL_DOUBTS);
  const [insights, setInsights] = useState<ClassroomInsight | null>(INITIAL_INSIGHTS);
  const [peerPods, setPeerPods] = useState<PeerPod[]>(INITIAL_PEER_PODS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [reports, setReports] = useState<AssessmentReport[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [studentMasteries, setStudentMasteries] = useState<StudentMastery[]>(INITIAL_STUDENT_MASTERY);
  const [alerts, setAlerts] = useState<TeacherAlert[]>(INITIAL_TEACHER_ALERTS);
  const [allGamification, setAllGamification] = useState(INITIAL_GAMIFICATION);

  // Performance Optimization State
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean>(() => {
    return localStorage.getItem('mentra_low_power_mode') === 'true';
  });

  useEffect(() => {
    if (isLowPowerMode) {
      document.body.classList.add('low-power-mode');
    } else {
      document.body.classList.remove('low-power-mode');
    }
    localStorage.setItem('mentra_low_power_mode', String(isLowPowerMode));
  }, [isLowPowerMode]);

  // Modal State
  const [remedialModalOpen, setRemedialModalOpen] = useState<boolean>(false);
  const [showIntegrationsModal, setShowIntegrationsModal] = useState<boolean>(false);
  const [activeRemedialPlan, setActiveRemedialPlan] = useState<RemedialPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);
  const [isLoadingPods, setIsLoadingPods] = useState<boolean>(false);

  // Sync user object whenever role changes
  useEffect(() => {
    const matchedUser = users.find((u) => u.role === currentRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    }
    // Set default tab for role
    if (currentRole === 'teacher') setCurrentTab('teacher-dashboard');
    else if (currentRole === 'student') setCurrentTab('student-dashboard');
    else if (currentRole === 'admin') setCurrentTab('admin-dashboard');
  }, [currentRole, users]);

  // Handle Role Switch
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
  };

  // Reset System State
  const handleResetData = () => {
    setUsers(INITIAL_USERS);
    setClassrooms(INITIAL_CLASSROOMS);
    setDoubts(INITIAL_DOUBTS);
    setInsights(INITIAL_INSIGHTS);
    setPeerPods(INITIAL_PEER_PODS);
    setQuizzes(INITIAL_QUIZZES);
    setReports([]);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setDepartments(INITIAL_DEPARTMENTS);
    setStudentMasteries(INITIAL_STUDENT_MASTERY);
    alert('Mentra system data reset to default seed state!');
  };

  // --------------------------------------------------------------------------
  // API CALL HANDLERS
  // --------------------------------------------------------------------------

  // 1. Socratic Tutor Prompt API
  const handleSendSocraticPrompt = async (
    prompt: string,
    history: SocraticMessage[],
    topic: string
  ) => {
    try {
      const response = await fetch('/api/gemini/socratic-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          history,
          topic,
          studentName: currentUser.name,
          studentId: currentUser.id,
          classroomId: activeClassroom.id,
        }),
      });

      const data = await response.json();

      if (data.doubtLogged && data.detectedDoubt) {
        // Append new silent doubt to state
        setDoubts((prev) => [data.detectedDoubt, ...prev]);
      }

      return {
        replyText: data.replyText,
        doubtLogged: data.doubtLogged,
        detectedDoubt: data.detectedDoubt,
      };
    } catch (e) {
      console.error(e);
      return {
        replyText:
          "I understand your question! Let's think about this: What physical quantity changes when mass is moved further from the axis of rotation?",
        doubtLogged: false,
        detectedDoubt: null,
      };
    }
  };

  // 2. Generate Remedial Plan for Doubt
  const handleGenerateRemedialPlan = async (doubt: Doubt) => {
    setRemedialModalOpen(true);
    setIsGeneratingPlan(true);
    setActiveRemedialPlan(null);

    try {
      const response = await fetch('/api/gemini/remedial-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doubtId: doubt.id,
          studentName: doubt.studentName,
          conceptTag: doubt.conceptTag,
          doubtSnippet: doubt.doubtSnippet,
          classroomId: activeClassroom.id,
        }),
      });

      const plan: RemedialPlan = await response.json();
      setActiveRemedialPlan(plan);
    } catch (e) {
      console.error(e);
      // Fallback fallback plan
      setActiveRemedialPlan({
        id: `rp-fallback-${Date.now()}`,
        doubtId: doubt.id,
        studentName: doubt.studentName,
        conceptTag: doubt.conceptTag,
        rootMisconception: 'Conflating scalar mass distribution with rotational inertia tensor.',
        guidedSteps: [
          '1. Contrast linear inertia (F = ma) with rotational inertia (Torque = I * alpha).',
          '2. Demonstrate r^2 scaling using identical mass cylinders.',
          '3. Assign targeted 3-minute physical demonstration.',
        ],
        interactiveAnalogies: [
          'Spinning on an office chair with arms extended vs arms pulled inward.',
        ],
        targetedPracticeQuestions: [
          'Why does a figure skater spin faster when pulling their arms close to their body?',
        ],
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // 3. Resolve Doubt
  const handleResolveDoubt = async (doubtId: string) => {
    try {
      await fetch(`/api/doubts/${doubtId}/resolve`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setDoubts((prev) =>
      prev.map((d) => (d.id === doubtId ? { ...d, status: 'resolved' as const } : d))
    );
  };

  // 4. Recompile Classroom Insights
  const handleRecompileInsights = async () => {
    setIsLoadingInsight(true);
    try {
      const response = await fetch('/api/gemini/classroom-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classroomId: activeClassroom.id }),
      });
      const updatedInsight: ClassroomInsight = await response.json();
      setInsights(updatedInsight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // 5. Recluster AI Peer Pods
  const handleReclusterPods = async () => {
    setIsLoadingPods(true);
    try {
      const response = await fetch('/api/gemini/peer-pods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classroomId: activeClassroom.id }),
      });
      const pods: PeerPod[] = await response.json();
      setPeerPods(pods);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPods(false);
    }
  };

  // 6. Generate Quiz
  const handleGenerateQuiz = async (
    syllabusText: string,
    topicTag: string,
    numQuestions: number
  ) => {
    const response = await fetch('/api/gemini/quiz-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syllabusText,
        topicTag,
        numQuestions,
        classroomId: activeClassroom.id,
      }),
    });
    const newQuiz: Quiz = await response.json();
    setQuizzes((prev) => [newQuiz, ...prev]);
    return newQuiz;
  };

  // 7. Save Quiz
  const handleSaveQuiz = (quiz: Quiz) => {
    setQuizzes((prev) => {
      const exists = prev.some((q) => q.id === quiz.id);
      if (exists) {
        return prev.map((q) => (q.id === quiz.id ? quiz : q));
      }
      return [quiz, ...prev];
    });
  };

  // 8. Adaptive Practice Quiz Generator
  const handleGenerateAdaptiveQuiz = async (studentId: string, weakConcepts: string[]) => {
    const response = await fetch('/api/gemini/adaptive-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, weakConcepts }),
    });
    const quiz: Quiz = await response.json();
    return quiz;
  };

  // 9. Complete Practice Quiz
  const handleCompleteQuiz = (quizTitle: string, score: number, total: number) => {
    // Boost student mastery levels
    setStudentMasteries((prev) =>
      prev.map((m) =>
        m.studentId === currentUser.id
          ? { ...m, masteryLevel: Math.min(100, m.masteryLevel + 12) }
          : m
      )
    );

    // Award +50 Gamification points
    setAllGamification((prev) => {
      const userGamData = prev[currentUser.id] || { points: 200, level: 2, streakDays: 3, xpCurrentLevel: 100, xpNextLevel: 250, badges: [] };
      const newPoints = userGamData.points + 50;
      const newXp = userGamData.xpCurrentLevel + 50;
      let newLevel = userGamData.level;
      let nextXpLevel = userGamData.xpNextLevel;

      if (newXp >= nextXpLevel) {
        newLevel += 1;
        nextXpLevel += 150;
      }

      return {
        ...prev,
        [currentUser.id]: {
          ...userGamData,
          points: newPoints,
          level: newLevel,
          xpCurrentLevel: newXp,
          xpNextLevel: nextXpLevel,
        },
      };
    });
  };

  // 10. Analyze Assessment Data
  const handleAnalyzeAssessment = async (title: string, rawText: string) => {
    const response = await fetch('/api/gemini/assessment-analyzer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        rawText,
        classroomId: activeClassroom.id,
      }),
    });
    const report: AssessmentReport = await response.json();
    setReports((prev) => [report, ...prev]);
    return report;
  };

  // 11. Post Announcement
  const handlePostAnnouncement = (annTitle: string, content: string) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      classroomId: activeClassroom.id,
      authorName: activeClassroom.teacherName,
      title: annTitle,
      content,
      date: 'Just now',
      pinned: true,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Admin Actions
  const handleAddDepartment = (dept: Partial<Department>) => {
    const newD: Department = {
      id: `dept-${Date.now()}`,
      name: dept.name || 'New Dept',
      code: dept.code || 'DEPT',
      headTeacherId: dept.headTeacherId || 'u-teacher-1',
      description: dept.description || '',
    };
    setDepartments((prev) => [...prev, newD]);
  };

  const handleAddUser = (u: Partial<User>) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: u.name || 'New User',
      email: u.email || 'user@mentra.edu',
      role: u.role || 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleAddClassroom = (c: Partial<Classroom>) => {
    const newC: Classroom = {
      id: `c-${Date.now()}`,
      name: c.name || 'New Classroom',
      code: c.code || 'CLASS-101',
      departmentId: c.departmentId || 'dept-sci',
      teacherId: c.teacherId || 'u-teacher-1',
      teacherName: c.teacherName || 'Dr. Sarah Vance',
      studentIds: ['u-student-1', 'u-student-2', 'u-student-3'],
      schedule: c.schedule || 'Tue / Thu 10:00 AM',
      description: c.description || '',
      syllabus: c.syllabus || [],
      createdAt: new Date().toISOString(),
    };
    setClassrooms((prev) => [...prev, newC]);
    setActiveClassroom(newC);
  };

  // Helper variables
  const enrolledStudents = users.filter(
    (u) => u.role === 'student' && activeClassroom.studentIds.includes(u.id)
  );
  const assignedPod = peerPods[0] || null;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDED] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={users}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setCurrentRole(u.role);
        }}
        activeClassroom={activeClassroom}
        allClassrooms={classrooms}
        onSelectClassroom={setActiveClassroom}
        onResetData={handleResetData}
        isResetting={false}
        activeAlertCount={alerts.filter((a) => !a.isResolved).length}
        onOpenAlerts={() => setCurrentTab('teacher-dashboard')}
        onOpenIntegrations={() => setShowIntegrationsModal(true)}
        isLowPowerMode={isLowPowerMode}
        onToggleLowPowerMode={() => setIsLowPowerMode(!isLowPowerMode)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          role={currentRole}
          activeTab={currentTab}
          onTabChange={setCurrentTab}
          unresolvedDoubtCount={doubts.filter((d) => d.status === 'unresolved').length}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* TEACHER VIEWS */}
          {currentRole === 'teacher' && (
            <>
              {currentTab === 'teacher-dashboard' && (
                <TeacherDashboard
                  activeClassroom={activeClassroom}
                  doubts={doubts}
                  insight={insights}
                  announcements={announcements}
                  enrolledStudents={enrolledStudents}
                  alerts={alerts}
                  onResolveAlert={(alertId) =>
                    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, isResolved: true } : a)))
                  }
                  onNavigate={setCurrentTab}
                  onGenerateRemedialPlan={handleGenerateRemedialPlan}
                />
              )}

              {currentTab === 'teacher-doubts' && (
                <SilentDoubtFeed
                  doubts={doubts}
                  onGenerateRemedialPlan={handleGenerateRemedialPlan}
                  onUpdateStatus={(id, status) =>
                    setDoubts((prev) =>
                      prev.map((d) => (d.id === id ? { ...d, status } : d))
                    )
                  }
                />
              )}

              {currentTab === 'teacher-insights' && (
                <InsightsCompiler
                  insight={insights}
                  activeClassroom={activeClassroom}
                  onRecompile={handleRecompileInsights}
                  isLoading={isLoadingInsight}
                />
              )}

              {currentTab === 'teacher-pods' && (
                <PeerPodClusterer
                  pods={peerPods}
                  activeClassroom={activeClassroom}
                  onReclusterPods={handleReclusterPods}
                  isLoading={isLoadingPods}
                />
              )}

              {currentTab === 'teacher-quiz' && (
                <QuizBuilder
                  quizzes={quizzes}
                  activeClassroom={activeClassroom}
                  onGenerateQuiz={handleGenerateQuiz}
                  onSaveQuiz={handleSaveQuiz}
                />
              )}

              {currentTab === 'teacher-assessment' && (
                <AssessmentAnalyzer
                  reports={reports}
                  activeClassroom={activeClassroom}
                  onAnalyzeAssessment={handleAnalyzeAssessment}
                />
              )}

              {currentTab === 'teacher-syllabus' && (
                <ClassroomManager
                  activeClassroom={activeClassroom}
                  announcements={announcements}
                  enrolledStudents={enrolledStudents}
                  studentMasteries={studentMasteries}
                  onPostAnnouncement={handlePostAnnouncement}
                  onUpdateSyllabusTopic={(updated) => setActiveClassroom(updated)}
                />
              )}
            </>
          )}

          {/* STUDENT VIEWS */}
          {currentRole === 'student' && (
            <>
              {currentTab === 'student-dashboard' && (
                <StudentDashboard
                  currentUser={currentUser}
                  allStudents={users.filter((u) => u.role === 'student')}
                  activeClassroom={activeClassroom}
                  studentMasteries={studentMasteries}
                  assignedPod={assignedPod}
                  announcements={announcements}
                  gamificationData={allGamification[currentUser.id]}
                  allGamification={allGamification}
                  onNavigate={setCurrentTab}
                />
              )}

              {currentTab === 'student-socratic' && (
                <SocraticTutor
                  currentUser={currentUser}
                  activeClassroom={activeClassroom}
                  onSendSocraticPrompt={handleSendSocraticPrompt}
                />
              )}

              {currentTab === 'student-adaptive-quiz' && (
                <AdaptivePracticeQuiz
                  currentUser={currentUser}
                  weakConcepts={['Moment of Inertia', 'Cross Product Direction']}
                  onGenerateAdaptiveQuiz={handleGenerateAdaptiveQuiz}
                  onCompleteQuiz={handleCompleteQuiz}
                />
              )}

              {currentTab === 'student-pod' && (
                <PeerPodHub pod={assignedPod} currentUser={currentUser} />
              )}

              {currentTab === 'student-syllabus' && (
                <SyllabusLearningHub
                  activeClassroom={activeClassroom}
                  studentMasteries={studentMasteries}
                  onOpenSocraticTopic={(topicTitle) => {
                    setCurrentTab('student-socratic');
                  }}
                />
              )}
            </>
          )}

          {/* ADMIN VIEWS */}
          {currentRole === 'admin' && (
            <AdminDashboard
              currentUser={currentUser}
              users={users}
              departments={departments}
              classrooms={classrooms}
              doubts={doubts}
              onAddDepartment={handleAddDepartment}
              onAddUser={handleAddUser}
              onAddClassroom={handleAddClassroom}
            />
          )}
        </main>
      </div>

      {/* Global Remedial Plan Modal */}
      <RemedialPlanModal
        isOpen={remedialModalOpen}
        onClose={() => setRemedialModalOpen(false)}
        plan={activeRemedialPlan}
        isLoading={isGeneratingPlan}
      />

      {/* Global LMS & Analytics Integrations Modal */}
      <IntegrationsModal
        isOpen={showIntegrationsModal}
        onClose={() => setShowIntegrationsModal(false)}
      />
    </div>
  );
}
