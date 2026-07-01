import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
  loading?: boolean;
}

export function Table<T>({
  data,
  columns,
  emptyMessage = 'No items found.',
  loading = false
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/40">
      <table className="w-full text-left border-collapse text-sm text-neutral-300">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/50">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-neutral-500">
                <span className="inline-block animate-pulse">Loading data...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-10 text-center text-neutral-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-neutral-900/40 transition-colors">
                {columns.map((column, colIdx) => (
                  <td key={colIdx} className={`px-5 py-4 text-neutral-300 align-middle ${column.className || ''}`}>
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
