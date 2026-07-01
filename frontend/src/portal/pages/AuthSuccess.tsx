import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tokens are now set securely via HTTP-only cookies by the backend.
    // We just need to redirect to the root which will handle subsequent routing.
    navigate('/', { replace: true });
  }, [navigate]);

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
