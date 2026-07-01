import React from 'react';
import { CheckCircle, MapPin } from 'lucide-react';

export interface PendingUser {
  _id: string;
  name: string;
  email: string;
  city: string;
  status: string;
  createdAt: string;
}

interface Props {
  users: PendingUser[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingUsersTable: React.FC<Props> = ({ users, loading, onApprove, onReject }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#e3e9e3] border-t-[#22c55e]" />
        <p className="text-sm font-medium text-[#5d6b62]">Loading requests…</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-[42px] px-5 pb-[56px] text-center">
        <div className="w-[64px] h-[64px] rounded-[18px] bg-[#e3f8ea] flex items-center justify-center mb-[18px] text-[#179a4d]">
          <CheckCircle className="w-[28px] h-[28px]" />
        </div>
        <h4 className="text-[17px] font-semibold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>All caught up</h4>
        <p className="text-[#5d6b62] text-[13.5px]">No pending requests right now.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#e3e9e3] bg-[#f7f9f8] text-[11px] font-bold uppercase tracking-[0.08em] text-[#92a098]">
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e3e9e3]">
          {users.map((u) => (
            <tr key={u._id} className="transition-colors hover:bg-[#f7f9f8]/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e3f8ea] text-sm font-bold text-[#179a4d]">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0b1410]">{u.name}</p>
                    <p className="text-[13px] text-[#5d6b62]">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f7f9f8] border border-[#e3e9e3] px-3 py-1 text-[13px] font-medium text-[#5d6b62]">
                  <MapPin className='w-4 h-4 mr-1' /> {u.city}
                </span>
              </td>
              <td className="px-6 py-4 text-[13px] text-[#5d6b62]">
                {new Date(u.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onReject(u._id)}
                    className="rounded-xl border border-[#e3e9e3] px-4 py-2 text-[13px] font-semibold text-[#b3382f] transition-all duration-200 hover:border-[#f3c9c5] hover:bg-[#fdf1f0]"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(u._id)}
                    className="rounded-xl bg-[#22c55e] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all duration-200 hover:bg-[#1fa951] hover:-translate-y-[1px] active:scale-95"
                  >
                    Approve
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingUsersTable;
