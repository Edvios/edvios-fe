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
      <div className="flex justify-center py-10 text-muted-foreground">
        Loading data...
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
      <div className="overflow-x-auto ">
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
                className=" hover:bg-muted/50 transition"
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

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between p-2 mb-2">
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of{" "}
            {Math.ceil(pagination.totalItems / pagination.pageSize)}
          </span>

          <div className="flex gap-2 p-2">
            <Button
              variant="outline"
              size="sm"
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
