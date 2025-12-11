import { useState } from 'react';
import { User, Save, TrendingUp, AlertCircle } from 'lucide-react';

interface ProfileSettingsProps {
  userData: any;
  onUpdate: (data: any) => void;
}

export function ProfileSettings({ userData, onUpdate }: ProfileSettingsProps) {
  const [name, setName] = useState(userData?.name || '');
  const [habits, setHabits] = useState(userData?.habits || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      await onUpdate({
        name,
        habits
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile.');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-800">My Profile & Habits</h3>
          <p className="text-sm text-gray-500">Manage your personal details</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2 ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <AlertCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">My Habits & Goals (For Long-term Memory)</label>
          <div className="relative">
            <textarea
              value={habits}
              onChange={(e) => setHabits(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              placeholder="e.g. I want to drink more water, run every morning, and read 1 book a month..."
            />
            <TrendingUp className="absolute right-4 bottom-4 w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Your Buddy will remember these details to help you stay on track.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
