"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Column<T> = {
  header: string;
  accessor?: keyof T;
  Cell?: (props: { row: T }) => React.ReactNode;
};

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function Table<T extends { id: string }>({
  data,
  columns,
  loading,
  pagination,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-4 py-3 text-left font-medium">
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 w-16 bg-gray-100 animate-pulse rounded" />
                  <div className="h-4 w-full bg-gray-50 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        No records found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-medium"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/50 transition border-b border-gray-100 last:border-0"
              >
                {columns.map((col, index) => (
                  <td key={index} className="px-4 py-3">
                    {col.Cell
                      ? col.Cell({ row })
                      : (row[col.accessor as keyof typeof row] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4 p-4">
        {data.map((row) => (
          <div key={row.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {columns.map((col, index) => (
              <div key={index} className={`p-4 ${index !== columns.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {col.header}
                  </span>
                  <div className="text-sm text-gray-900">
                    {col.Cell
                      ? col.Cell({ row })
                      : (row[col.accessor as keyof typeof row] as React.ReactNode)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
          <span className="text-sm text-muted-foreground order-2 sm:order-1">
            Page {pagination.currentPage} of{" "}
            {Math.ceil(pagination.totalItems / pagination.pageSize)}
          </span>

          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={pagination.currentPage === 1}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              disabled={
                pagination.currentPage >=
                Math.ceil(
                  pagination.totalItems / pagination.pageSize
                )
              }
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
