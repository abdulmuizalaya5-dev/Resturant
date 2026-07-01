'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Shield, UserCheck } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Table } from '@/components/Table';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { User } from '@/types';

export default function AdminUsers() {
  const { users, deleteUser, updateUserRole, addUser } = useAppState();
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'owner' | 'admin' | 'worker'>('customer');
  const [assignedComponent, setAssignedComponent] = useState<'reservations' | 'tables' | 'restaurants' | 'analytics'>('reservations');
  const [accessKey, setAccessKey] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addUser({
      name,
      email,
      phone: phone || '+1 (555) 555-5555',
      role,
      assignedComponent: role === 'worker' ? assignedComponent : undefined,
      accessKey: role === 'worker' ? (accessKey || `cyan-staff-${Math.floor(100 + Math.random() * 900)}`) : undefined
    });

    setAddModalOpen(false);
    
    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setRole('customer');
    setAssignedComponent('reservations');
    setAccessKey('');
    
    alert(`Account for ${name} created successfully.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to suspend this user account?')) {
      deleteUser(userId);
      alert('Account suspended.');
    }
  };

  const handleRoleToggle = (userId: string) => {
    const userObj = users.find(u => u.id === userId);
    if (!userObj) return;
    const roles: User['role'][] = ['customer', 'owner', 'worker', 'admin'];
    const nextIndex = (roles.indexOf(userObj.role) + 1) % roles.length;
    updateUserRole(userId, roles[nextIndex]);
  };

  const columns = [
    {
      header: 'User ID',
      accessor: (u: User) => (
        <span className="font-mono text-xs font-semibold text-neutral-500">#{u.id}</span>
      )
    },
    {
      header: 'Name',
      accessor: (u: User) => (
        <div className="font-semibold text-white">{u.name}</div>
      )
    },
    {
      header: 'Email Address',
      accessor: (u: User) => (
        <span className="text-neutral-450 font-light text-xs">{u.email}</span>
      )
    },
    {
      header: 'Phone Number',
      accessor: (u: User) => (
        <span className="text-neutral-400 font-mono text-xs">{u.phone}</span>
      )
    },
    {
      header: 'Current Role',
      accessor: (u: User) => (
        <div className="flex flex-col gap-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-fit ${
            u.role === 'admin'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : u.role === 'owner'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
              : u.role === 'worker'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            {u.role}
          </span>
          {u.role === 'worker' && u.assignedComponent && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-500 font-mono italic leading-none">
                Dept: {u.assignedComponent}
              </span>
              {u.accessKey && (
                <span className="text-[9px] text-amber-500 font-mono leading-none">
                  Key: {u.accessKey}
                </span>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Management Actions',
      className: 'text-right',
      accessor: (u: User) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleRoleToggle(u.id)}
            className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-500 cursor-pointer"
            title="Cycle Role Tier"
          >
            <UserCheck size={12} />
          </button>
          <button
            onClick={() => handleDeleteUser(u.id)}
            className="p-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
            title="Suspend Account"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 font-sans text-neutral-200">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
              Account Control
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Manage platform credentials, suspend accounts, or assign role permissions.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)} className="h-fit">
            <Plus size={16} className="mr-1.5" />
            Provision Account
          </Button>
        </div>

        {/* Users Table */}
        <Table
          data={users}
          columns={columns}
        />

        {/* Add User Modal */}
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Provision New Account">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-sans text-neutral-300">
            <Input label="Name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Email address" placeholder="john@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Phone Number" placeholder="+1 (555) 555-5555" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            
            <div className="flex flex-col">
              <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Permission Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg outline-none"
              >
                <option value="customer">Customer Diner</option>
                <option value="owner">Restaurant Owner</option>
                <option value="worker">Staff Worker</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            
            {role === 'worker' && (
              <>
                <div className="flex flex-col animate-fade-in">
                  <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">In Charge Of Component</label>
                  <select
                    value={assignedComponent}
                    onChange={e => setAssignedComponent(e.target.value as any)}
                    className="bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg outline-none"
                  >
                    <option value="restaurants">Restaurants Profile & Menu</option>
                    <option value="tables">Tables Seating Config</option>
                    <option value="reservations">Reservations & Customers list</option>
                    <option value="analytics">Performance Analytics</option>
                  </select>
                </div>

                <Input
                  label="Worker Access Key (Optional)"
                  placeholder="e.g. staff-key-123 (defaults to auto-generated)"
                  value={accessKey}
                  onChange={e => setAccessKey(e.target.value)}
                />
              </>
            )}
            
            <Button type="submit" variant="primary" fullWidth className="py-2.5">Provision Credentials</Button>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
