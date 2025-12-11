import { useState } from 'react';
import { MessageCircle, Phone, Clock, Heart, Brain, Camera, AlertCircle, Lightbulb, Mic } from 'lucide-react';
import { VoiceInput } from '../VoiceInput';
import { TalkingAvatar } from '../TalkingAvatar';
import { MemoryMatch } from '../games/MemoryMatch';
import { speak } from '../../utils/textToSpeech';
import { getAIResponse } from '../../utils/aiResponse';

interface SeniorDashboardProps {
  avatar: any;
  userName: string;
  language?: string;
}

const moodColors: { [key: string]: string } = {
  stress: '#3b82f6',
  happy: '#fbbf24',
  sad: '#a855f7',
  excited: '#ec4899'
};

export function SeniorDashboard({ avatar, userName, language = 'English' }: SeniorDashboardProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [lampColor, setLampColor] = useState('#fbbf24');
  const [isBuddyTalking, setIsBuddyTalking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'buddy', text: string }[]>([
    { sender: 'buddy', text: `Good day, dear ${userName}. How are you feeling today? I'm here to keep you company.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const features = [
    { id: 'chat', name: 'Chat with Buddy', icon: <MessageCircle className="w-8 h-8" />, color: 'from-blue-400 to-blue-500' },
    { id: 'memories', name: 'Share Memories', icon: <Camera className="w-8 h-8" />, color: 'from-purple-400 to-purple-500' },
    { id: 'reminders', name: 'Reminders', icon: <Clock className="w-8 h-8" />, color: 'from-green-400 to-green-500' },
    { id: 'health', name: 'Health Monitor', icon: <Heart className="w-8 h-8" />, color: 'from-pink-400 to-pink-500' },
    { id: 'games', name: 'Brain Games', icon: <Brain className="w-8 h-8" />, color: 'from-yellow-400 to-yellow-500' },
    { id: 'lamp', name: 'Mood Lamp', icon: <Lightbulb className="w-8 h-8" />, color: 'from-orange-400 to-orange-500' },
  ];

  const reminders = [
    { time: '08:00 AM', task: 'Blood pressure medicine', type: 'medicine' },
    { time: '12:30 PM', task: 'Lunch time', type: 'meal' },
    { time: '03:00 PM', task: 'Doctor appointment - Dr. Smith', type: 'appointment' },
    { time: '08:00 PM', task: 'Evening medicine', type: 'medicine' }
  ];

  const healthData = [
    { label: 'Blood Pressure', value: '120/80', status: 'good', icon: '💓' },
    { label: 'Heart Rate', value: '72 bpm', status: 'good', icon: '❤️' },
    { label: 'Blood Sugar', value: '95 mg/dL', status: 'good', icon: '🩸' },
    { label: 'Oxygen Level', value: '98%', status: 'good', icon: '🫁' },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { sender: 'user', text: inputMessage }]);
    
    // Generate intelligent response for seniors
    const responseText = getAIResponse(inputMessage, 'seniors');

    setInputMessage('');
    
    setTimeout(() => {
      setIsBuddyTalking(true);
      speak(responseText, 'senior'); // TTS Trigger

      setMessages(prev => [...prev, { 
        sender: 'buddy', 
        text: responseText
      }]);

      setTimeout(() => {
        setIsBuddyTalking(false);
      }, responseText.length * 60 + 1000);
      
    }, 1000);
  };

  const handleSOS = () => {
    alert('SOS Alert Sent! Emergency contact has been notified.');
  };

  if (!selectedFeature && !showVoiceModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 p-6 relative">
        {/* Floating Action Button for Voice */}
        <button
          onClick={() => setShowVoiceModal(true)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:scale-105 transition-transform"
        >
          <Mic className="w-10 h-10" />
        </button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header with SOS Button - Simplified */}
          <div className="flex items-center justify-between">
            <div className="bg-white rounded-2xl p-6 shadow-lg flex-1 mr-4">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 flex items-center justify-center bg-amber-100 rounded-full text-4xl">
                  {avatar.emoji}
                </div>
                <div className="flex-1">
                  <h2 className="text-slate-800 mb-1">{avatar.name}</h2>
                  <p className="text-gray-600 text-lg">Good day, {userName}!</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSOS}
              className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center"
            >
              <AlertCircle className="w-12 h-12 mb-2" />
              <span className="text-lg">SOS</span>
            </button>
          </div>

          {/* Mood Lamp */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2 text-xl">
              <Lightbulb className="w-7 h-7 text-orange-500" />
              Smart Mood Lamp
            </h3>
            <div className="flex items-center gap-6">
              <div
                className="w-32 h-32 rounded-full shadow-2xl transition-all duration-500"
                style={{ backgroundColor: lampColor, boxShadow: `0 0 60px ${lampColor}` }}
              />
              <div className="flex-1 space-y-3">
                <p className="text-gray-600">Select your mood:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Calm (Blue)', color: moodColors.stress, emoji: '🧘' },
                    { name: 'Happy (Yellow)', color: moodColors.happy, emoji: '😊' },
                    { name: 'Relaxed (Purple)', color: moodColors.sad, emoji: '😌' },
                    { name: 'Energetic (Pink)', color: moodColors.excited, emoji: '✨' }
                  ].map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLampColor(mood.color)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        lampColor === mood.color ? 'border-slate-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mr-2">{mood.emoji}</span>
                      <span className="text-sm">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reminders */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2 text-xl">
              <Clock className="w-7 h-7 text-green-500" />
              Today{"'"}s Reminders
            </h3>
            <div className="space-y-3">
              {reminders.map((reminder, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-xl ${
                    reminder.type === 'medicine' ? 'bg-blue-50 border-2 border-blue-200' :
                    reminder.type === 'appointment' ? 'bg-purple-50 border-2 border-purple-200' :
                    'bg-green-50 border-2 border-green-200'
                  }`}
                >
                  <div className="text-3xl">
                    {reminder.type === 'medicine' ? '💊' : reminder.type === 'appointment' ? '👨‍⚕️' : '🍽️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-800">{reminder.task}</p>
                    <p className="text-sm text-gray-500">{reminder.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-sm">
                    Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2 text-xl">
              <Heart className="w-7 h-7 text-pink-500" />
              Health Monitor
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthData.map((metric, idx) => (
                <div key={idx} className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                  <div className="text-4xl mb-2">{metric.icon}</div>
                  <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                  <p className="text-lg text-gray-800">{metric.value}</p>
                  <span className="text-xs text-green-600">✓ Normal</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className="group relative p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}></div>
                <div className="relative space-y-3">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <p className="text-center text-lg">{feature.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 p-6">
      {/* Voice Interaction Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowVoiceModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
            <div className="text-center space-y-6">
              <h3 className="text-xl font-semibold text-slate-800">Speak with {avatar.name}</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-b from-amber-50 to-green-50 rounded-2xl">
                <TalkingAvatar avatar={avatar} isTalking={isBuddyTalking} />
              </div>
              <div className="p-4 border-2 border-amber-100 rounded-2xl bg-amber-50/50">
                 <p className="text-gray-600 text-lg mb-2">{isBuddyTalking ? 'Speaking...' : 'Listening...'}</p>
                 <VoiceInput 
                    onTranscript={(text) => {
                      setInputMessage(text);
                      handleSendMessage();
                    }} 
                    language={language} 
                  />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedFeature(null)}
          className="px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-lg"
        >
          ← Back to Home
        </button>

        {selectedFeature === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white">
              <h3 className="text-xl">Chat with {avatar.name}</h3>
              <p className="text-sm opacity-90">Your companion is always here to listen</p>
            </div>
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-5 py-4 rounded-2xl text-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Share your thoughts..."
                className="flex-1 px-4 py-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <VoiceInput onTranscript={setInputMessage} language={language} />
              <button
                onClick={handleSendMessage}
                className="px-8 py-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all text-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {selectedFeature === 'memories' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6 text-xl">Share Your Memories</h3>
            <div className="space-y-4">
              <textarea
                placeholder="Tell me about a special memory..."
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
              <button className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-lg">
                Save Memory
              </button>
              <div className="mt-6 space-y-3">
                <h4 className="text-slate-800 text-lg">Recent Memories</h4>
                {[
                  { date: 'Yesterday', memory: 'Tea time with old friends from the neighborhood' },
                  { date: '3 days ago', memory: "Grandchildren's visit - wonderful afternoon!" },
                  { date: 'Last week', memory: 'Beautiful walk in the park, saw lovely flowers' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-600 mb-1">{item.date}</p>
                    <p className="text-gray-700">{item.memory}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'games' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-slate-800 mb-6 text-xl">Daily Brain Training</h3>
              <MemoryMatch category="seniors" />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-slate-800 mb-6 text-xl">More Brain Exercise Games</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Word Puzzle', desc: 'Find hidden words', icon: '📝', color: 'green' },
                  { name: 'Number Game', desc: 'Simple arithmetic fun', icon: '🔢', color: 'yellow' },
                  { name: 'Picture Recall', desc: 'Remember what you saw', icon: '🖼️', color: 'purple' }
                ].map((game, idx) => (
                  <div key={idx} className={`p-6 bg-${game.color}-50 rounded-xl border-2 border-${game.color}-200 cursor-pointer hover:shadow-lg transition-all`}>
                    <div className="text-5xl mb-3">{game.icon}</div>
                    <h4 className="text-slate-800 text-lg mb-2">{game.name}</h4>
                    <p className="text-gray-600 mb-4">{game.desc}</p>
                    <button className={`w-full py-3 bg-gradient-to-r from-${game.color}-400 to-${game.color}-500 text-white rounded-xl text-lg`}>
                      Play Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'health' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6 text-xl">Detailed Health Report</h3>
            <div className="space-y-6">
              {healthData.map((metric, idx) => (
                <div key={idx} className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{metric.icon}</div>
                      <div>
                        <h4 className="text-slate-800 text-lg">{metric.label}</h4>
                        <p className="text-2xl text-gray-800">{metric.value}</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-green-500 text-white rounded-full">Normal</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Last updated: Just now
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === 'reminders' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6 text-xl">All Reminders</h3>
            <div className="space-y-3 mb-6">
              {reminders.map((reminder, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="text-4xl">
                    {reminder.type === 'medicine' ? '💊' : reminder.type === 'appointment' ? '👨‍⚕️' : '🍽️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-800">{reminder.task}</p>
                    <p className="text-gray-500">{reminder.time}</p>
                  </div>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Done
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:shadow-lg transition-all text-lg">
              + Add New Reminder
            </button>
          </div>
        )}

        {selectedFeature === 'lamp' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-slate-800 mb-6 text-xl text-center">Smart Mood Lamp Control</h3>
            <div className="flex flex-col items-center space-y-6">
              <div
                className="w-64 h-64 rounded-full shadow-2xl transition-all duration-500"
                style={{ backgroundColor: lampColor, boxShadow: `0 0 100px ${lampColor}` }}
              />
              <div className="w-full space-y-3">
                {[
                  { name: 'Calm Blue - For relaxation', color: moodColors.stress, emoji: '🧘' },
                  { name: 'Happy Yellow - For joy', color: moodColors.happy, emoji: '😊' },
                  { name: 'Peaceful Purple - For rest', color: moodColors.sad, emoji: '😌' },
                  { name: 'Energetic Pink - For vitality', color: moodColors.excited, emoji: '✨' }
                ].map((mood, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLampColor(mood.color)}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                      lampColor === mood.color ? 'border-slate-800 bg-gray-50 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-lg">{mood.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}