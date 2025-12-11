import { useState } from 'react';
import { Palette, Heart, Smile, Star, Sparkles } from 'lucide-react';

interface AvatarCreatorProps {
  ageGroup: string;
  onComplete: (avatarData: any) => void;
}

const colors = [
  { name: 'Red', value: '#ef4444', gradient: 'from-red-400 to-red-600' },
  { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Green', value: '#10b981', gradient: 'from-green-400 to-green-600' },
  { name: 'Purple', value: '#a855f7', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Pink', value: '#ec4899', gradient: 'from-pink-400 to-pink-600' },
  { name: 'Yellow', value: '#f59e0b', gradient: 'from-yellow-400 to-yellow-600' },
];

const cartoons = [
  { name: 'Friendly Robot', emoji: '🤖' },
  { name: 'Happy Bear', emoji: '🐻' },
  { name: 'Cute Cat', emoji: '🐱' },
  { name: 'Wise Owl', emoji: '🦉' },
  { name: 'Playful Dog', emoji: '🐶' },
  { name: 'Magic Unicorn', emoji: '🦄' },
];

const personalities = [
  { name: 'Cheerful', icon: <Smile className="w-6 h-6" /> },
  { name: 'Wise', icon: <Star className="w-6 h-6" /> },
  { name: 'Adventurous', icon: <Sparkles className="w-6 h-6" /> },
  { name: 'Caring', icon: <Heart className="w-6 h-6" /> },
];

const suggestedNames = [
  'Buddy', 'Sparkle', 'Sunny', 'Luna', 'Max', 'Sage', 'Joy', 'Star', 'Nova', 'Echo'
];

export function AvatarCreator({ ageGroup, onComplete }: AvatarCreatorProps) {
  const [step, setStep] = useState(1);
  const [avatarData, setAvatarData] = useState({
    favoriteColor: '',
    character: '',
    personality: '',
    name: ''
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(avatarData);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return avatarData.favoriteColor !== '';
      case 2: return avatarData.character !== '';
      case 3: return avatarData.personality !== '';
      case 4: return avatarData.name !== '';
      default: return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Creating Your Buddy</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Favorite Color */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Palette className="w-16 h-16 mx-auto text-primary" />
            <h3 className="text-slate-800">What{"'"}s Your Favorite Color?</h3>
            <p className="text-gray-600">Choose a color that represents you</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setAvatarData({ ...avatarData, favoriteColor: color.name })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  avatarData.favoriteColor === color.name
                    ? 'border-slate-800 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${color.gradient} rounded-full mb-3`}></div>
                <p className="text-sm text-center">{color.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Character */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Smile className="w-16 h-16 mx-auto text-primary" />
            <h3 className="text-slate-800">Choose Your Buddy Character</h3>
            <p className="text-gray-600">Pick a character you{"'"}d like as your friend</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cartoons.map((cartoon) => (
              <button
                key={cartoon.name}
                onClick={() => setAvatarData({ ...avatarData, character: cartoon.name })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  avatarData.character === cartoon.name
                    ? 'border-slate-800 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-6xl mb-3">{cartoon.emoji}</div>
                <p className="text-sm text-center">{cartoon.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Personality */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Star className="w-16 h-16 mx-auto text-primary" />
            <h3 className="text-slate-800">Choose Personality Type</h3>
            <p className="text-gray-600">How should your buddy behave?</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {personalities.map((personality) => (
              <button
                key={personality.name}
                onClick={() => setAvatarData({ ...avatarData, personality: personality.name })}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  avatarData.personality === personality.name
                    ? 'border-slate-800 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-primary mb-3 flex justify-center">{personality.icon}</div>
                <p className="text-center">{personality.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Name */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <Sparkles className="w-16 h-16 mx-auto text-primary" />
            <h3 className="text-slate-800">Name Your Buddy</h3>
            <p className="text-gray-600">Give your friend a special name</p>
          </div>

          {/* Preview */}
          <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-dashed border-primary/30">
            <div className="text-center space-y-4">
              <div className="text-8xl">
                {cartoons.find(c => c.name === avatarData.character)?.emoji || '🤖'}
              </div>
              <div className={`inline-block px-4 py-2 bg-gradient-to-r ${
                colors.find(c => c.name === avatarData.favoriteColor)?.gradient || 'from-blue-400 to-blue-600'
              } text-white rounded-full`}>
                {avatarData.personality}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-700">Buddy Name</label>
            <input
              type="text"
              value={avatarData.name}
              onChange={(e) => setAvatarData({ ...avatarData, name: e.target.value })}
              placeholder="Enter a name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">Suggested names:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => setAvatarData({ ...avatarData, name })}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-3 rounded-xl transition-all ${
            canProceed()
              ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 4 ? 'Create My Buddy' : 'Next'}
        </button>
      </div>
    </div>
  );
}
