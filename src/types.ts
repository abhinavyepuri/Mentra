export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  departmentId?: string;
  enrolledClassroomIds?: string[]; // for students
  teachingClassroomIds?: string[]; // for teachers
  gradeLevel?: string;
  learningStyle?: 'Visual' | 'Auditory' | 'Kinesthetic' | 'Logical' | 'Social';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headTeacherId: string;
  description: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  keyConcepts: string[];
  status: 'upcoming' | 'in_progress' | 'completed';
}

export interface Classroom {
  id: string;
  name: string;
  code: string; // e.g. "PHYS-301"
  departmentId: string;
  teacherId: string;
  teacherName: string;
  description: string;
  studentIds: string[];
  syllabus: SyllabusTopic[];
  createdAt: string;
  schedule: string;
}

export interface Doubt {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  topic: string;
  conceptTag: string;
  doubtSnippet: string;
  fullConversationSnippet?: string;
  severity: 'high' | 'medium' | 'low';
  status: 'unresolved' | 'in_review' | 'remediated';
  createdAt: string;
  aiReasoning?: string;
  remedialPlanId?: string;
}

export interface RemedialPlan {
  id: string;
  classroomId: string;
  concept: string;
  targetStudentName?: string;
  coreMisconception: string;
  learningObjectives: string[];
  stepByStepActionPlan: {
    step: number;
    title: string;
    description: string;
  }[];
  visualAnalogy: string;
  diagnosticQuestions: {
    question: string;
    expectedAnswer: string;
    misconceptionTrigger: string;
  }[];
  quickClassActivity: string;
  createdAt: string;
}

export interface PeerPodMember {
  studentId: string;
  name: string;
  avatar: string;
  assignedRole: 'Facilitator' | 'Explainer' | 'Synthesizer' | 'Questioner';
  strengths: string[];
  growthArea: string;
}

export interface PeerPod {
  id: string;
  classroomId: string;
  podName: string;
  focusConcept: string;
  members: PeerPodMember[];
  studyPrompt: string;
  recommendedActivity: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  conceptTag: string;
  bloomsTaxonomy: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  points: number;
}

export interface Quiz {
  id: string;
  classroomId: string;
  title: string;
  description: string;
  topicTag: string;
  questions: QuizQuestion[];
  isPublished: boolean;
  createdAt: string;
  timeLimitMinutes: number;
}

export interface AdaptiveQuizSubmission {
  id: string;
  studentId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  weakConceptsTested: string[];
  conceptsMastered: string[];
  submittedAt: string;
}

export interface AssessmentReport {
  id: string;
  classroomId: string;
  title: string;
  uploadDate: string;
  totalStudents: number;
  averageScore: number;
  gradeDistribution: { grade: string; count: number }[];
  conceptBreakdown: { concept: string; masteryPercentage: number; status: 'mastered' | 'needs_work' | 'critical' }[];
  distractorInsights: string[];
  actionPlan: string[];
}

export interface ClassroomInsight {
  id: string;
  classroomId: string;
  generatedAt: string;
  sentimentScore: number; // 0-100
  sentimentLabel: 'High Confidence' | 'Moderate Confusion' | 'Critical Misconceptions';
  summary: string;
  topWeakConcepts: { concept: string; confusionPercentage: number; keyBarrier: string }[];
  microRevisions: string[];
  nextLectureAgenda: string[];
}

export interface Announcement {
  id: string;
  classroomId: string;
  authorName: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

export interface StudentMastery {
  studentId: string;
  concept: string;
  masteryLevel: number; // 0-100
  lastAssessed: string;
}

export interface SocraticMessage {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
  detectedDoubt?: {
    concept: string;
    severity: 'high' | 'medium' | 'low';
    doubtSnippet: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string; // e.g. 'Award', 'Zap', 'Target', 'Flame', 'Brain'
  unlockedAt?: string;
  isUnlocked: boolean;
  category: 'quiz' | 'socratic' | 'streak' | 'mastery' | 'peer';
}

export interface StudentGamification {
  studentId: string;
  points: number;
  level: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  streakDays: number;
  badges: Badge[];
}

export interface LeaderboardEntry {
  studentId: string;
  name: string;
  avatar: string;
  points: number;
  badgeCount: number;
  rank: number;
  streakDays: number;
}

export interface TeacherAlert {
  id: string;
  classroomId: string;
  studentId: string;
  studentName: string;
  type: 'struggling' | 'high_doubts' | 'disengaged';
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  createdAt: string;
  isResolved: boolean;
  suggestedAction: string;
}

