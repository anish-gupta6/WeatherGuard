import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const authError = searchParams.get('error') === 'auth_failed';

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center bg-[#0f1f16] p-6 sm:p-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
        <div className="relative mb-12 sm:mb-20">
          <Logo light size="lg" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-8">
          <div className="relative w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-white">
                  Weather alerts,<br />
                  <span className="text-green-400">delivered hourly.</span>
                </h2>
                <p className="mt-4 max-w-md text-base sm:text-lg text-green-100/60">
                  Secure, invite-only forecasts pushed straight to your Telegram — so you're never caught off guard.
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Hourly weather reports',
                  'Personalized to your city',
                  'Instant Telegram notifications',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm sm:text-base text-green-100/80">
                    <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400 shrink-0">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex w-full md:flex-1 flex-col items-center md:items-end justify-center py-4 md:py-12">
            <div className="bg-white/10 backdrop-blur-sm w-full max-w-md rounded-3xl p-6 sm:p-10 border border-white/5">
              <div className="mb-8 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="mt-2 text-sm text-gray-400">
                  Sign in with your Google account to continue
                </p>
              </div>

              {authError && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  Google sign-in failed. Restart the backend after config changes, then try again.
                </div>
              )}

              <button
                onClick={handleGoogleLogin}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-transparent bg-white px-6 py-3.5 sm:py-4 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 active:scale-[0.98]"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </button>

              <p className="mt-6 sm:mt-8 text-center text-xs leading-relaxed text-gray-400/80">
                By signing in, you agree to our invite-only access policy.
                New accounts require admin approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
