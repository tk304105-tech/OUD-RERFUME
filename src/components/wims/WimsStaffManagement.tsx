import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Trash2, 
  CheckCircle2, 
  X, 
  Mail, 
  Lock, 
  Clock,
  RotateCcw
} from 'lucide-react';
import { WimsUser, wimsDb } from '../../services/supabase';
import { ConfirmModal } from '../common/ConfirmModal';

interface WimsStaffManagementProps {
  currentUser: WimsUser | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export function WimsStaffManagement({
  currentUser,
  showToast
}: WimsStaffManagementProps) {
  const [users, setUsers] = useState<WimsUser[]>(wimsDb.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [error, setError] = useState('');

  const refreshUsers = () => {
    setUsers(wimsDb.getUsers());
  };

  const handleToggleRole = (u: WimsUser) => {
    if (u.id === currentUser?.id) {
      showToast('Cannot demote your own active logged-in administrator session.', 'warning');
      return;
    }

    const updatedRole: 'ADMIN' | 'STAFF' = u.role === 'ADMIN' ? 'STAFF' : 'ADMIN';
    wimsDb.saveUser({ ...u, role: updatedRole });
    refreshUsers();
    showToast(`Updated role for ${u.full_name} to ${updatedRole}.`, 'success');
  };

  const handleToggleStatus = (u: WimsUser) => {
    if (u.id === currentUser?.id) {
      showToast('Cannot deactivate your own active session.', 'warning');
      return;
    }

    const updatedStatus: 'ACTIVE' | 'INACTIVE' = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    wimsDb.saveUser({ ...u, status: updatedStatus });
    refreshUsers();
    showToast(`Account for ${u.full_name} set to ${updatedStatus}.`, 'info');
  };

  const [userToDelete, setUserToDelete] = useState<WimsUser | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const handleDeleteUser = (u: WimsUser) => {
    if (u.id === currentUser?.id) {
      showToast('Cannot delete your own active administrator account.', 'warning');
      return;
    }
    setUserToDelete(u);
  };

  const handleConfirmDeleteUser = () => {
    if (!userToDelete) return;
    setIsDeletingUser(true);
    try {
      wimsDb.deleteUser(userToDelete.id);
      refreshUsers();
      showToast(`User ${userToDelete.full_name} (${userToDelete.email}) removed.`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove user', 'error');
    } finally {
      setIsDeletingUser(false);
      setUserToDelete(null);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail.trim() || !newName.trim()) {
      setError('Name and valid email are required.');
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setError('A staff user with this email address already exists.');
      return;
    }

    wimsDb.saveUser({
      id: `u-${Date.now()}`,
      email: cleanEmail,
      full_name: newName.trim(),
      role: newRole,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    });

    refreshUsers();
    showToast(`Staff account for ${newName} created successfully.`, 'success');
    setIsModalOpen(false);
    setNewEmail('');
    setNewName('');
    setNewRole('STAFF');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-[#e1e2e8]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#32363e]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-[#ffe09d] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#ffe09d]" />
            <span>Admin Control Perimeter</span>
          </div>
          <h1 className="font-syne text-2xl font-bold text-[#e1e2e8] mt-0.5">
            Staff & User Access Management
          </h1>
          <p className="text-xs font-mono-data text-[#999080]">
            Role-Based Access Control (RBAC): Admin permissions, Staff intake limits, and session authorization
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#ffe09d] text-[#111111] hover:bg-[#e5c378] text-xs font-syne font-bold uppercase rounded flex items-center gap-1.5 shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New Staff</span>
        </button>
      </div>

      {/* Permissions Matrix Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-data">
        <div className="p-4 bg-[#14171d] border border-[#ffe09d]/30 rounded space-y-2">
          <div className="flex items-center gap-2 text-[#ffe09d] font-bold uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrator Privileges (ADMIN)</span>
          </div>
          <ul className="space-y-1 text-[#c2cad6] text-[11px]">
            <li>• Full access to product catalog and soft deletion</li>
            <li>• Record Inbound, Outbound, Adjustments & Returns</li>
            <li>• Staff account management and role promotions</li>
            <li>• Change negative stock policies and system settings</li>
          </ul>
        </div>

        <div className="p-4 bg-[#14171d] border border-[#70b5f9]/30 rounded space-y-2">
          <div className="flex items-center gap-2 text-[#70b5f9] font-bold uppercase">
            <Users className="w-4 h-4" />
            <span>Staff Operator Privileges (STAFF)</span>
          </div>
          <ul className="space-y-1 text-[#c2cad6] text-[11px]">
            <li>• View Dashboard, Products, Stock Levels & Low Stock Alerts</li>
            <li>• Record Inbound Intake, Outbound Dispatch & Adjustments</li>
            <li>• Generate and export Inventory and Movements Reports</li>
            <li>• ✗ Cannot delete products, manage users, or alter settings</li>
          </ul>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#14171d] border border-[#32363e] rounded overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-data">
            <thead className="bg-[#0b0e12] text-[#999080] uppercase text-[10px] border-b border-[#32363e]">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32363e]/40">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#1a1d24] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#e1e2e8]">{u.full_name}</div>
                    <div className="text-[11px] text-[#999080]">{u.email}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      u.role === 'ADMIN' 
                        ? 'bg-[#3b2a0c] text-[#ffe09d] border-[#ffe09d]/30' 
                        : 'bg-[#1b2b3b] text-[#70b5f9] border-[#28435d]'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'ACTIVE' 
                        ? 'bg-[#1e231a] text-[#4ade80]' 
                        : 'bg-[#3d171a] text-[#ff8080]'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-[#999080]">
                    {new Date(u.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="px-2 py-1 bg-[#191c20] hover:bg-[#20252e] border border-[#32363e] text-[#ffe09d] text-[10px] rounded transition-colors"
                        title="Toggle Admin / Staff Role"
                      >
                        Toggle Role
                      </button>

                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2 py-1 text-[10px] rounded border transition-colors ${
                          u.status === 'ACTIVE' 
                            ? 'bg-[#2a1719] border-[#5e2329] text-[#ff8080] hover:bg-[#3d1c20]' 
                            : 'bg-[#1e231a] border-[#2d4a22] text-[#4ade80] hover:bg-[#2d4a22]'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>

                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1 text-[#ff8080] hover:bg-[#ff8080]/10 rounded transition-colors"
                          title="Remove User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111418] border border-[#ffe09d] rounded shadow-2xl w-full max-w-md p-6 space-y-4 text-xs font-mono-data text-[#e1e2e8]">
            <div className="flex items-center justify-between pb-2 border-b border-[#32363e]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#ffe09d]" />
                <h3 className="font-syne text-base font-bold text-[#ffe09d] uppercase">
                  Provision New Staff Account
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-[#999080] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-[#3d171a] border border-[#E5484D] text-[#ff8080] rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-[10px] text-[#999080] uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Asad Rehman"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#32363e] text-[#e1e2e8] rounded focus:outline-none focus:border-[#ffe09d]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#999080] uppercase block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. asad@warehouse.io"
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#32363e] text-[#e1e2e8] rounded focus:outline-none focus:border-[#ffe09d]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#999080] uppercase block mb-1">Clearance Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'STAFF')}
                  className="w-full h-10 px-3 bg-[#191c20] border border-[#32363e] text-[#e1e2e8] rounded focus:outline-none cursor-pointer"
                >
                  <option value="STAFF">STAFF (Inbound / Outbound / Reports)</option>
                  <option value="ADMIN">ADMIN (Full Vault Access & User Control)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#32363e] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#191c20] text-[#999080] uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ffe09d] text-[#111111] font-bold uppercase rounded hover:bg-[#e5c378] transition-all shadow-md"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Deletion Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Remove Staff / User Account"
        message={`Are you sure you want to remove user "${userToDelete?.full_name}" (${userToDelete?.email})? They will immediately lose access to the Warehouse Inventory Management System.`}
        confirmLabel="Remove User"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isDeletingUser}
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}
