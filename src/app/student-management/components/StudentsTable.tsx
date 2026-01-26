'use client';

import React from 'react';
import { Student } from '../types/student.types';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import {
    Eye,
    Trash2,
    MapPin,
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold border border-green-200 shadow-sm">
                        {(row.firstName?.[0] || '') + (row.lastName?.[0] || '')}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">{row.firstName} {row.lastName}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Info',
            Cell: ({ row }: { row: Student }) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {row.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {row.phone || 'N/A'}
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            Cell: ({ row }: { row: Student }) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-green-400" />
                    {row.currentCountry || 'N/A'}
                </div>
            )
        },
        {
            header: 'Registered',
            Cell: ({ row }: { row: Student }) => (
                <div className="text-sm text-gray-500">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'N/A'}
                </div>
            )
        },
        {
            header: 'Actions',
            Cell: ({ row }: { row: Student }) => (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProfile(row)}
                        className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
                                onDelete(row.id);
                            }
                        }}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Student"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
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
