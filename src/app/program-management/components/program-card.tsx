"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import {
  Building,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

import type { Program } from '../types';
import { fetchProgramById } from '../api/program.api.client';
import {
  Card,
  CardContent,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
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
  const pAny = p as unknown as Record<string, unknown>;
  const desc = (pAny.description ?? pAny.summary ?? p.category) as string | undefined;
  const badges = Array.isArray(pAny.badges) ? (pAny.badges as unknown[]) : [];
  const tags = Array.isArray(pAny.tags) ? (pAny.tags as unknown[]) : [];

  const rankingVal = (() => {
    if (p.ranking && String(p.ranking).trim() !== '') return p.ranking;
    const v = pAny.popularityRank ?? pAny.popularity_rank ?? pAny.popularity;
    if (v != null && String(v).trim() !== '') return v;
    const raw = (pAny.raw ?? {}) as Record<string, unknown>;
    return raw.ranking ?? raw.rank ?? raw.world_ranking ?? raw.ranking_text ?? raw.institution_rank ?? raw.rank_text ?? undefined;
  })();

  const englishTestVal = (pAny.englishTestScore ?? pAny.englishTest ?? pAny.english_test ?? pAny.english) as string | undefined;

  const applicationDeadlineVal = (pAny.applicationDeadline ?? pAny.application_deadline ?? pAny.application_deadline_text ?? pAny.deadline ?? pAny.closing_date ?? pAny.application_deadline_at ?? pAny.applicationDeadlineDate) as unknown;

  const formatDate = (val: unknown) => {
    if (val == null || val === '') return '—';
    try {
      const d = new Date(String(val));
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    } catch {
      // fallthrough
    }
    return String(val);
  };

  const renderRanking = (r: unknown) => {
    if (r == null || (typeof r === 'string' && r.trim() === '')) return '—';
    if (typeof r === 'object' && r !== null) {
      const ro = r as Record<string, unknown>;
      const candidate = ro.rank ?? ro.ranking ?? ro.ranking_text ?? ro.world_ranking ?? ro.institution_rank ?? ro.rank_text ?? ro.value ?? undefined;
      const source = ro.source ?? ro.provider ?? ro.source_name ?? ro.site ?? undefined;
      if (candidate != null && String(candidate).trim() !== '') {
        return source ? `${candidate} (${source})` : String(candidate);
      }
      for (const key of ['ranking_text','rank','value','position','place']) {
        const v = ro[key];
        if (v != null && String(v).trim() !== '') {
          return source ? `${String(v)} (${source})` : String(v);
        }
      }
      try {
        const s = JSON.stringify(ro);
        return s.length > 60 ? s.slice(0,57) + '...' : s;
      } catch { return '—'; }
    }
    return String(r);
  };

  const sourceRaw = (pAny.raw ?? {}) as Record<string, unknown>;
  const extraEntries = Object.entries(sourceRaw).filter(([k]) => ![
    'id','title','university','location','country_code','countryCode','ranking','rating',
    'badges','tags','intake','availability','tuition','application_fee','applicationFee',
    'duration','category','degree','updated','updated_at'
  ].includes(k));

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
  useEffect(() => {
    setDetails(prev => (prev ? { ...prev, ...program } : prev));
  }, [program]);

  return (
    <Card
      className={cn(
        // base program card sizing
        'relative w-full md:max-w-[900px] transition-shadow overflow-hidden border-gray-200 min-w-0',
        // default is a bit shorter; institution style wants full height and stronger shadow
        showDetails ? 'hover:shadow-lg h-full flex flex-col' : 'hover:shadow-md h-auto flex flex-col'
      )}
    >
      {/* full-height left color stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient rounded-l-md" />

      <div className="flex flex-row min-w-0">
        <CardContent
          className={cn(
            // default compact padding for program list
            'flex-1 min-w-0 overflow-visible',
            showDetails ? 'p-4 md:p-5 lg:p-6 flex flex-col flex-1' : 'p-2 pl-6 md:pl-8'
          )}
        >
          <div className="flex flex-col">
            <h3 onClick={() => setShowDetails(s => !s)} className="cursor-pointer font-bold text-lg md:text-xl text-gray-900 mb-1 line-clamp-2">{p.title}</h3>
            {desc && (
              <p className="text-sm text-gray-500 mb-1">{desc}</p>
            )}

            {/* University & location under title */}
            <div className="mt-1">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Building size={16} className="text-gray-500" />
                <div className="font-medium truncate max-w-full text-sm">{p.university}</div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <div className="text-sm break-words">{p.institutionLocation ?? p.location}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <div className="text-sm break-words">{p.intakeName ?? p.intake}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3 max-w-full">
                {badges.slice(0,4).map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="border-0 bg-green-100 text-green-700 text-[9px] px-2 py-0.5">{String(badge)}</Badge>
                ))}
                {tags.slice(0,4).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="border-0 bg-orange-100 text-orange-800 text-[9px] px-2 py-0.5">{String(tag)}</Badge>
                ))}
              </div>

              <div className="border-t border-gray-200 my-3" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Ranking</div>
                  <div className="font-semibold text-sm text-gray-900">{renderRanking(rankingVal)}</div>
                </div>

                <div>
                  <div className="text-gray-500">Tuition (1st year)</div>
                  <div className="font-medium text-sm break-words">{p.tuition ?? '—'}</div>
                </div>

                <div>
                  <div className="text-gray-500">Application Deadline</div>
                  <div className="font-medium text-sm break-words">{formatDate(applicationDeadlineVal)}</div>
                </div>

                <div>
                  <div className="text-gray-500">Application Fee</div>
                  <div className="font-medium text-sm break-words">{(p.applicationFee ?? (pAny.application_fee ?? pAny.application_fee_text)) ?? '—'}</div>
                </div>

                <div>
                  <div className="text-gray-500">Duration</div>
                  <div className="font-medium text-sm break-words">{p.duration ?? '—'}</div>
                </div>

                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="mt-1">
                    <Badge variant="secondary" className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border-0 text-[11px]">
                      {String(p.status ?? pAny.availability ?? pAny.status ?? '—')}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">English Test</div>
                  <div className="font-medium text-sm break-words">{(englishTestVal ?? '—')}</div>
                </div>

                <div>
                  <div className="text-gray-500">Level</div>
                  <div className="font-medium text-sm break-words">{p.level ?? p.degree ?? p.category ?? '—'}</div>
                </div>

                <div>
                  <div className="text-gray-500">UCAS Code</div>
                  <div className="font-medium text-sm break-words">{(pAny.ucas_code ?? pAny.ucas ?? pAny.ucasCode) ? String(pAny.ucas_code ?? pAny.ucas ?? pAny.ucasCode) : '—'}</div>
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-2 md:pt-3 px-3 md:px-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="bg-gradient hover:opacity-90 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
              onClick={() => onEdit?.(details ?? program)}
            >
              <div className="flex items-center gap-2">
                <Edit size={14} />
                <span>Edit</span>
              </div>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-7 md:h-8 px-2 md:px-3 flex items-center gap-2">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete program</AlertDialogTitle>
                  <AlertDialogDescription>Are you want to delete this program? This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-gradient text-white"
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
        </div>
      </div>

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
