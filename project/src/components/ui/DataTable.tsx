import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
  }[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg">
        <div className="p-4 flex justify-center">
          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg">
        <div className="p-4 text-center text-gray-500">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, idx) => {
                const isSortable = typeof column.accessor === 'string';
                return (
                  <th
                    key={idx}
                    scope="col"
                    className={cn(
                      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      isSortable && 'cursor-pointer hover:bg-gray-100',
                      column.className
                    )}
                    onClick={() => {
                      if (isSortable) {
                        handleSort(column.accessor as keyof T);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {isSortable && sortColumn === column.accessor && (
                        <span>
                          {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  onRowClick && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-500', column.className)}
                  >
                    {typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;