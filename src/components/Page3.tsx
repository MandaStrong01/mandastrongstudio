import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Page3Props {
  onNext: () => void;
  onBack: () => void;
  onNavigate: (page: number) => void;
}

export default function Page3({ onNext, onBack }: Page3Props) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'studio'>('studio');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setMessage(`Login failed: ${error.message}`);
    } else {
      setMessage('Login successful! Redirecting to payment...');
      await updateUserPlan(data.user.id, selectedPlan);
      setTimeout(() => onNext(), 1500);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating account...');

    const { data, error } = await supabase.auth.signUp({
      email: registerEmail,
      password: registerPassword,
      options: {
        data: {
          name: registerName,
          plan: selectedPlan,
        }
      }
    });

    if (error) {
      setMessage(`Registration failed: ${error.message}`);
    } else {
      setMessage('Account created! Redirecting to payment...');
      if (data.user) {
        await updateUserPlan(data.user.id, selectedPlan);
      }
      setTimeout(() => onNext(), 1500);
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: plan,
        status: 'active',
        updated_at: new Date().toISOString()
      });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-6xl w-full space-y-6">
          {message && (
            <div className="bg-purple-600 text-white text-center py-3 px-6 rounded-lg font-semibold">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500 text-white p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-400 rounded-lg focus:outline-none focus:border-purple-300 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-400 rounded-lg focus:outline-none focus:border-purple-300 text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition-all hover:scale-105"
                >
                  Login
                </button>
              </form>
            </div>

            <div className="bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500 text-white p-8 rounded-xl">
              <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-400 rounded-lg focus:outline-none focus:border-purple-300 text-white"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-400 rounded-lg focus:outline-none focus:border-purple-300 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-purple-400 rounded-lg focus:outline-none focus:border-purple-300 text-white"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold transition-all hover:scale-105"
                >
                  Register & Choose Plan
                </button>
              </form>
            </div>
          </div>

          <div className="bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500 text-white p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setSelectedPlan('basic')}
                className={`cursor-pointer bg-black/50 border-2 p-6 rounded-xl hover:border-purple-300 transition-all ${selectedPlan === 'basic' ? 'border-purple-300 shadow-lg shadow-purple-300/50' : 'border-purple-400'}`}
              >
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <p className="text-3xl font-bold text-purple-300 mb-4">$20<span className="text-sm">/mo</span></p>
                <ul className="space-y-2 text-sm mb-6">
                  <li>✓ HD Export</li>
                  <li>✓ 100 AI Tools</li>
                  <li>✓ Basic Templates</li>
                  <li>✓ 10GB Storage</li>
                  <li>✓ Email Support</li>
                </ul>
                {selectedPlan === 'basic' && <div className="text-purple-300 font-bold text-center">✓ SELECTED</div>}
              </div>

              <div
                onClick={() => setSelectedPlan('pro')}
                className={`cursor-pointer bg-black/50 border-2 p-6 rounded-xl hover:border-purple-200 transition-all transform scale-105 ${selectedPlan === 'pro' ? 'border-purple-300 shadow-lg shadow-purple-300/50' : 'border-purple-300'}`}
              >
                <div className="bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-2">POPULAR</div>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <p className="text-3xl font-bold text-purple-300 mb-4">$30<span className="text-sm">/mo</span></p>
                <ul className="space-y-2 text-sm mb-6">
                  <li>✓ 4K Export</li>
                  <li>✓ 300 AI Tools</li>
                  <li>✓ Premium Templates</li>
                  <li>✓ 100GB Storage</li>
                  <li>✓ Priority Support</li>
                  <li>✓ Commercial License</li>
                </ul>
                {selectedPlan === 'pro' && <div className="text-purple-300 font-bold text-center">✓ SELECTED</div>}
              </div>

              <div
                onClick={() => setSelectedPlan('studio')}
                className={`cursor-pointer bg-black/50 border-2 p-6 rounded-xl hover:border-purple-300 transition-all ${selectedPlan === 'studio' ? 'border-purple-300 shadow-lg shadow-purple-300/50' : 'border-purple-400'}`}
              >
                <h3 className="text-xl font-bold mb-2">Studio</h3>
                <p className="text-3xl font-bold text-purple-300 mb-4">$50<span className="text-sm">/mo</span></p>
                <ul className="space-y-2 text-sm mb-6">
                  <li>✓ 8K Export</li>
                  <li>✓ All 600 AI Tools</li>
                  <li>✓ Unlimited Templates</li>
                  <li>✓ 1TB Storage</li>
                  <li>✓ 24/7 Live Support</li>
                  <li>✓ Full Commercial Rights</li>
                  <li>✓ Team Collaboration</li>
                </ul>
                {selectedPlan === 'studio' && <div className="text-purple-300 font-bold text-center">✓ SELECTED</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-purple-500 transition-all hover:scale-105"
          >
            Continue
          </button>
        </div>

        <footer className="border-t-2 border-purple-500 pt-6 mt-8">
          <p className="text-white text-sm text-center">
            MandaStrong1 2025 ~ Author Of Doxy The School Bully ~ Also Find Me On MandaStrong1.Etsy.com
          </p>
        </footer>
      </div>
    </div>
  );
}
