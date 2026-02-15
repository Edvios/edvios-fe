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
    Building2,
    Clock
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
                <Badge variant="outline" className="bg-edvios-green text-white border-gradient px-3 py-1 rounded-full text-xs font-bold">
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
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-edvios-green flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {(row.firstName?.[0] || '') + (row.lastName?.[0] || '')}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-base">{row.firstName} {row.lastName}</div>
                        <div className="flex items-center gap-2 text-xs text-gradient font-mono">
                            <Clock className="w-3 h-3" />
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
                        <Mail className="w-4 h-4 text-gradient" />
                        {row.email}
                    </div>
                    {row.organization && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <Building2 className="w-4 h-4 text-gradient" />
                            {row.organization}
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
                        className="hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all h-10 w-10 p-0"
                        title="View Profile"
                    >
                        <Eye className="w-5 h-5" />
                    </Button>

                    {row.role === 'PENDING_AGENT' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setApproveDialog({ open: true, agentId: row.id })}
                            className="hover:bg-edvios-green/10 hover:text-gradient text-gradient rounded-xl transition-all h-10 w-10 p-0"
                            title="Approve Agent"
                        >
                            <CheckCircle className="w-5 h-5" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, agentId: row.id })}
                        className="hover:bg-red-50 hover:text-red-600 text-red-400 rounded-xl transition-all h-10 w-10 p-0"
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
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
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
