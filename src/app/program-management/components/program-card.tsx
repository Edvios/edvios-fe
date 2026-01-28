"use client";

import React, { useState, useEffect } from 'react';
import {
  Star,
  Building,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

import type { Program } from '../types';
import { fetchProgramById } from '../api/program.api.client';
import {
  Card,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

type Props = {
  program: Program;
  onEdit?: (p: Program) => void;
  onDelete?: (id: string) => void;
};

export default function ProgramCard({ program, onEdit, onDelete }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<Program | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const p = details ?? program;

  const sourceRaw = p.raw ?? {};
  const extraEntries = Object.entries(sourceRaw).filter(([k]) => {
    // exclude keys already rendered
    return ![
      'id','title','university','location','country_code','countryCode','ranking','rating',
      'badges','tags','intake','availability','tuition','application_fee','applicationFee',
      'duration','category','degree','updated','updated_at'
    ].includes(k);
  });

  useEffect(() => {
    let mounted = true;
    if (showDetails && !details) {
      setLoadingDetails(true);
      (async () => {
        try {
          const d = await fetchProgramById(program.id);
          if (!mounted) return;
          if (d) setDetails(d);
        } catch (e) {
           
          console.error('[program.card] fetchProgramById failed', e);
        } finally {
          if (mounted) setLoadingDetails(false);
        }
      })();
    }
    return () => { mounted = false; };
  }, [showDetails, details, program.id]);

  // Keep locally-fetched `details` in sync with any updates to the parent `program` prop.
  // When the parent updates (e.g. after an edit), merge the new fields into `details`
  // so the card reflects changes without requiring a full page reload.
  useEffect(() => {
    setDetails(prev => (prev ? { ...prev, ...program } : prev));
  }, [program]);

  return (
    <Card className="p-0 overflow-hidden hover:shadow-md transition-shadow">
      <div className="rounded-t-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {p.countryCode}
            </div>
            <div className="text-lg font-bold">{p.ranking}</div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(p.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/40'
                }
              />
            ))}
          </div>
        </div>
      </div>

      <CardContent className="py-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{p.title}</h3>

        <div className="flex items-center gap-2 text-gray-700 mb-4">
          <Building size={18} className="text-gray-500" />
          <div>
            <div className="font-medium">{p.university}</div>
            {(p.institutionType || p.institutionName) && (
              <div className="text-xs text-gray-500">
                {p.institutionType ? `${p.institutionType} · ` : ''}{p.institutionName ?? ''}
                {p.institutionCity ? ` · ${p.institutionCity}` : ''}{p.institutionCountry ? `, ${p.institutionCountry}` : ''}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-5">
          <div className="flex items-center gap-1.5">
              <div className="text-sm text-gray-700">
              {p.institutionLabel ?? p.institutionName ?? p.university}
            </div>
            <MapPin size={16} />
            <div>{p.institutionLocation ?? p.location}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            {p.intakeName ?? p.intake}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {p.badges.map((badge, idx) => (
            <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {badge}
            </span>
          ))}
          {p.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-t border-gray-100 pt-5">
          <div>
            <div className="text-gray-500">Tuition (1st year)</div>
            <div className="font-medium">{p.tuition}</div>
          </div>
          <div>
            <div className="text-gray-500">Application Fee</div>
            <div className="font-medium">{p.applicationFee}</div>
          </div>
          <div>
            <div className="text-gray-500">Duration</div>
            <div className="font-medium">{p.duration}</div>
          </div>
          <div>
            <div className="text-gray-500">Status</div>
            <div className="flex items-center gap-2">
              {(() => {
                const raw = (p.status ?? p.availability ?? '') as string | undefined;
                const s = String(raw ?? '').toLowerCase();
                let label = raw ?? '—';
                let cls = 'bg-gray-100 text-gray-700 border-gray-200';
                if (s.includes('available')) {
                  label = 'Available';
                  cls = 'bg-green-100 text-green-800 border-green-200';
                } else if (s.includes('deadline') || s.includes('passed')) {
                  label = 'Deadline passed';
                  cls = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                } else if (s.includes('full')) {
                  label = 'Full';
                  cls = 'bg-red-100 text-red-800 border-red-200';
                } else if (s.includes('wait')) {
                  label = 'Waitlist';
                  cls = 'bg-orange-100 text-orange-800 border-orange-200';
                }

                return (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${cls}`}>
                    {label}
                  </span>
                );
              })()}
            </div>
          </div>

          {p.tuitionFee && p.tuitionFee !== p.tuition ? (
            <div>
              <div className="text-gray-500">Tuition Fee</div>
              <div className="font-medium">{p.tuitionFee}</div>
            </div>
          ) : null}
          <div>
            <div className="text-gray-500">English Test</div>
            <div className="font-medium">{p.englishTestScore ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500">Level</div>
            <div className="font-medium">{p.level ?? '—'}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            {p.category}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            {p.updated}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(s => !s)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Toggle details"
          >
            Details
          </button>
          <button
            onClick={async () => {
              try {
                if (details) {
                  onEdit?.(details);
                  return;
                }
                setLoadingDetails(true);
                const d = await fetchProgramById(program.id);
                if (d) {
                  setDetails(d);
                  onEdit?.(d);
                } else {
                  onEdit?.(program);
                }
              } catch (e) {
                console.error('Edit fetchProgramById failed', e);
                onEdit?.(program);
              } finally {
                setLoadingDetails(false);
              }
            }}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete program</AlertDialogTitle>
                <AlertDialogDescription>Are you want to delete this program? This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                  onClick={async () => {
                    setDeleting(true);
                    try {
                        const maybe = onDelete?.(program.id);
                        if (maybe && typeof (maybe as Promise<unknown>)?.then === 'function') {
                          await (maybe as Promise<unknown>);
                        }
                    } catch (e) {
                      console.error('Delete failed', e);
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                >
                  <div className="flex items-center gap-2">
                    {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                    {deleting ? 'Deleting...' : 'Delete'}
                  </div>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>

      {showDetails && (
        <div className="px-6 pb-6 pt-2 text-sm text-gray-700 border-t">
          <div className="font-medium mb-2">Additional fields</div>
          {loadingDetails ? (
            <div className="text-gray-500">Loading…</div>
          ) : extraEntries.length === 0 ? (
            <div className="text-gray-500">No additional fields</div>
          ) : (
            <div className="grid gap-2">
              {extraEntries.map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <div className="text-gray-500 w-40">{k}</div>
                  <div className="break-words">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
