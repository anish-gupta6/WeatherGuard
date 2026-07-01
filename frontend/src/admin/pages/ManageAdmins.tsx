import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { ShieldAlert, MapPin } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface Props {
  user: any;
  onLogout: () => void;
}

const ManageAdmins: React.FC<Props> = ({ user, onLogout }) => {
  const { users, usersLoading, addAdmin, removeAdmin } = useAdmin();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setIsAddingAdmin(true);
    try {
      await addAdmin(newAdminEmail);
      setNewAdminEmail('');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      await removeAdmin(id);
    }
  };

  const displayAdmins = users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="bg-white border border-[#e3e9e3] rounded-[24px] pt-[28px] px-6 sm:px-[30px] pb-2 mb-6">
        <div className="flex items-center justify-between pb-[22px] border-b border-[#e3e9e3] flex-wrap gap-4">
          <div>
            <h3 className="text-[18px] font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Manage Admins</h3>
            <p className="text-[#5d6b62] text-[13.5px] mt-1">Add or remove system administrators</p>
          </div>
        </div>

        <div className="py-6 border-b border-[#e3e9e3] mb-2">
          <h4 className="text-[15px] font-semibold mb-3">Add New Admin</h4>
          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Admin email address"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              required
              className="flex-1 bg-[#f7f9f8] border border-[#e3e9e3] rounded-xl px-4 py-2 text-[14px] outline-none focus:border-[#22c55e] transition-colors"
            />
            <button
              type="submit"
              disabled={isAddingAdmin}
              className="bg-[#22c55e] text-white px-5 py-2 rounded-xl text-[14px] font-semibold shadow-sm transition-all hover:bg-[#1fa951] disabled:opacity-50 whitespace-nowrap"
            >
              {isAddingAdmin ? 'Adding...' : 'Add Admin'}
            </button>
          </form>
        </div>

        <div className="py-4">
          <h4 className="text-[15px] font-semibold mb-4">Current Administrators</h4>
          {usersLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#e3e9e3] border-t-[#22c55e]" />
              <p className="text-sm font-medium text-[#5d6b62]">Loading admins…</p>
            </div>
          ) : displayAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-8 pb-10 text-center">
              <div className="w-[54px] h-[54px] rounded-[16px] bg-[#f7f9f8] border border-[#e3e9e3] flex items-center justify-center mb-4 text-[#5d6b62]">
                <ShieldAlert className="w-[24px] h-[24px]" />
              </div>
              <h4 className="text-[16px] font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>No admins found</h4>
              <p className="text-[#5d6b62] text-[13.5px]">There are no other administrators in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#e3e9e3] bg-[#f7f9f8] text-[11px] font-bold uppercase tracking-[0.08em] text-[#92a098]">
                    <th className="px-6 py-4">Admin</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e9e3]">
                  {displayAdmins.map((u) => (
                    <tr key={u._id} className="transition-colors hover:bg-[#f7f9f8]/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7f9f8] border border-[#e3e9e3] text-sm font-bold text-[#5d6b62]">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0b1410]">
                              {u.name} {u._id === user._id && <span className="ml-1 text-[#5d6b62] text-[13px] font-normal">(You)</span>}
                            </p>
                            <p className="text-[13px] text-[#5d6b62]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.05em] uppercase ${
                          u.role === 'SUPER_ADMIN' 
                            ? 'bg-[#e0e7ff] text-[#4338ca]' 
                            : 'bg-[#dbeafe] text-[#1d4ed8]'
                        }`}>
                          {u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f7f9f8] border border-[#e3e9e3] px-3 py-1 text-[13px] font-medium text-[#5d6b62]">
                          <MapPin className="w-3 h-3" /> {u.city || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u._id !== user._id && (
                          <button
                            onClick={() => handleRemoveAdmin(u._id)}
                            className="rounded-xl border border-[#e3e9e3] px-4 py-2 text-[13px] font-semibold text-[#b3382f] transition-all duration-200 hover:border-[#f3c9c5] hover:bg-[#fdf1f0]"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageAdmins;
