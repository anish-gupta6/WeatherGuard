import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Clock, Check, X, AlertTriangle, Send, MapPin, Shield } from 'lucide-react';
import UserLayout from '../components/UserLayout';
import { useSocket } from '../../context/SocketContext';

interface Props {
  user: any;
  onUserUpdate: (user: any) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<Props> = ({ user, onUserUpdate, onLogout }) => {
  const [botUsername, setBotUsername] = useState<string | null>(null);
  const { socket } = useSocket();
  const userId = user._id ?? user.id;
  const telegramLink = botUsername ? `https://t.me/${botUsername}?start=${userId}` : null;

  useEffect(() => {
    api
      .get('/telegram/bot')
      .then((res) => setBotUsername(res.data.username))
      .catch(() => setBotUsername(null));
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    const handleUserUpdate = (updatedUser: any) => {
      if (updatedUser._id === user._id) {
        onUserUpdate(updatedUser);
      }
    };

    socket.on('userUpdated', handleUserUpdate);

    return () => {
      socket.off('userUpdated', handleUserUpdate);
    };
  }, [socket, user, onUserUpdate]);

  return (
    <UserLayout user={user} onLogout={onLogout}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] mb-[18px]">
        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 12px">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#fef3e1] text-[#b97a13]">
            <MapPin className="w-[21px] h-[21px]" />
          </div>
          <div>
            <div className="text-[#92a098] text-[11.5px] font-bold tracking-[0.07em] uppercase mb-1">Your City</div>
            <div className="text-[26px] font-bold tracking-[-0.01em]" style={{ fontFamily: 'Outfit, sans-serif' }}>{user.city}</div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 12px">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#0c1410] text-[#22c55e]">
            <Shield className="w-[21px] h-[21px]" />
          </div>
          <div>
            <div className="text-[#92a098] text-[11.5px] font-bold tracking-[0.07em] uppercase mb-1">Account</div>
            <div className="text-[26px] font-bold tracking-[-0.01em] text-[#179a4d]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user.status}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e3e9e3] rounded-[18px] py-[22px] px-[24px] flex items-center gap-4 12px">
          <div className="w-[46px] h-[46px] rounded-[14px] shrink-0 flex items-center justify-center bg-[#e3f8ea] text-[#179a4d]">
            <Send className="w-[21px] h-[21px]" />
          </div>
          <div>
            <div className="text-[#92a098] text-[11.5px] font-bold tracking-[0.07em] uppercase mb-1">Telegram</div>
            <div className="text-[26px] font-bold tracking-[-0.01em]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user.telegramChatId ? 'Connected' : 'Not linked'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e3e9e3] rounded-[24px] pt-[28px] px-6 sm:px-[30px] pb-6 sm:pb-8 text-center min-h-[360px] flex items-center justify-center">
        {user.status === 'PENDING' && (
          <div className="max-w-md mx-auto py-10">
            <div className="w-[64px] h-[64px] mx-auto rounded-[18px] bg-[#fef3e1] flex items-center justify-center mb-[18px] text-[#b97a13]">
              <Clock className="w-[28px] h-[28px]" />
            </div>
            <h4 className="text-[22px] font-semibold mb-2 text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>Awaiting approval</h4>
            <p className="text-[#5d6b62] text-[14.5px]">
              Your account is in the review queue. An administrator will approve your access soon.
            </p>
          </div>
        )}

        {user.status === 'APPROVED' && user.telegramChatId && (
          <div className="max-w-md mx-auto py-10">
            <div className="w-[64px] h-[64px] mx-auto rounded-[18px] bg-[#e3f8ea] flex items-center justify-center mb-[18px] text-[#179a4d]">
              <Check className="w-[28px] h-[28px]" strokeWidth={2.5} />
            </div>
            <h4 className="text-[22px] font-semibold mb-2 text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>You're all set!</h4>
            <p className="text-[#5d6b62] text-[14.5px]">
              Hourly weather alerts for <strong className="text-[#0b1410]">{user.city}</strong> will arrive in your Telegram chat.
            </p>
            <div className="mt-8 inline-flex flex-col items-center rounded-[18px] border border-[#e3e9e3] bg-[#f7f9f8] px-8 py-5">
              <span className="text-[#92a098] text-[11px] font-bold tracking-[0.08em] uppercase mb-1.5">Linked chat ID</span>
              <span className="font-mono text-[20px] font-bold text-[#0b1410]">{user.telegramChatId}</span>
            </div>
          </div>
        )}

        {user.status === 'APPROVED' && !user.telegramChatId && (
          <div className="max-w-md mx-auto py-10">
            <div className="w-[64px] h-[64px] mx-auto rounded-[18px] bg-[#e3f8ea] flex items-center justify-center mb-[18px] text-[#179a4d]">
              <Send className="w-[28px] h-[28px]" />
            </div>
            <h4 className="text-[22px] font-semibold mb-2 text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>Connect Telegram</h4>
            <p className="text-[#5d6b62] text-[14.5px]">
              Press <strong className="text-[#0b1410]">Start</strong> in the bot chat after opening the link below. This page updates automatically.
            </p>
            {botUsername && <p className="mt-3 text-[13.5px] font-semibold text-[#179a4d]">@{botUsername}</p>}
            {telegramLink ? (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#22c55e] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(34,197,94,0.2)] transition-all hover:bg-[#1fa951] active:scale-95"
              >
                <Send className="w-5 h-5" />
                Connect Now
              </a>
            ) : (
              <p className="mt-6 text-[13.5px] font-medium text-[#b91c1c]">
                Telegram bot unavailable — check backend configuration.
              </p>
            )}
          </div>
        )}

        {user.status === 'REJECTED' && (
          <div className="max-w-md mx-auto py-10">
            <div className="w-[64px] h-[64px] mx-auto rounded-[18px] bg-[#fee2e2] flex items-center justify-center mb-[18px] text-[#b91c1c]">
              <X className="w-[28px] h-[28px]" />
            </div>
            <h4 className="text-[22px] font-semibold mb-2 text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>Access denied</h4>
            <p className="text-[#5d6b62] text-[14.5px]">
              Your application was not approved. Contact an administrator if you believe this is an error.
            </p>
          </div>
        )}

        {user.status === 'REVOKED' && (
          <div className="max-w-md mx-auto py-10">
            <div className="w-[64px] h-[64px] mx-auto rounded-[18px] bg-[#f7f9f8] border border-[#e3e9e3] flex items-center justify-center mb-[18px] text-[#5d6b62]">
              <AlertTriangle className="w-[28px] h-[28px]" />
            </div>
            <h4 className="text-[22px] font-semibold mb-2 text-[#0b1410]" style={{ fontFamily: 'Outfit, sans-serif' }}>Approval Revoked</h4>
            <p className="text-[#5d6b62] text-[14.5px]">
              Your approval to access the system has been revoked by an administrator. Please contact support if you need assistance.
            </p>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserDashboard;
