import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import AllUsersTable from '../components/AllUsersTable';
import { Users, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface Props {
  user: any;
  onLogout: () => void;
}

const AdminUsers: React.FC<Props> = ({ user, onLogout }) => {
  const { users, usersLoading, updateUserStatus } = useAdmin();
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');

  const handleRevoke = async (id: string) => {
    await updateUserStatus(id, 'REVOKED');
  };

  const handleApprove = async (id: string) => {
    await updateUserStatus(id, 'APPROVED');
  };

  const handleReject = async (id: string) => {
    await updateUserStatus(id, 'REJECTED');
  };

  const displayUsers = users.filter((u) => u._id !== user._id && u.role !== 'ADMIN' && u.role !== 'SUPER_ADMIN');

  const totalUsers = displayUsers.length;
  const approvedUsers = displayUsers.filter((u) => u.status === 'APPROVED').length;
  const pendingUsers = displayUsers.filter((u) => u.status === 'PENDING').length;
  const rejectedUsers = displayUsers.filter((u) => u.status === 'REJECTED' || u.status === 'REVOKED').length;

  const filteredUsers = displayUsers.filter(u => {
    if (filter === 'ALL') return true;
    if (filter === 'REJECTED') return u.status === 'REJECTED' || u.status === 'REVOKED';
    return u.status === filter;
  });

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="mb-[18px] grid grid-cols-2 lg:grid-cols-4 gap-[18px]">
        <div
          onClick={() => setFilter('ALL')}
          className={`bg-white border ${filter === 'ALL' ? 'border-[#a8b8b0]' : 'border-[#e3e9e3]'} rounded-[18px] p-3 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(20,40,25,0.18)]`}
        >
          <div className="w-10 h-10 sm:w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center bg-[#f7f9f8] text-[#5d6b62]">
            <Users className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Total Users</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {totalUsers}
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('APPROVED')}
          className={`bg-white border ${filter === 'APPROVED' ? 'border-[#22c55e]' : 'border-[#e3e9e3]'} rounded-[18px] p-3 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(20,40,25,0.18)]`}
        >
          <div className="w-10 h-10 sm:w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center bg-[#e3f8ea] text-[#179a4d]">
            <CheckCircle2 className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Approved</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#179a4d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {approvedUsers}
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('PENDING')}
          className={`bg-white border ${filter === 'PENDING' ? 'border-[#f59e0b]' : 'border-[#e3e9e3]'} rounded-[18px] p-3 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(20,40,25,0.18)]`}
        >
          <div className="w-10 h-10 sm:w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center bg-[#fef3e1] text-[#b97a13]">
            <Clock className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Pending</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#b97a13]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {pendingUsers}
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('REJECTED')}
          className={`bg-white border ${filter === 'REJECTED' ? 'border-[#ef4444]' : 'border-[#e3e9e3]'} rounded-[18px] p-3 sm:p-5 flex items-center gap-4 cursor-pointer transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_14px_30px_-16px_rgba(20,40,25,0.18)]`}
        >
          <div className="w-10 h-10 sm:w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center bg-[#fee2e2] text-[#b91c1c]">
            <XCircle className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Rejected</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#b91c1c]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {rejectedUsers}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e3e9e3] rounded-[24px] pt-[28px] px-6 sm:px-[30px] pb-2">
        <div className="flex items-center justify-between pb-[22px] border-b border-[#e3e9e3] flex-wrap gap-4">
          <div>
            <h3 className="text-[18px] font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>User Management</h3>
            <p className="text-[#5d6b62] text-[13.5px] mt-1">View and manage system access</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="bg-[#f7f9f8] border border-[#e3e9e3] text-[#5d6b62] text-[12px] font-bold py-1.5 px-[13px] rounded-full text-center uppercase tracking-[0.05em]">
              Filter: {filter}
            </span>
          </div>
        </div>

        <AllUsersTable
          users={filteredUsers}
          loading={usersLoading}
          onRevoke={handleRevoke}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
