import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Logo } from './components/Logo';
import { FaceRecognition } from './components/FaceRecognition';
import { AgeGroupSelector } from './components/AgeGroupSelector';
import { RegistrationForm } from './components/RegistrationForm';
import { AvatarCreator } from './components/AvatarCreator';
import { KidsDashboard } from './components/dashboards/KidsDashboard';
import { TeensDashboard } from './components/dashboards/TeensDashboard';
import { AdultDashboard } from './components/dashboards/AdultDashboard';
import { SeniorDashboard } from './components/dashboards/SeniorDashboard';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { LogIn, UserPlus } from 'lucide-react';

type AppState = 'landing' | 'login' | 'register' | 'age-select' | 'register-form' | 'avatar-create' | 'dashboard';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [avatarData, setAvatarData] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        loadUserData(session.access_token);
      }
    });
  }, []);

  const loadUserData = async (accessToken: string) => {
    try {
      // Fetch user profile
      const profileRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/profile`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      const profileData = await profileRes.json();

      // Fetch avatar
      const avatarRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/avatar`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      const avatarResData = await avatarRes.json();

      if (profileData.profile) {
        setUserData(profileData.profile);
        setSelectedAgeGroup(profileData.profile.ageGroup);
        
        if (avatarResData.avatar) {
          setAvatarData(avatarResData.avatar);
          setState('dashboard');
        } else {
          setState('avatar-create');
        }
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  const handleLogoClick = () => {
    if (state === 'landing') {
      setState('login');
    }
  };

  const handleFaceLogin = async (faceData: string) => {
    // In a real app, this would verify face data
    // For demo, we'll show a login form
    setError('Please use email/password login for this demo');
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setSession(data.session);
        await loadUserData(data.session.access_token);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
    
    setLoading(false);
  };

  const handleAgeGroupSelect = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
    setState('register-form');
  };

  const handleRegistrationComplete = async (formData: any) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            ageGroup: selectedAgeGroup,
            parentEmail: formData.parentEmail,
            language: formData.language
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto login after registration
      await handleLogin(formData.email, formData.password);
      
      setUserData({
        name: formData.name,
        email: formData.email,
        ageGroup: selectedAgeGroup,
        language: formData.language
      });

      // If IoT connected, save connection
      if (formData.iotConnected) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/iot-connect`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                deviceId: 'smartwatch_' + Date.now(),
                deviceType: 'smartwatch'
              })
            }
          );
        }
      }

      setState('avatar-create');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    }

    setLoading(false);
  };

  const handleAvatarComplete = async (avatar: any) => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Session expired. Please login again.');
        setState('login');
        return;
      }

      // Map avatar character to emoji
      const characterEmojis: { [key: string]: string } = {
        'Friendly Robot': '🤖',
        'Happy Bear': '🐻',
        'Cute Cat': '🐱',
        'Wise Owl': '🦉',
        'Playful Dog': '🐶',
        'Magic Unicorn': '🦄'
      };

      const avatarWithEmoji = {
        ...avatar,
        emoji: characterEmojis[avatar.character] || '🤖',
        name: avatar.name
      };

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/avatar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            avatarData: avatarWithEmoji,
            avatarName: avatar.name
          })
        }
      );

      setAvatarData(avatarWithEmoji);
      setState('dashboard');
    } catch (err: any) {
      console.error('Avatar save error:', err);
      setError(err.message || 'Failed to save avatar');
    }

    setLoading(false);
  };

  const updateProfile = async (updates: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c520032d/profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(updates)
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUserData(data.profile);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserData(null);
    setAvatarData(null);
    setState('landing');
  };

  // Landing Page
  if (state === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
        <div className="text-center space-y-8">
          <div className="animate-bounce">
            <Logo onClick={handleLogoClick} size="large" />
          </div>
          <div className="space-y-4 text-white">
            <h2 className="text-4xl">Welcome to YOUR BUDDY</h2>
            <p className="text-xl opacity-90">Your AI companion for every stage of life</p>
            <p className="text-lg opacity-75">Click the logo to get started</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setState('login')}
              className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
            >
              <LogIn className="w-5 h-5" />
              Login
            </button>
            <button
              onClick={() => { setAuthMode('register'); setState('age-select'); }}
              className="flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-2xl hover:bg-white/30 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login Page
  if (state === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-md mx-auto pt-12 space-y-8">
          <div className="text-center">
            <Logo size="large" />
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
            <h2 className="text-slate-800 text-center">Welcome Back</h2>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <LoginForm onSubmit={handleLogin} loading={loading} />

            <div className="text-center">
              <button
                onClick={() => { setAuthMode('register'); setState('age-select'); }}
                className="text-primary hover:underline"
              >
                Don{"'"}t have an account? Sign up
              </button>
            </div>
          </div>

          <button
            onClick={() => setState('landing')}
            className="w-full py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Age Group Selection
  if (state === 'age-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto pt-12 space-y-8">
          <div className="text-center">
            <Logo size="large" />
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <AgeGroupSelector onSelect={handleAgeGroupSelect} />
          </div>

          <button
            onClick={() => setState('landing')}
            className="w-full max-w-xs mx-auto block py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Registration Form
  if (state === 'register-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto pt-12 space-y-8">
          <div className="text-center">
            <Logo size="small" />
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            <RegistrationForm
              ageGroup={selectedAgeGroup}
              onComplete={handleRegistrationComplete}
            />
          </div>

          <button
            onClick={() => setState('age-select')}
            className="w-full max-w-xs mx-auto block py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Avatar Creation
  if (state === 'avatar-create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto pt-12 space-y-8">
          <div className="text-center">
            <Logo size="small" />
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <AvatarCreator
              ageGroup={selectedAgeGroup}
              onComplete={handleAvatarComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  if (state === 'dashboard' && userData && avatarData) {
    return (
      <>
        {/* Logout Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Logout
          </button>
        </div>

        {/* Age-specific Dashboard */}
        {selectedAgeGroup === '6-12' && (
          <KidsDashboard 
            avatar={avatarData} 
            userName={userData.name} 
            language={userData.language || 'English'}
          />
        )}
        {selectedAgeGroup === '13-17' && (
          <TeensDashboard 
            avatar={avatarData} 
            userName={userData.name} 
            language={userData.language || 'English'}
          />
        )}
        {(selectedAgeGroup === '18-20' || selectedAgeGroup === '21-40') && (
          <AdultDashboard 
            avatar={avatarData} 
            userName={userData.name} 
            language={userData.language || 'English'}
            userData={userData}
            onUpdateProfile={updateProfile}
          />
        )}
        {selectedAgeGroup === 'senior' && (
          <SeniorDashboard 
            avatar={avatarData} 
            userName={userData.name} 
            language={userData.language || 'English'}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
}

function LoginForm({ onSubmit, loading }: { onSubmit: (email: string, password: string) => void, loading: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl transition-all ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}