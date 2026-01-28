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
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {(row.firstName?.[0] || '') + (row.lastName?.[0] || '')}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-base">{row.firstName} {row.lastName}</div>
                        <div className="flex items-center gap-2 text-xs text-gradient font-mono">
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gradient" />
                        {row.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gradient" />
                        {row.phone || 'N/A'}
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            Cell: ({ row }: { row: Student }) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gradient" />
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
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
