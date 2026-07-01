import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      Cookies.set('access_token', accessToken, { expires: 1/96 }); // ~15 mins
      Cookies.set('refresh_token', refreshToken, { expires: 7 }); // 7 days
    }

    // Always redirect to the root which will handle subsequent routing based on user state
    navigate('/', { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1f16]">
      <div className="flex flex-col items-center">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-green-500" />
        <p className="text-white font-medium">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
