import React from 'react';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';
import { FileText, Clock, CheckCircle, XCircle, Ban } from 'lucide-react';

interface ApplicationStatsProps {
  applications: Application[];
}

export const ApplicationStats: React.FC<ApplicationStatsProps> = ({ applications }) => {
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === ApplicationStatus.SUBMITTED).length,
    accepted: applications.filter((a) => a.status === ApplicationStatus.ACCEPTED).length,
    rejected: applications.filter((a) => a.status === ApplicationStatus.REJECTED).length,
    withdrawn: applications.filter((a) => a.status === ApplicationStatus.WITHDRAWN).length,
  };

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      title: 'Accepted',
      value: stats.accepted,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Withdrawn',
      value: stats.withdrawn,
      icon: Ban,
      gradient: 'from-slate-500 to-slate-700',
      bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-950/60',
      borderColor: 'border-slate-200 dark:border-slate-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title} 
            className={`bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardDescription className="text-sm font-medium">
                  {stat.title}
                </CardDescription>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};