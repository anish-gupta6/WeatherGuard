import React, { useState } from 'react';
import api from '../../services/api';
import { Loader2, MapPin, Check } from 'lucide-react';
import Logo from '../components/Logo';

interface Props {
  onComplete: (user: any) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/me/onboarding', { city });
      onComplete(res.data);
    } catch {
      alert('Failed to save city. Please try again.');
    } finally {
      setLoading(false);
    }
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
                  Almost there,<br />
                  <span className="text-green-400">set your city.</span>
                </h2>
                <p className="mt-4 max-w-md text-base sm:text-lg text-green-100/60">
                  Tell us your city so we can send you accurate hourly weather forecasts via Telegram.
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Accurate local forecasts',
                  'Customized weather alerts',
                  'Seamless Telegram integration',
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
                <div className="mb-6 flex h-14 w-14 mx-auto sm:mx-0 items-center justify-center rounded-2xl bg-green-500/20 text-2xl ring-1 ring-green-500/30 text-green-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-white">Set your location</h1>
                <p className="mt-2 text-sm text-gray-400">
                  We'll use this city for your hourly alerts
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">City name</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="e.g. London, Tokyo"
                    className="w-full rounded-xl border-2 border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder-gray-500 transition focus:border-green-500 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !city.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white shadow-lg shadow-green-500/25 transition hover:bg-green-600 disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    'Complete setup'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
