'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ShieldAlert, ToggleLeft, Grid3X3, RefreshCw } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

export default function OwnerTables() {
  const { restaurants, tables, addTable, deleteTable, currentUser } = useAppState();

  // Filter owner's restaurants
  const ownedRestaurants = restaurants.filter(r => r.ownerId === currentUser?.id || r.ownerId === 'usr-2');
  const ownedIds = ownedRestaurants.map(r => r.id);

  // Active restaurant selection
  const [selectedRestId, setSelectedRestId] = useState(ownedIds[0] || '');

  // Add Table Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');

  // Filter tables matching the selected restaurant
  const displayTables = tables.filter(t => t.restaurantId === selectedRestId);

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) return;

    addTable({
      restaurantId: selectedRestId,
      number: tableNumber,
      capacity: parseInt(tableCapacity) || 4
    });

    setAddModalOpen(false);
    setTableNumber('');
    alert(`Table ${tableNumber} created successfully.`);
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      deleteTable(tableId);
      alert('Table deleted successfully.');
    }
  };

  const getStatusColor = (status: typeof tables[0]['status']) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'reserved':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'occupied':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8 font-sans text-neutral-200">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
              Table Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Configure seating capacities, layouts, and active occupancy rates.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            disabled={!selectedRestId}
            className="h-fit"
          >
            <Plus size={16} className="mr-1.5" />
            Add Seating Table
          </Button>
        </div>

        {/* Restaurant selector tab */}
        <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-850 p-2 rounded-2xl w-fit max-w-full overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-neutral-500 px-3 shrink-0">Select Restaurant:</span>
          {ownedRestaurants.map(rest => (
            <button
              key={rest.id}
              onClick={() => setSelectedRestId(rest.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedRestId === rest.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {rest.name}
            </button>
          ))}
        </div>

        {/* Tables Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayTables.length === 0 ? (
            <div className="col-span-full py-16 border border-neutral-900 border-dashed rounded-3xl text-center text-neutral-500 text-xs">
              <Grid3X3 size={32} className="mx-auto text-neutral-700 mb-3 animate-pulse" />
              <p className="font-semibold text-neutral-400 mb-1">No Tables Configured</p>
              <p className="text-neutral-550">Click "Add Seating Table" to configure the layout of this restaurant.</p>
            </div>
          ) : (
            displayTables.map(tbl => (
              <Card key={tbl.id} variant="glass" className="p-4 flex flex-col justify-between items-center text-center space-y-4 border-neutral-850">
                <span className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold font-mono">ID: {tbl.id.split('-')[1] || tbl.id}</span>
                
                <div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight leading-none mb-1 font-mono">
                    #{tbl.number}
                  </h3>
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Capacity: {tbl.capacity} Pax
                  </span>
                </div>

                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border capitalize ${getStatusColor(tbl.status)}`}>
                  {tbl.status}
                </div>

                <button
                  onClick={() => handleDeleteTable(tbl.id)}
                  className="p-1 rounded text-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/10 hover:bg-red-500/5 cursor-pointer mt-2"
                  title="Remove Table"
                >
                  <Trash2 size={13} />
                </button>
              </Card>
            ))
          )}
        </div>

        {/* Add Table Modal */}
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Configure Seating Table">
          <form onSubmit={handleAddTableSubmit} className="space-y-4 text-xs">
            <Input
              label="Table Tag/Number"
              placeholder="e.g. 104 or Patio-2"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              required
            />
            <div className="flex flex-col">
              <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Maximum Capacity</label>
              <select
                value={tableCapacity}
                onChange={e => setTableCapacity(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg outline-none"
              >
                {[1, 2, 3, 4, 6, 8, 10, 12].map(cap => (
                  <option key={cap} value={cap}>
                    {cap} {cap === 1 ? 'Person' : 'People'}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" fullWidth className="py-2.5">Add to Seating Plan</Button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
