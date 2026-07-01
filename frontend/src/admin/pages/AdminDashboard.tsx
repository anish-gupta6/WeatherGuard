import React from 'react';
import AdminLayout from '../components/AdminLayout';
import PendingUsersTable from '../components/PendingUsersTable';
import { Clock, Shield, MapPin, Cloud } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';


interface Props {
  user: any;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const { users, usersLoading, weather, weatherLoading, weatherError, updateUserStatus } = useAdmin();

  const pendingUsers = users.filter((u) => u.status === 'PENDING');

  const handleApprove = async (id: string) => {
    await updateUserStatus(id, 'APPROVED');
  };

  const handleReject = async (id: string) => {
    await updateUserStatus(id, 'REJECTED');
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>

      <div className="relative overflow-hidden bg-[#0f1f16] rounded-[24px] py-6 sm:py-[34px] px-6 sm:px-[36px] mb-[18px] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 w-full md:w-auto">
          <div className="flex items-center gap-2 text-[#9bd8b5] text-[12px] font-semibold mb-3.5">
            <Cloud className="w-4 h-4" />
            Live forecast for {user.city}
          </div>
          {weatherLoading ? (
            <div className="flex items-center gap-3 py-4 text-green-300">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-300 border-t-white" />
              <span className="text-sm font-medium">Loading weather…</span>
            </div>
          ) : weatherError ? (
            <p className="py-4 text-sm font-medium text-red-400">
              Unable to load weather for {user.city}.
            </p>
          ) : weather ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl sm:text-[64px] font-bold tracking-[-0.03em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {weather.temp}
                </span>
                <span className="text-2xl sm:text-[28px] font-semibold text-[#9bd8b5]">°C</span>
              </div>
              <div className="text-[17px] font-semibold text-[#22c55e] mt-1 capitalize">{weather.description}</div>
              <div className="text-[#8aa295] text-[13.5px] mt-0.5">{weather.city}</div>
            </>
          ) : null}
        </div>

        {weather && !weatherLoading && !weatherError && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-[22px] relative z-10 w-full md:w-auto">

            <div className="relative z-10 flex gap-3 flex-wrap w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-[16px] py-4 px-[22px] min-w-[118px] backdrop-blur-[6px]">
                <div className="text-[#8aa295] text-[10px] font-bold tracking-[0.08em] uppercase mb-1.5">Feels like</div>
                <div className="text-[22px] font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {weather.feelsLike}°C
                </div>
              </div>
              <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 rounded-[16px] py-4 px-[22px] min-w-[118px] backdrop-blur-[6px]">
                <div className="text-[#8aa295] text-[10px] font-bold tracking-[0.08em] uppercase mb-1.5">Humidity</div>
                <div className="text-[22px] font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {weather.humidity}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[18px] mb-[18px]">
        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 ">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#fef3e1] text-[#b97a13]">
            <Clock className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Pending</div>
            <div className="text-[26px] font-bold tracking-[-0.01em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {pendingUsers.length}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 ">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#0c1410] text-[#22c55e]">
            <Shield className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Role</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#179a4d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user.role}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 ">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#e3f8ea] text-[#179a4d]">
            <MapPin className="w-3 h-3 sm: w-5 h-5" />
          </div>
          <div>
            <div className="text-[#92a098] text-[10px] sm:text-[12px] font-bold tracking-[0.07em] uppercase mb-1">Your city</div>
            <div className="text-[26px] font-bold tracking-[-0.01em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user.city}
            </div>
          </div>
        </div>
      </div>



      <div className="bg-white border border-[#e3e9e3] rounded-[24px] pt-[28px] px-6 sm:px-[30px] pb-2">
        <div className="flex items-center justify-between pb-[22px] border-b border-[#e3e9e3] flex-wrap gap-4">
          <div>
            <h3 className="text-[18px] font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Pending sign-ups</h3>
            <p className="text-[#5d6b62] text-[13.5px] mt-1">Review and approve new user requests</p>
          </div>
          <span className="bg-[#e3f8ea] text-[#179a4d] text-[12px] font-bold py-1.5 px-[13px] rounded-full w-full sm:w-auto text-center">
            {pendingUsers.length} waiting
          </span>
        </div>

        <PendingUsersTable
          users={pendingUsers}
          loading={usersLoading}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
