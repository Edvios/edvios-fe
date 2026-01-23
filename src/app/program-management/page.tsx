// app/programs/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, X, Globe, Calendar, PoundSterling, 
  Star, Building, MapPin, BookOpen, Clock, CheckCircle 
} from 'lucide-react';

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface Program {
  id: string;
  title: string;                    // e.g. "Bachelor of Arts in Philosophy, Politics and Economics (PPE)"
  university: string;
  location: string;                 // e.g. "Oxford, UK"
  countryCode: string;              // e.g. "UK"
  ranking: string;                  // e.g. "UK #1", "Popular #1"
  rating: number;                   // 1–5
  badges: string[];                 // e.g. ["Instant Submission", "Scholarships Available", "Prime", "Popular"]
  tags: string[];                   // e.g. ["Fast Acceptance", "L0V0"]
  intake: string;                   // e.g. "October 2025 intake"
  availability: 'Available' | 'Closed' | 'Waitlist';
  tuition: string;                  // e.g. "£10,015 GBP" or "£37,380–£62,820"
  applicationFee: string;           // e.g. "Free" or "£75"
  duration: string;                 // e.g. "36 months"
  category: string;                 // e.g. "Social Sciences"
  degree: string;                   // e.g. "Bachelor's Degree"
  updated: string;                  // e.g. "Updated 1/23/2026"
}

// ────────────────────────────────────────────────
// Sample Data (you can replace with real fetch later)
// ────────────────────────────────────────────────
const initialPrograms: Program[] = [
  {
    id: 'p1',
    title: 'Bachelor of Arts in Philosophy, Politics and Economics (PPE)',
    university: 'University of Oxford',
    location: 'Oxford, UK',
    countryCode: 'UK',
    ranking: 'UK #1',
    rating: 5,
    badges: ['Instant Submission', 'Scholarships Available', 'Prime', 'Popular'],
    tags: ['Fast Acceptance', 'L0V0'],
    intake: 'October 2025 intake',
    availability: 'Available',
    tuition: '£37,380 – £62,820',  // more realistic overseas fee range
    applicationFee: 'Free',
    duration: '36 months',
    category: 'Social Sciences',
    degree: "Bachelor's Degree",
    updated: 'Updated 1/23/2026'
  },
  {
    id: 'p2',
    title: 'BSc Economics',
    university: 'London School of Economics (LSE)',
    location: 'London, UK',
    countryCode: 'UK',
    ranking: 'UK #2',
    rating: 4.8,
    badges: ['Popular', 'Scholarships Available'],
    tags: ['Quantitative Focus'],
    intake: 'September 2026 intake',
    availability: 'Available',
    tuition: '£26,592 – £32,000',
    applicationFee: '£80',
    duration: '36 months',
    category: 'Economics',
    degree: "Bachelor's Degree",
    updated: 'Updated 1/20/2026'
  },
  {
    id: 'p3',
    title: 'BA Philosophy, Politics and Economics',
    university: 'University of Warwick',
    location: 'Coventry, UK',
    countryCode: 'UK',
    ranking: 'Top 5',
    rating: 4.6,
    badges: ['Flexible Pathways'],
    tags: ['BA or BSc option'],
    intake: 'September 2026 intake',
    availability: 'Available',
    tuition: '£24,800 – £31,620',
    applicationFee: 'Free',
    duration: '36 months',
    category: 'Social Sciences',
    degree: "Bachelor's Degree",
    updated: 'Updated 1/15/2026'
  },
];

// ────────────────────────────────────────────────
// Modal Form
// ────────────────────────────────────────────────
interface ProgramFormProps {
  program?: Program;
  onSave: (data: Omit<Program, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

function ProgramFormModal({ program, onSave, onClose }: ProgramFormProps) {
  const isEdit = !!program;

  const [form, setForm] = useState<Omit<Program, 'id'>>({
    title: program?.title || '',
    university: program?.university || '',
    location: program?.location || '',
    countryCode: program?.countryCode || 'UK',
    ranking: program?.ranking || '',
    rating: program?.rating || 5,
    badges: program?.badges || [],
    tags: program?.tags || [],
    intake: program?.intake || '',
    availability: program?.availability || 'Available',
    tuition: program?.tuition || '',
    applicationFee: program?.applicationFee || 'Free',
    duration: program?.duration || '',
    category: program?.category || '',
    degree: program?.degree || "Bachelor's Degree",
    updated: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: program?.id });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{isEdit ? 'Edit Program' : 'Add New Program'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Program Title *</label>
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">University *</label>
              <input
                required
                value={form.university}
                onChange={e => setForm({ ...form, university: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country Code</label>
              <input value={form.countryCode} onChange={e => setForm({ ...form, countryCode: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ranking Label</label>
              <input value={form.ranking} onChange={e => setForm({ ...form, ranking: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tuition (1st year)</label>
              <input value={form.tuition} onChange={e => setForm({ ...form, tuition: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" placeholder="£37,380 – £62,820" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Application Fee</label>
              <input value={form.applicationFee} onChange={e => setForm({ ...form, applicationFee: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" placeholder="36 months" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Intake</label>
              <input value={form.intake} onChange={e => setForm({ ...form, intake: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Availability</label>
              <select
                value={form.availability}
                onChange={e => setForm({ ...form, availability: e.target.value as any })}
                className="w-full px-4 py-2.5 border rounded-lg"
              >
                <option value="Available">Available</option>
                <option value="Closed">Closed</option>
                <option value="Waitlist">Waitlist</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category & Degree</label>
            <div className="flex gap-4">
              <input
                placeholder="Category (e.g. Social Sciences)"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="flex-1 px-4 py-2.5 border rounded-lg"
              />
              <input
                placeholder="Degree"
                value={form.degree}
                onChange={e => setForm({ ...form, degree: e.target.value })}
                className="flex-1 px-4 py-2.5 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button type="button" onClick={onClose} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {isEdit ? 'Update Program' : 'Add Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────
export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  const filtered = programs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.university.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Program, 'id'> & { id?: string }) => {
    if (data.id) {
      setPrograms(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else {
      const newId = `p${programs.length + 1}`;
      setPrograms(prev => [...prev, { ...data, id: newId } as Program]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this program?')) return;
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
            <p className="text-gray-600 mt-1">Manage university degree programs and offerings</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            <Plus size={20} />
            Add New Program
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search programs, universities or locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No programs found. Try adjusting your search or add a new one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(program => (
              <div
                key={program.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header strip */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {program.countryCode}
                      </div>
                      <div className="text-lg font-bold">{program.ranking}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.floor(program.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {program.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-700 mb-4">
                    <Building size={18} className="text-gray-500" />
                    <span className="font-medium">{program.university}</span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-5">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {program.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {program.intake}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {program.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                      >
                        {badge}
                      </span>
                    ))}
                    {program.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Key info grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-t border-gray-100 pt-5">
                    <div>
                      <div className="text-gray-500">Tuition (1st year)</div>
                      <div className="font-medium">{program.tuition}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Application Fee</div>
                      <div className="font-medium">{program.applicationFee}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Duration</div>
                      <div className="font-medium">{program.duration}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Availability</div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle size={16} className="text-green-600" />
                        {program.availability}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <BookOpen size={16} />
                        {program.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {program.updated}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(program);
                          setModalOpen(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(program.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProgramFormModal
          program={editing ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}