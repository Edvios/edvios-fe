import React, { useState } from 'react';
import { useAgents } from '../hooks/use-agents';
import { AgentStatus } from '../types/agent.types';
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AgentManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AgentStatus | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { agents, total, loading } = useAgents({ search, page, pageSize });



  return (
    <div>
      <p className="text-3xl md:text-4xl font-extrabold text-edvios-blue tracking-tight">Agent Management</p>

      <div className="filters">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as AgentStatus)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table
        data={agents}
        loading={loading}
        columns={[
          { header: 'First Name', accessor: 'firstName' },
          { header: 'Last Name', accessor: 'lastName' },
          { header: 'Email', accessor: 'email' },         
        ]}
        pagination={{
          currentPage: page,
          totalItems: total,
          pageSize,
          onPageChange: setPage,
        }}
      />
    </div>
  );
};

export default AgentManagementPage;