'use client';

import React from 'react';
import { Student } from '../types/student.types';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import {
    Eye,
    Trash2,
    Mail,
    Phone
} from 'lucide-react';

interface StudentsTableProps {
    students: Student[];
    total: number;
    loading: boolean;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onViewProfile: (student: Student) => void;
    onDelete: (studentId: string) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
    students,
    total,
    loading,
    page,
    pageSize,
    onPageChange,
    onViewProfile,
    onDelete,
}) => {
    const columns = [
        {
            header: 'Student',
            Cell: ({ row }: { row: Student }) => (
                <div className="flex items-center gap-2">
                    <div className="min-w-0">
                        <div className="font-bold text-gray-900 text-sm md:text-base truncate">{row.firstName} {row.lastName}</div>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            Joined {new Date(row.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Info',
            Cell: ({ row }: { row: Student }) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{row.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{row.phone || 'N/A'}</span>
                    </div>
                </div>
            )
        },


        {
            header: 'Actions',
            Cell: ({ row }: { row: Student }) => (
                <div className="flex items-center justify-end gap-1 md:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewProfile(row)}
                        className="h-8 w-8 md:h-10 md:w-10 text-gray-400 hover:bg-edvios-green/10 hover:text-edvios-green transition-colors rounded-md"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
                                onDelete(row.id);
                            }
                        }}
                        className="h-8 w-8 md:h-10 md:w-10 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors rounded-md"
                        title="Delete Student"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }

    ];

    return (
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <Table
                data={students}
                columns={columns}
                loading={loading}
                pagination={{
                    currentPage: page,
                    totalItems: total,
                    pageSize: pageSize,
                    onPageChange: onPageChange,
                }}
            />
        </div>
    );
};
