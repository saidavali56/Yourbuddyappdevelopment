import { useState } from 'react';
import { FaceRecognition } from './FaceRecognition';
import { Globe, Watch, User, Mail, Lock } from 'lucide-react';

interface RegistrationFormProps {
  ageGroup: string;
  onComplete: (data: any) => void;
}

const languages = [
  'English', 'Telugu', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Hindi', 'Arabic', 'Portuguese', 'Russian'
];

export function RegistrationForm({ ageGroup, onComplete }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    faceData: '',
    parentEmail: '',
    language: 'English',
    iotConnected: false
  });

  const requiresParent = ['6-12', '13-17', '18-20'].includes(ageGroup);
  const requiresFamilyAccount = ageGroup === 'senior';

  const handleFaceComplete = (faceData: string) => {
    setFormData({ ...formData, faceData });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  if (step === 1) {
    return <FaceRecognition onComplete={handleFaceComplete} mode="register" />;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-slate-800">Complete Your Profile</h3>
        <p className="text-gray-600">Fill in your details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <User className="w-4 h-4" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Lock className="w-4 h-4" />
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            required
          />
        </div>

        {requiresParent && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              Parent Account Email
            </label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>
        )}

        {requiresFamilyAccount && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4" />
              Family Member Email (Son/Daughter)
            </label>
            <input
              type="email"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <Globe className="w-4 h-4" />
            Preferred Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Watch className="w-5 h-5 text-blue-600" />
          <label className="flex-1 text-sm text-gray-700">
            Connect IoT Smartwatch
          </label>
          <input
            type="checkbox"
            checked={formData.iotConnected}
            onChange={(e) => setFormData({ ...formData, iotConnected: e.target.checked })}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
        >
          Continue to Avatar Creation
        </button>
      </form>
    </div>
  );
}
