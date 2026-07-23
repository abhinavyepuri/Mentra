import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_CLASSROOMS,
  INITIAL_DOUBTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PEER_PODS,
  INITIAL_QUIZZES,
  INITIAL_STUDENT_MASTERY,
  INITIAL_INSIGHTS,
} from './src/data/mockData.js';
import {
  User,
  Department,
  Classroom,
  Doubt,
  RemedialPlan,
  PeerPod,
  Quiz,
  AssessmentReport,
  ClassroomInsight,
  Announcement,
  StudentMastery,
} from './src/types.js';

// In-Memory Database Store for Mentra
let users: User[] = [...INITIAL_USERS];
let departments: Department[] = [...INITIAL_DEPARTMENTS];
let classrooms: Classroom[] = [...INITIAL_CLASSROOMS];
let doubts: Doubt[] = [...INITIAL_DOUBTS];
let remedialPlans: RemedialPlan[] = [];
let announcements: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
let peerPods: PeerPod[] = [...INITIAL_PEER_PODS];
let quizzes: Quiz[] = [...INITIAL_QUIZZES];
let studentMastery: StudentMastery[] = [...INITIAL_STUDENT_MASTERY];
let classroomInsights: Record<string, ClassroomInsight> = {
  'c-phys-301': INITIAL_INSIGHTS,
};
let assessmentReports: AssessmentReport[] = [];

// Gemini Client Lazy Initializer
let genAIInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (genAIInstance) return genAIInstance;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set.');
    return null;
  }
  genAIInstance = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return genAIInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ===================== REST DATA ENDPOINTS =====================

  // GET State
  app.get('/api/state', (req, res) => {
    res.json({
      users,
      departments,
      classrooms,
      doubts,
      remedialPlans,
      announcements,
      peerPods,
      quizzes,
      studentMastery,
      classroomInsights,
      assessmentReports,
    });
  });

  // POST Reset State
  app.post('/api/state/reset', (req, res) => {
    users = [...INITIAL_USERS];
    departments = [...INITIAL_DEPARTMENTS];
    classrooms = [...INITIAL_CLASSROOMS];
    doubts = [...INITIAL_DOUBTS];
    remedialPlans = [];
    announcements = [...INITIAL_ANNOUNCEMENTS];
    peerPods = [...INITIAL_PEER_PODS];
    quizzes = [...INITIAL_QUIZZES];
    studentMastery = [...INITIAL_STUDENT_MASTERY];
    classroomInsights = { 'c-phys-301': INITIAL_INSIGHTS };
    assessmentReports = [];
    res.json({ success: true, message: 'Platform state reset to default mock data' });
  });

  // Doubts CRUD
  app.get('/api/doubts', (req, res) => {
    const { classroomId } = req.query;
    if (classroomId) {
      res.json(doubts.filter((d) => d.classroomId === classroomId));
    } else {
      res.json(doubts);
    }
  });

  app.put('/api/doubts/:id', (req, res) => {
    const { id } = req.params;
    const { status, severity } = req.body;
    const index = doubts.findIndex((d) => d.id === id);
    if (index !== -1) {
      if (status) doubts[index].status = status;
      if (severity) doubts[index].severity = severity;
      res.json(doubts[index]);
    } else {
      res.status(404).json({ error: 'Doubt not found' });
    }
  });

  // Classrooms CRUD
  app.get('/api/classrooms', (req, res) => {
    res.json(classrooms);
  });

  app.post('/api/classrooms', (req, res) => {
    const newClassroom: Classroom = {
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      syllabus: [],
      studentIds: [],
      ...req.body,
    };
    classrooms.push(newClassroom);
    res.json(newClassroom);
  });

  app.put('/api/classrooms/:id', (req, res) => {
    const { id } = req.params;
    const index = classrooms.findIndex((c) => c.id === id);
    if (index !== -1) {
      classrooms[index] = { ...classrooms[index], ...req.body };
      res.json(classrooms[index]);
    } else {
      res.status(404).json({ error: 'Classroom not found' });
    }
  });

  app.delete('/api/classrooms/:id', (req, res) => {
    const { id } = req.params;
    classrooms = classrooms.filter((c) => c.id !== id);
    res.json({ success: true });
  });

  // Announcements CRUD
  app.post('/api/announcements', (req, res) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pinned: false,
      ...req.body,
    };
    announcements.unshift(newAnn);
    res.json(newAnn);
  });

  // Users & Departments CRUD
  app.post('/api/departments', (req, res) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      ...req.body,
    };
    departments.push(newDept);
    res.json(newDept);
  });

  app.post('/api/users', (req, res) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      ...req.body,
    };
    users.push(newUser);
    res.json(newUser);
  });

  // ===================== GEMINI AI FEATURE ENDPOINTS =====================

  // 1. SOCRATIC AI TUTOR WITH SILENT DOUBT LOGGING
  app.post('/api/gemini/socratic-tutor', async (req, res) => {
    try {
      const { prompt, history = [], topic = 'General Inquiry', studentId, studentName = 'Student', classroomId } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is missing
        const mockReply = `That's a thoughtful question regarding ${topic}! To help you uncover this yourself: What physical principle connects force and the distance from the rotation axis?`;
        res.json({
          replyText: mockReply,
          doubtLogged: false,
          detectedDoubt: null,
        });
        return;
      }

      const systemInstruction = `You are Mentra Socratic AI Tutor, an empathetic, highly effective educational guide for students in high school and college.
Your Core Mission:
1. NEVER give direct answers or write out complete solutions immediately.
2. Ask probing, step-by-step Socratic questions to lead the student to discover concepts on their own.
3. Validate student effort and break complex equations into intuitive physical analogies or logical steps.

CRITICAL FEATURE - SILENT DOUBT DETECTION:
In addition to your Socratic response text, evaluate if the student's prompt reveals a fundamental misunderstanding, confusion, or weakness in a concept (e.g. wrong formulas, misconception about physics/math/CS concepts, expressing helplessness or persistent confusion).

You MUST output your response in valid JSON matching this schema:
{
  "replyText": "Your encouraging Socratic guidance message to the student.",
  "doubtAnalysis": {
    "isDoubtDetected": true/false,
    "conceptTag": "Short 2-4 word concept name (e.g., 'Moment of Inertia vs Mass', 'Cross Product Direction')",
    "severity": "high" | "medium" | "low",
    "doubtSnippet": "A concise 1-2 sentence description of what the student is confused about.",
    "aiReasoning": "Why this represents a key conceptual gap."
  }
}`;

      const formattedHistory = history.map((item: any) => ({
        role: item.role === 'ai' ? 'model' : 'user',
        parts: [{ text: item.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          ...formattedHistory,
          {
            role: 'user',
            parts: [{ text: `[Topic: ${topic}] Student Prompt: ${prompt}` }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: { type: Type.STRING },
              doubtAnalysis: {
                type: Type.OBJECT,
                properties: {
                  isDoubtDetected: { type: Type.BOOLEAN },
                  conceptTag: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  doubtSnippet: { type: Type.STRING },
                  aiReasoning: { type: Type.STRING },
                },
                required: ['isDoubtDetected', 'conceptTag', 'severity', 'doubtSnippet'],
              },
            },
            required: ['replyText', 'doubtAnalysis'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      let loggedDoubt: Doubt | null = null;

      // Silent doubt logging logic
      if (result.doubtAnalysis && result.doubtAnalysis.isDoubtDetected && classroomId) {
        loggedDoubt = {
          id: `d-${Date.now()}`,
          classroomId,
          studentId: studentId || 'u-student-1',
          studentName: studentName || 'Alex Rivera',
          topic,
          conceptTag: result.doubtAnalysis.conceptTag || topic,
          doubtSnippet: result.doubtAnalysis.doubtSnippet || prompt,
          fullConversationSnippet: `Student asked: "${prompt}"`,
          severity: (['high', 'medium', 'low'].includes(result.doubtAnalysis.severity) ? result.doubtAnalysis.severity : 'medium') as any,
          status: 'unresolved',
          createdAt: new Date().toISOString(),
          aiReasoning: result.doubtAnalysis.aiReasoning || 'Identified via Socratic session.',
        };
        doubts.unshift(loggedDoubt);

        // Update student mastery score downwards slightly for this weak concept
        const masteryIndex = studentMastery.findIndex((sm) => sm.studentId === studentId && sm.concept === loggedDoubt!.conceptTag);
        if (masteryIndex !== -1) {
          studentMastery[masteryIndex].masteryLevel = Math.max(20, studentMastery[masteryIndex].masteryLevel - 12);
        } else {
          studentMastery.push({
            studentId: studentId || 'u-student-1',
            concept: result.doubtAnalysis.conceptTag,
            masteryLevel: 45,
            lastAssessed: new Date().toISOString().split('T')[0],
          });
        }
      }

      res.json({
        replyText: result.replyText || "That's an interesting point! What makes you think that?",
        doubtLogged: !!loggedDoubt,
        detectedDoubt: loggedDoubt,
      });
    } catch (err: any) {
      console.error('Error in socratic-tutor:', err);
      res.status(500).json({ error: err.message || 'Failed to generate Socratic response' });
    }
  });

  // 2. MISCONCEPTION REMEDIAL PLAN GENERATOR
  app.post('/api/gemini/remedial-plan', async (req, res) => {
    try {
      const { concept, classroomId, studentName, doubtContext } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Mock fallback
        const mockPlan: RemedialPlan = {
          id: `plan-${Date.now()}`,
          classroomId,
          concept: concept || 'Moment of Inertia vs Mass',
          targetStudentName: studentName,
          coreMisconception: 'Conflating scalar gravitational mass with angular mass distribution around an axis.',
          learningObjectives: [
            'Differentiate scalar inertial mass from radius-squared rotational mass.',
            'Derive torque and rotational kinetic energy for point mass distributions.',
          ],
          stepByStepActionPlan: [
            { step: 1, title: 'Physical Haptic Comparison', description: 'Rotate two batons of equal mass—one with weights near hands, one with weights at ends.' },
            { step: 2, title: 'Mathematical Integration Breakdown', description: 'Analyze $I = \\int r^2 dm$ for thin rod vs solid sphere.' },
            { step: 3, title: 'Peer Pod Diagnostic Practice', description: 'Solve rolling ramp problem with assigned peer pod.' },
          ],
          visualAnalogy: 'Think of spinning on an office chair with arms extended versus arms pulled in close to your chest.',
          diagnosticQuestions: [
            {
              question: 'Why does spinning faster happen when an ice skater pulls in their arms?',
              expectedAnswer: 'Decreasing radius reduces moment of inertia I, causing angular velocity w to increase to conserve angular momentum L = Iw.',
              misconceptionTrigger: 'Believing mass was lost or force was applied externally.',
            },
          ],
          quickClassActivity: '5-minute live poll: Compare acceleration of hollow pipe vs solid wood dowel down an inclined plane.',
          createdAt: new Date().toISOString(),
        };
        remedialPlans.push(mockPlan);
        res.json(mockPlan);
        return;
      }

      const prompt = `Generate a comprehensive, actionable Remedial Plan for a teacher addressing the concept: "${concept}".
Target Student Context: ${studentName ? studentName : 'Classroom-wide'}
Doubt / Misconception details: ${doubtContext || 'Students struggling to grasp core principles.'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite educational instructional designer helping STEM & humanities teachers create targeted remediation strategies.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              coreMisconception: { type: Type.STRING },
              learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
              stepByStepActionPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ['step', 'title', 'description'],
                },
              },
              visualAnalogy: { type: Type.STRING },
              diagnosticQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    expectedAnswer: { type: Type.STRING },
                    misconceptionTrigger: { type: Type.STRING },
                  },
                  required: ['question', 'expectedAnswer', 'misconceptionTrigger'],
                },
              },
              quickClassActivity: { type: Type.STRING },
            },
            required: [
              'coreMisconception',
              'learningObjectives',
              'stepByStepActionPlan',
              'visualAnalogy',
              'diagnosticQuestions',
              'quickClassActivity',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const plan: RemedialPlan = {
        id: `plan-${Date.now()}`,
        classroomId,
        concept,
        targetStudentName: studentName,
        ...parsed,
        createdAt: new Date().toISOString(),
      };

      remedialPlans.unshift(plan);
      res.json(plan);
    } catch (err: any) {
      console.error('Error in remedial-plan:', err);
      res.status(500).json({ error: err.message || 'Failed to generate remedial plan' });
    }
  });

  // 3. CLASSROOM INSIGHTS COMPILER (AUTO-RUNS ON TEACHER DASHBOARD LOAD)
  app.post('/api/gemini/classroom-insights', async (req, res) => {
    try {
      const { classroomId } = req.body;
      const targetClassroom = classrooms.find((c) => c.id === classroomId) || classrooms[0];
      const classDoubts = doubts.filter((d) => d.classroomId === targetClassroom.id);

      const ai = getGenAI();

      if (!ai) {
        const fallbackInsight = INITIAL_INSIGHTS;
        classroomInsights[targetClassroom.id] = fallbackInsight;
        res.json(fallbackInsight);
        return;
      }

      const doubtSummary = classDoubts
        .map((d) => `Student: ${d.studentName} | Topic: ${d.topic} | Concept: ${d.conceptTag} | Doubt: "${d.doubtSnippet}" | Severity: ${d.severity}`)
        .join('\n');

      const prompt = `Analyze the following aggregated student doubt logs and syllabus context for the course "${targetClassroom.name} (${targetClassroom.code})":

Syllabus Topics: ${targetClassroom.syllabus.map((s) => s.title + ': ' + s.keyConcepts.join(', ')).join('; ')}

Logged Student Doubts (${classDoubts.length} items):
${doubtSummary || 'No recent unresolved doubts.'}

Produce a Classroom Insight Report.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an educational data intelligence engine compiler. Analyze student doubts and generate structured actionable classroom insights.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentimentScore: { type: Type.INTEGER, description: 'Class confidence score from 0 (total confusion) to 100 (high mastery)' },
              sentimentLabel: { type: Type.STRING },
              summary: { type: Type.STRING },
              topWeakConcepts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept: { type: Type.STRING },
                    confusionPercentage: { type: Type.INTEGER },
                    keyBarrier: { type: Type.STRING },
                  },
                  required: ['concept', 'confusionPercentage', 'keyBarrier'],
                },
              },
              microRevisions: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextLectureAgenda: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['sentimentScore', 'sentimentLabel', 'summary', 'topWeakConcepts', 'microRevisions', 'nextLectureAgenda'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const newInsight: ClassroomInsight = {
        id: `insight-${Date.now()}`,
        classroomId: targetClassroom.id,
        generatedAt: new Date().toISOString(),
        ...parsed,
      };

      classroomInsights[targetClassroom.id] = newInsight;
      res.json(newInsight);
    } catch (err: any) {
      console.error('Error compiling classroom insights:', err);
      res.status(500).json({ error: err.message || 'Failed to compile classroom insights' });
    }
  });

  // 4. AI PEER POD CLUSTERER
  app.post('/api/gemini/peer-pods', async (req, res) => {
    try {
      const { classroomId } = req.body;
      const targetClassroom = classrooms.find((c) => c.id === classroomId) || classrooms[0];
      const enrolledStudents = users.filter((u) => targetClassroom.studentIds.includes(u.id));

      const ai = getGenAI();

      if (!ai || enrolledStudents.length === 0) {
        res.json(peerPods.filter((p) => p.classroomId === targetClassroom.id));
        return;
      }

      const studentProfiles = enrolledStudents.map((s) => {
        const mastery = studentMastery.filter((sm) => sm.studentId === s.id);
        return `Name: ${s.name} (ID: ${s.id}) | Learning Style: ${s.learningStyle || 'Visual'} | Mastery Scores: ${mastery.map((m) => `${m.concept}: ${m.masteryLevel}%`).join(', ')}`;
      }).join('\n');

      const prompt = `Cluster the following students into optimal 3-4 member peer study pods for "${targetClassroom.name}":

Student Roster & Profiles:
${studentProfiles}

Group students with complementary learning styles and skill levels (e.g., pairing high mastery explainers with students needing support in specific topics).
Assign distinct roles to each member: 'Facilitator', 'Explainer', 'Synthesizer', 'Questioner'.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an educational group dynamics expert specializing in collaborative learning clusters.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                podName: { type: Type.STRING },
                focusConcept: { type: Type.STRING },
                studyPrompt: { type: Type.STRING },
                recommendedActivity: { type: Type.STRING },
                members: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      studentId: { type: Type.STRING },
                      name: { type: Type.STRING },
                      assignedRole: { type: Type.STRING },
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      growthArea: { type: Type.STRING },
                    },
                    required: ['studentId', 'name', 'assignedRole', 'strengths', 'growthArea'],
                  },
                },
              },
              required: ['podName', 'focusConcept', 'studyPrompt', 'recommendedActivity', 'members'],
            },
          },
        },
      });

      const parsedPods = JSON.parse(response.text || '[]');
      const generatedPods: PeerPod[] = parsedPods.map((p: any, idx: number) => ({
        id: `pod-${Date.now()}-${idx}`,
        classroomId: targetClassroom.id,
        podName: p.podName,
        focusConcept: p.focusConcept,
        studyPrompt: p.studyPrompt,
        recommendedActivity: p.recommendedActivity,
        members: p.members.map((m: any) => {
          const matchingStudent = enrolledStudents.find((s) => s.id === m.studentId || s.name === m.name) || enrolledStudents[0];
          return {
            studentId: matchingStudent ? matchingStudent.id : m.studentId,
            name: m.name || matchingStudent?.name || 'Student',
            avatar: matchingStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            assignedRole: m.assignedRole,
            strengths: m.strengths || ['Problem solving'],
            growthArea: m.growthArea || 'Concept mastery',
          };
        }),
      }));

      // Replace existing pods for this classroom
      peerPods = peerPods.filter((p) => p.classroomId !== targetClassroom.id).concat(generatedPods);
      res.json(generatedPods);
    } catch (err: any) {
      console.error('Error generating peer pods:', err);
      res.status(500).json({ error: err.message || 'Failed to generate peer pods' });
    }
  });

  // 5. AI QUIZ BUILDER (TEACHER)
  app.post('/api/gemini/quiz-builder', async (req, res) => {
    try {
      const { classroomId, syllabusText, topicTag, numQuestions = 3 } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback quiz draft
        const fallbackQuiz: Quiz = {
          id: `q-${Date.now()}`,
          classroomId,
          title: `Quiz: ${topicTag || 'Core Concepts'}`,
          description: 'AI Generated assessment draft based on syllabus topic.',
          topicTag: topicTag || 'Mechanics',
          isPublished: false,
          timeLimitMinutes: 15,
          createdAt: new Date().toISOString().split('T')[0],
          questions: [
            {
              id: `q-${Date.now()}-1`,
              questionText: 'What is the physical relationship between Net Torque and Angular Acceleration?',
              options: [
                'Torque equals Moment of Inertia times Angular Acceleration (\\tau = I\\alpha)',
                'Torque equals Force times Angular Velocity',
                'Torque is independent of mass distribution',
                'Torque is inversely proportional to radius',
              ],
              correctOptionIndex: 0,
              explanation: 'Newton\'s Second Law for rotational motion states that \\tau = I\\alpha.',
              conceptTag: topicTag || 'Rotational Dynamics',
              bloomsTaxonomy: 'Understand',
              points: 10,
            },
          ],
        };
        quizzes.unshift(fallbackQuiz);
        res.json(fallbackQuiz);
        return;
      }

      const prompt = `Create a ${numQuestions}-question STEM/Humanities quiz based on the following lecture/syllabus text:

Text: "${syllabusText}"
Topic Tag: "${topicTag}"

Ensure questions span various Bloom's taxonomy levels ('Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate'). Include clear, instructive answer explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert assessment developer generating rigorous educational multiple choice quiz questions.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              timeLimitMinutes: { type: Type.INTEGER },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionText: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctOptionIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    conceptTag: { type: Type.STRING },
                    bloomsTaxonomy: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: [
                    'questionText',
                    'options',
                    'correctOptionIndex',
                    'explanation',
                    'conceptTag',
                    'bloomsTaxonomy',
                    'points',
                  ],
                },
              },
            },
            required: ['title', 'description', 'timeLimitMinutes', 'questions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const newQuiz: Quiz = {
        id: `q-${Date.now()}`,
        classroomId,
        title: parsed.title || `Quiz: ${topicTag}`,
        description: parsed.description || 'AI Generated Assessment',
        topicTag: topicTag || 'Core Topic',
        isPublished: false,
        timeLimitMinutes: parsed.timeLimitMinutes || 15,
        createdAt: new Date().toISOString().split('T')[0],
        questions: (parsed.questions || []).map((q: any, idx: number) => ({
          id: `q-${Date.now()}-${idx}`,
          ...q,
        })),
      };

      quizzes.unshift(newQuiz);
      res.json(newQuiz);
    } catch (err: any) {
      console.error('Error building quiz:', err);
      res.status(500).json({ error: err.message || 'Failed to build quiz' });
    }
  });

  // 6. ADAPTIVE PRACTICE QUIZ GENERATOR (STUDENT)
  app.post('/api/gemini/adaptive-quiz', async (req, res) => {
    try {
      const { studentId, weakConcepts = [] } = req.body;
      const ai = getGenAI();

      const student = users.find((u) => u.id === studentId) || users[3];
      const targetConcepts = weakConcepts.length > 0 ? weakConcepts : ['Moment of Inertia vs Mass', 'Cross Product Direction'];

      if (!ai) {
        const fallbackPracticeQuiz: Quiz = {
          id: `q-practice-${Date.now()}`,
          classroomId: 'c-phys-301',
          title: `Adaptive Practice: ${targetConcepts[0]}`,
          description: `Personalized practice targeting your identified weak concepts: ${targetConcepts.join(', ')}.`,
          topicTag: targetConcepts[0],
          isPublished: true,
          timeLimitMinutes: 10,
          createdAt: new Date().toISOString().split('T')[0],
          questions: [
            {
              id: `q-p1`,
              questionText: 'If two spheres have identical mass M and radius R, but one is hollow and one is solid, which has a higher Moment of Inertia about its center?',
              options: [
                'The hollow sphere, because all mass is distributed at maximum distance R.',
                'The solid sphere, because mass is denser in the middle.',
                'Both have equal moment of inertia.',
                'It depends on the temperature.',
              ],
              correctOptionIndex: 0,
              explanation: 'Moment of inertia $I = \\int r^2 dm$. In a hollow sphere, all mass sits at $r=R$, giving $I = \\frac{2}{3}MR^2$, compared to solid sphere $I = \\frac{2}{5}MR^2$.',
              conceptTag: 'Moment of Inertia vs Mass',
              bloomsTaxonomy: 'Analyze',
              points: 10,
            },
          ],
        };
        res.json(fallbackPracticeQuiz);
        return;
      }

      const prompt = `Generate a personalized 3-question adaptive practice quiz for student "${student.name}".
Weak Concepts to Target: ${targetConcepts.join(', ')}.

Create questions specifically designed to diagnose and correct the student's exact points of confusion on these concepts.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an adaptive educational learning engine creating personalized targeted practice tests.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    questionText: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctOptionIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    conceptTag: { type: Type.STRING },
                    bloomsTaxonomy: { type: Type.STRING },
                    points: { type: Type.INTEGER },
                  },
                  required: [
                    'questionText',
                    'options',
                    'correctOptionIndex',
                    'explanation',
                    'conceptTag',
                    'bloomsTaxonomy',
                    'points',
                  ],
                },
              },
            },
            required: ['title', 'description', 'questions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const practiceQuiz: Quiz = {
        id: `q-practice-${Date.now()}`,
        classroomId: 'c-phys-301',
        title: parsed.title || `Adaptive Practice: ${targetConcepts.join(' & ')}`,
        description: parsed.description || 'Customized adaptive questions targeting your weak concepts.',
        topicTag: targetConcepts[0],
        isPublished: true,
        timeLimitMinutes: 10,
        createdAt: new Date().toISOString().split('T')[0],
        questions: (parsed.questions || []).map((q: any, idx: number) => ({
          id: `qp-${Date.now()}-${idx}`,
          ...q,
        })),
      };

      res.json(practiceQuiz);
    } catch (err: any) {
      console.error('Error generating adaptive quiz:', err);
      res.status(500).json({ error: err.message || 'Failed to generate adaptive practice quiz' });
    }
  });

  // 7. ASSESSMENT DATA ANALYZER
  app.post('/api/gemini/assessment-analyzer', async (req, res) => {
    try {
      const { classroomId, title, rawScoresText } = req.body;
      const ai = getGenAI();

      if (!ai) {
        const mockReport: AssessmentReport = {
          id: `report-${Date.now()}`,
          classroomId,
          title: title || 'Midterm Rotational Mechanics Assessment',
          uploadDate: new Date().toISOString().split('T')[0],
          totalStudents: 28,
          averageScore: 74.5,
          gradeDistribution: [
            { grade: 'A (90-100%)', count: 6 },
            { grade: 'B (80-89%)', count: 10 },
            { grade: 'C (70-79%)', count: 7 },
            { grade: 'D/F (<70%)', count: 5 },
          ],
          conceptBreakdown: [
            { concept: 'Angular Displacement & Kinematics', masteryPercentage: 88, status: 'mastered' },
            { concept: 'Torque & Right Hand Rule', masteryPercentage: 62, status: 'needs_work' },
            { concept: 'Moment of Inertia Mass Distribution', masteryPercentage: 46, status: 'critical' },
          ],
          distractorInsights: [
            '64% of students who missed Q4 selected Choice B (confusing scalar mass for rotational inertia).',
            '35% of students swapped the sign on vector cross product torque calculations.',
          ],
          actionPlan: [
            'Schedule live physical demonstration of inertia batons in Wednesday lab.',
            'Deploy targeted AI Peer Pods focusing on cross-product directional exercises.',
            'Release adaptive practice quiz module on rotational energy conservation.',
          ],
        };
        assessmentReports.unshift(mockReport);
        res.json(mockReport);
        return;
      }

      const prompt = `Analyze the following student assessment score data and item breakdown for "${title}":

Data:
"${rawScoresText}"

Provide a deep pedagogical diagnostic report.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an educational measurement and psychometrics analyst evaluating assessment data.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalStudents: { type: Type.INTEGER },
              averageScore: { type: Type.NUMBER },
              gradeDistribution: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    grade: { type: Type.STRING },
                    count: { type: Type.INTEGER },
                  },
                  required: ['grade', 'count'],
                },
              },
              conceptBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    concept: { type: Type.STRING },
                    masteryPercentage: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                  },
                  required: ['concept', 'masteryPercentage', 'status'],
                },
              },
              distractorInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['totalStudents', 'averageScore', 'gradeDistribution', 'conceptBreakdown', 'distractorInsights', 'actionPlan'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const report: AssessmentReport = {
        id: `report-${Date.now()}`,
        classroomId,
        title: title || 'Assessment Analysis',
        uploadDate: new Date().toISOString().split('T')[0],
        ...parsed,
      };

      assessmentReports.unshift(report);
      res.json(report);
    } catch (err: any) {
      console.error('Error analyzing assessment:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze assessment data' });
    }
  });

  // ===================== VITE MIDDLEWARE / STATIC SERVING =====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mentra Platform Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
