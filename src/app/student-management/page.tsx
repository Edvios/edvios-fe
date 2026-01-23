// app/students/page.tsx  (or wherever you want to place it)
'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, MoreVertical, Mail, Phone, CheckCircle, XCircle, Clock, 
  Edit, Trash2, Eye, GraduationCap, Building, Calendar 
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'prospective' | 'graduated';
  institution: string;
  program: string;
  agentName?: string;       // optional - who recruited/manages
  startDate: string;        // ISO date string
  avatar?: string;
}

// ────────────────────────────────────────────────
// Sample Data (replace with API / database later)
// ────────────────────────────────────────────────
const sampleStudents: Student[] = [
  {
    id: 'S001',
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    phone: '+44 7700 900123',
    status: 'active',
    institution: 'University of Manchester',
    program: 'Computer Science BSc',
    agentName: 'Sarah Johnson',
    startDate: '2025-09-01'
  },
  {
    id: 'S002',
    name: 'Mateo Rivera',
    email: 'mateo.rivera@uni.com',
    phone: '+34 612 345 678',
    status: 'prospective',
    institution: 'Universidad Complutense de Madrid',
    program: 'Business Administration',
    agentName: 'Michael Chen',
    startDate: '2026-02-01'
  },
  {
    id: 'S003',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    status: 'active',
    institution: 'University of Melbourne',
    program: 'Data Science MSc',
    agentName: 'Lisa Patel',
    startDate: '2025-07-15'
  },
  {
    id: 'S004',
    name: 'Liam Nguyen',
    email: 'liam.nguyen@edu.vn',
    phone: '+84 91 234 5678',
    status: 'suspended',
    institution: 'RMIT University Vietnam',
    program: 'Software Engineering',
    startDate: '2024-11-10'
  },
  {
    id: 'S005',
    name: 'Fatima Al-Mansoori',
    email: 'fatima.almansoori@uaeu.ac.ae',
    phone: '+971 50 123 4567',
    status: 'graduated',
    institution: 'United Arab Emirates University',
    program: 'Civil Engineering BEng',
    agentName: 'Emily Rodriguez',
    startDate: '2022-09-01'
  },
];

// ────────────────────────────────────────────────
// Modal Form Component
// ────────────────────────────────────────────────
interface StudentFormProps {
  student?: Student;
  onSave: (data: Omit<Student, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

function StudentFormModal({ student, onSave, onClose }: StudentFormProps) {
  const isEdit = !!student;
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    status: student?.status || 'prospective',
    institution: student?.institution || '',
    program: student?.program || '',
    agentName: student?.agentName || '',
    startDate: student?.startDate 
      ? new Date(student.startDate).toISOString().split('T')[0] 
      : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: student?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
              <input
                required
                value={form.institution}
                onChange={e => setForm({ ...form, institution: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
              <input
                value={form.program}
                onChange={e => setForm({ ...form, program: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="prospective">Prospective</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="graduated">Graduated</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent / Recruiter (optional)</label>
            <input
              value={form.agentName}
              onChange={e => setForm({ ...form, agentName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Page Component
// ────────────────────────────────────────────────
export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Student['status']>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.institution.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Student['status']) => {
    const styles = {
      active:      { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      inactive:    { bg: 'bg-gray-100',   text: 'text-gray-700', icon: XCircle },
      suspended:   { bg: 'bg-red-100',    text: 'text-red-800',  icon: XCircle },
      prospective: { bg: 'bg-blue-100',   text: 'text-blue-800', icon: Clock },
      graduated:   { bg: 'bg-purple-100', text: 'text-purple-800', icon: GraduationCap },
    };

    const { bg, text, icon: Icon } = styles[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // CRUD handlers (client-side for now)
  const handleSave = (data: Omit<Student, 'id'> & { id?: string }) => {
    if (data.id) {
      // Update
      setStudents(prev =>
        prev.map(s => s.id === data.id ? { ...s, ...data } : s)
      );
    } else {
      // Create
      const newId = `S${String(students.length + 1001).slice(-3)}`;
      setStudents(prev => [...prev, { ...data, id: newId } as Student]);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const stats = [
    { label: 'Total Students', value: students.length, color: 'bg-blue-500' },
    { label: 'Active', value: students.filter(s => s.status === 'active').length, color: 'bg-green-500' },
    { label: 'Prospective', value: students.filter(s => s.status === 'prospective').length, color: 'bg-blue-500' },
    { label: 'Graduated', value: students.filter(s => s.status === 'graduated').length, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-2 text-gray-600">Track and manage international students</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, institution..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[160px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="prospective">Prospective</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                  <option value="inactive">Inactive</option>
                </select>

                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institution / Program</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {student.email}
                        </div>
                        {student.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {student.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{student.institution}</div>
                        <div className="text-gray-600">{student.program}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.agentName || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.startDate
                        ? new Date(student.startDate).toLocaleDateString('en-GB', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingStudent(student);
                            setModalOpen(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              No students found matching your criteria.
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing <span className="font-medium">{filteredStudents.length}</span> of{' '}
                <span className="font-medium">{students.length}</span> students
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <StudentFormModal
          student={editingStudent ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}