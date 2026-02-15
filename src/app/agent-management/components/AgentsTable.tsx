'use client';

import React, { useState } from 'react';
import { Agent } from '../types/agent.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { ConfirmDialog } from './ConfirmDialog';
import {
    Eye,
    Trash2,
    CheckCircle,
    Mail,
    Phone
} from 'lucide-react';

interface AgentsTableProps {
    agents: Agent[];
    total: number;
    loading: boolean;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onViewProfile: (agent: Agent) => void;
    onApprove: (agentId: string) => void;
    onDelete: (agentId: string) => void;
}

export const AgentsTable: React.FC<AgentsTableProps> = ({
    agents,
    total,
    loading,
    page,
    pageSize,
    onPageChange,
    onViewProfile,
    onApprove,
    onDelete,
}) => {
    const [approveDialog, setApproveDialog] = useState<{ open: boolean; agentId: string | null }>({
        open: false,
        agentId: null,
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; agentId: string | null }>({
        open: false,
        agentId: null,
    });

    const handleApproveConfirm = () => {
        if (approveDialog.agentId) {
            onApprove(approveDialog.agentId);
            setApproveDialog({ open: false, agentId: null });
        }
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.agentId) {
            onDelete(deleteDialog.agentId);
            setDeleteDialog({ open: false, agentId: null });
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'AGENT') {
            return (
                <Badge variant="outline" className="bg-edvios-green text-white border-none px-3 py-1 rounded-full text-xs font-bold">
                    APPROVED
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1 rounded-full text-xs font-bold">
                PENDING
            </Badge>
        );
    };

    const columns = [
        {
            header: 'Agent',
            Cell: ({ row }: { row: Agent }) => (
                <div className="flex items-center gap-2">
                    <div className="min-w-0">
                        <div className="font-bold text-gray-900 text-sm md:text-base truncate">{row.firstName} {row.lastName}</div>
                        <div className="flex items-center gap-2 text-[10px] md:text-xs text-edvios-green font-bold uppercase tracking-widest mt-0.5">
                            Joined {new Date(row.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact & Organization',
            Cell: ({ row }: { row: Agent }) => (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {row.email}
                    </div>
                    {row.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {row.phone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            Cell: ({ row }: { row: Agent }) => getRoleBadge(row.role)
        },
        {
            header: 'Actions',
            Cell: ({ row }: { row: Agent }) => (
                <div className="flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProfile(row)}
                        className="text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all h-10 w-10 p-0"
                        title="View Profile"
                    >
                        <Eye className="w-5 h-5" />
                    </Button>

                    {row.role === 'PENDING_AGENT' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setApproveDialog({ open: true, agentId: row.id })}
                            className="text-gray-400 hover:bg-edvios-green/10 hover:text-edvios-blue rounded-md transition-all h-10 w-10 p-0"
                            title="Approve Agent"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, agentId: row.id })}
                        className="text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-all h-10 w-10 p-0"
                        title="Delete Agent"
                    >
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <Table
                    data={agents}
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

            <ConfirmDialog
                open={approveDialog.open}
                onClose={() => setApproveDialog({ open: false, agentId: null })}
                onConfirm={handleApproveConfirm}
                title="Approve Agent"
                description="Approve this agent? They will gain access to the agent portal."
                confirmText="Approve"
                cancelText="Cancel"
            />

            <ConfirmDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, agentId: null })}
                onConfirm={handleDeleteConfirm}
                title="Delete Agent"
                description="Are you sure you want to delete this agent? This will permanently remove their access."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
};
