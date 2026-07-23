import React, { useState } from 'react';
import { User, Department, Classroom, Doubt } from '../../types';
import {
  Building2,
  UserCog,
  Shield,
  Activity,
  Plus,
  BarChart3,
  Sparkles,
  Users,
  BookOpen,
  Server,
  Trash2,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  departments: Department[];
  classrooms: Classroom[];
  doubts: Doubt[];
  onAddDepartment: (dept: Partial<Department>) => void;
  onAddUser: (user: Partial<User>) => void;
  onAddClassroom: (classroom: Partial<Classroom>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  users,
  departments,
  classrooms,
  doubts,
  onAddDepartment,
  onAddUser,
  onAddClassroom,
}) => {
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassTeacher, setNewClassTeacher] = useState('Dr. Sarah Vance');

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode) return;
    onAddDepartment({
      name: newDeptName,
      code: newDeptCode,
      headTeacherId: 'u-teacher-1',
      description: newDeptDesc || 'Academic Department',
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptDesc('');
    setDeptModalOpen(false);
  };

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName || !newClassCode) return;
    onAddClassroom({
      name: newClassName,
      code: newClassCode,
      teacherName: newClassTeacher,
      departmentId: departments[0]?.id || 'dept-sci',
      teacherId: 'u-teacher-1',
      schedule: 'Mon / Wed • 1:00 PM - 2:30 PM',
      description: 'Newly provisioned academic classroom.',
      syllabus: [
        {
          id: `s-${Date.now()}`,
          title: 'Foundational Principles',
          description: 'Introduction to course topics.',
          weekNumber: 1,
          keyConcepts: ['Foundations', 'Core Principles'],
          status: 'in_progress',
        },
      ],
    });
    setNewClassName('');
    setNewClassCode('');
    setClassModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Shield className="w-3.5 h-3.5 text-[#8E75FF]" />
            School Admin Control
          </div>
          <h1 className="text-2xl font-serif italic text-white">School Management & Overview</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Manage departments, active classes, and users across Mentra Learning Platform
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDeptModalOpen(true)}
            className="px-4 py-2 bg-[#1C1C1E] hover:bg-[#27272A] border border-[#27272A] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#8E75FF]" />
            Add Department
          </button>
          <button
            onClick={() => setClassModalOpen(true)}
            className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Classroom
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">School Departments</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-[#8E75FF]">{departments.length}</span>
            <Building2 className="w-5 h-5 text-[#8E75FF]" />
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">Active Classes</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-white">{classrooms.length}</span>
            <BookOpen className="w-5 h-5 text-[#8E75FF]" />
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">Total Users</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-white">{users.length}</span>
            <Users className="w-5 h-5 text-[#A1A1AA]" />
          </div>
        </div>

        <div className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-2">
          <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">AI System Health</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-light text-emerald-400">99.8%</span>
            <Server className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments List */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#8E75FF]" />
              Academic Departments
            </h2>
            <button onClick={() => setDeptModalOpen(true)} className="text-xs text-[#8E75FF] font-bold hover:underline cursor-pointer">
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {departments.map((d) => (
              <div key={d.id} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{d.name}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#161618] text-[#8E75FF] border border-[#27272A]">
                    {d.code}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">{d.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Classrooms Grid */}
        <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8E75FF]" />
              Provisioned Classrooms
            </h2>
            <button onClick={() => setClassModalOpen(true)} className="text-xs text-[#8E75FF] font-bold hover:underline cursor-pointer">
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {classrooms.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#161618] text-[#8E75FF] border border-[#27272A]">
                    {c.code}
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA]">Instructor: {c.teacherName} • {c.studentIds.length} Students</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Roster */}
      <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCog className="w-4 h-4 text-[#8E75FF]" />
          Platform User Roster & Role Matrix
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex items-center gap-3">
              <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[#8E75FF]/30" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{u.name}</p>
                <p className="text-[10px] text-[#A1A1AA] truncate">{u.email}</p>
                <span className="inline-block text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-[#161618] text-[#8E75FF] border border-[#27272A] mt-1">
                  Role: {u.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: New Department */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] max-w-md w-full space-y-4">
            <h3 className="text-base font-serif italic text-white">Add Academic Department</h3>
            <form onSubmit={handleCreateDepartment} className="space-y-3">
              <input
                type="text"
                placeholder="Department Name (e.g. School of Physics)"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <input
                type="text"
                placeholder="Department Code (e.g. PHY)"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <textarea
                placeholder="Description..."
                value={newDeptDesc}
                onChange={(e) => setNewDeptDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              ></textarea>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDeptModalOpen(false)} className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Classroom */}
      {classModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] max-w-md w-full space-y-4">
            <h3 className="text-base font-serif italic text-white">Provision New Classroom</h3>
            <form onSubmit={handleCreateClassroom} className="space-y-3">
              <input
                type="text"
                placeholder="Classroom Name (e.g. Organic Chemistry)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <input
                type="text"
                placeholder="Course Code (e.g. CHEM-201)"
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <input
                type="text"
                placeholder="Teacher Name"
                value={newClassTeacher}
                onChange={(e) => setNewClassTeacher(e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#27272A] text-white placeholder-[#A1A1AA] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setClassModalOpen(false)} className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Provision Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
