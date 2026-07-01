import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface Props {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

const UserLayout: React.FC<Props> = ({
  user,
  onLogout,
  children,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen max-w-7xl mx-auto relative font-sans pb-20">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(900px 500px at 12% -10%, #d7ead9 0%, transparent 60%),
            radial-gradient(900px 600px at 110% 10%, #d1ecda 0%, transparent 55%)
          `
        }}
      />

      <div className="sticky top-[18px] z-50 flex justify-center px-4 sm:px-7 mb-[38px]">
        <nav
          className={`flex items-center justify-between gap-1 sm:gap-1.5 bg-gradient-to-b from-[#16241b] to-[#0c1410] border border-white/5 px-4 sm:px-7 py-3 rounded-full w-full transition-all duration-400 ease-out`}
        >
          <div className="flex items-center gap-2.5 pr-2 sm:pr-3.5 shrink-0">
            <div className="flex flex-col leading-[1.1] whitespace-nowrap">
              <strong className="text-white text-xs sm:text-[14.5px] font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Weather<span className="text-[#22c55e]">Guard</span>
              </strong>
              <small className="text-[#7e8d82] text-[8px] sm:text-[9.5px] tracking-[0.12em] font-semibold hidden sm:block">ALERT PLATFORM</small>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-1 sm:pl-2 shrink-0 relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-[5px] pr-2 sm:pr-3 pl-[5px] cursor-pointer transition-colors duration-200 hover:bg-white/10"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#22c55e] to-[#0f8a44] flex items-center justify-center text-[#06150c] font-bold text-[11.5px] shrink-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {initials || 'N/A'}
              </div>
              <div className="hidden lg:flex flex-col leading-[1.15]">
                <strong className="text-white text-[12.5px] font-semibold truncate">{user.name}</strong>
                <small className="text-[#7e8d82] text-[10px] truncate">{user.email}</small>
              </div>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl bg-[#0b1410] border border-white/10 p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[#9aa79f] text-xs truncate">{user.email}</p>
                  <div className="mt-1.5 inline-flex items-center rounded-full bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#22c55e] uppercase">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#ef4444] hover:bg-white/5 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-7 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-[30px] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#179a4d] text-xs font-bold tracking-[0.08em] uppercase mb-2">
              || USER PORTAL ||
            </div>
            <h1 className="text-2xl flex flex-wrap gap-x-2 sm:text-[32px] font-bold tracking-[-0.02em] text-[#0b1410]">
              Welcome, <span className="text-[#0f8a44]">{user.name}</span>
            </h1>
            <p className="mt-1.5 text-[#5d6b62] text-sm sm:text-[14.5px]">Manage your weather alerts and settings</p>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
};

export default UserLayout;
