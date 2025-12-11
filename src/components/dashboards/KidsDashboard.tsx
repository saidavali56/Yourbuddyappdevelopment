import { useState } from 'react';
import { BookOpen, Gamepad2, Heart, Shield, Brain, MessageCircle, Activity, Mic } from 'lucide-react';
import { VoiceInput } from '../VoiceInput';
import { TalkingAvatar } from '../TalkingAvatar';
import { MemoryMatch } from '../games/MemoryMatch';
import { MathPuzzle } from '../games/MathPuzzle';
import { speak } from '../../utils/textToSpeech';
import { getAIResponse } from '../../utils/aiResponse';

interface KidsDashboardProps {
  avatar: any;
  userName: string;
  language?: string;
}

const activities = [
  { id: 'chat', name: 'Talk to Buddy', icon: <MessageCircle className="w-6 h-6" />, color: 'from-blue-400 to-blue-600' },
  { id: 'story', name: 'Story Time', icon: <BookOpen className="w-6 h-6" />, color: 'from-purple-400 to-purple-600' },
  { id: 'games', name: 'Mini Games', icon: <Gamepad2 className="w-6 h-6" />, color: 'from-green-400 to-green-600' },
  { id: 'learn', name: 'Learning Fun', icon: <Brain className="w-6 h-6" />, color: 'from-yellow-400 to-yellow-600' },
  { id: 'safety', name: 'Safety Tips', icon: <Shield className="w-6 h-6" />, color: 'from-red-400 to-red-600' },
  { id: 'kindness', name: 'Kindness Lessons', icon: <Heart className="w-6 h-6" />, color: 'from-pink-400 to-pink-600' },
];

export function KidsDashboard({ avatar, userName, language = 'English' }: KidsDashboardProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isBuddyTalking, setIsBuddyTalking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'buddy', text: string }[]>([
    { sender: 'buddy', text: `Hi ${userName}! How are you feeling today? 😊` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const greetings = [
    `Good morning, ${userName}! Ready for fun today?`,
    `Hey there, superstar! What adventure should we go on?`,
    `Hi ${userName}! I{"'"}m so happy to see you!`
  ];

  const stories = [
    {
      title: 'The Brave Little Star',
      content: 'Once upon a time, there was a little star who was afraid of shining too bright...',
      moral: 'Be confident in who you are!'
    },
    {
      title: 'The Friendly Forest',
      content: 'In a magical forest, all the animals learned to be kind to each other...',
      moral: 'Kindness makes everyone happy!'
    }
  ];

  const games = [
    { name: 'Memory Match', description: 'Match colorful cards!' },
    { name: 'Color the World', description: 'Creative coloring fun!' },
    { name: 'Math Adventure', description: 'Fun with numbers!' }
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { sender: 'user', text: inputMessage }]);
    
    // Generate intelligent response for kids
    const responseText = getAIResponse(inputMessage, 'kids');

    setInputMessage('');
    
    // Simulate buddy response
    setTimeout(() => {
      setIsBuddyTalking(true);
      speak(responseText, '6-12'); // TTS Trigger

      setMessages(prev => [...prev, { 
        sender: 'buddy', 
        text: responseText
      }]);

      setTimeout(() => {
        setIsBuddyTalking(false);
      }, responseText.length * 60 + 1000);
      
    }, 1000);
  };

  if (!selectedActivity && !showVoiceModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 p-6 relative">
         {/* Floating Action Button for Voice */}
        <button
          onClick={() => setShowVoiceModal(true)}
          className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:scale-110 transition-transform border-4 border-white"
        >
          <Mic className="w-10 h-10" />
        </button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header with Avatar - Simplified */}
          <div className="text-center space-y-4">
            <div className="inline-block p-6 bg-white rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 justify-center">
                 <div className="text-6xl">{avatar.emoji}</div>
                 <div className="text-left">
                    <h2 className="text-slate-800 text-2xl">{avatar.name}</h2>
                    <p className="text-gray-600">Your Fun Friend!</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-green-600" />
              <h3 className="text-slate-800">Today{"'"}s Health</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl">💚</p>
                <p className="text-xs text-gray-600">Heart</p>
                <p className="text-sm">Good</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl">👟</p>
                <p className="text-xs text-gray-600">Steps</p>
                <p className="text-sm">5,234</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl">😴</p>
                <p className="text-xs text-gray-600">Sleep</p>
                <p className="text-sm">9h 30m</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <p className="text-2xl">😊</p>
                <p className="text-xs text-gray-600">Mood</p>
                <p className="text-sm">Happy</p>
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                className="group relative p-6 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative space-y-3">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {activity.icon}
                  </div>
                  <p className="text-center text-sm">{activity.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Activity Views
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50 p-6">
      {/* Voice Interaction Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-300 border-4 border-yellow-200">
            <button 
              onClick={() => setShowVoiceModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              ✕
            </button>
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">Talk to {avatar.name}! 🎤</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50 rounded-3xl">
                <TalkingAvatar avatar={avatar} isTalking={isBuddyTalking} emotion="happy" />
              </div>
              <div className="p-4 border-4 border-yellow-100 rounded-3xl bg-yellow-50/50">
                 <p className="text-gray-600 font-medium mb-2">{isBuddyTalking ? 'Speaking...' : 'Listening...'}</p>
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
          onClick={() => setSelectedActivity(null)}
          className="px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ← Back to Home
        </button>

        {/* Chat Activity */}
        {selectedActivity === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              <h3>Chat with {avatar.name}</h3>
            </div>
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
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
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              <VoiceInput onTranscript={setInputMessage} language={language} />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Story Time */}
        {selectedActivity === 'story' && (
          <div className="space-y-4">
            {stories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-slate-800 mb-3">{story.title}</h3>
                <p className="text-gray-700 mb-4">{story.content}</p>
                <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <p className="text-sm text-purple-800">✨ Moral: {story.moral}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Games */}
        {selectedActivity === 'games' && (
          <div className="space-y-6">
            <MemoryMatch category="kids" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.slice(1).map((game, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className="text-6xl mb-3">🎮</div>
                  <h3 className="text-slate-800 mb-2">{game.name}</h3>
                  <p className="text-gray-600 text-sm">{game.description}</p>
                  <button className="mt-4 w-full py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl">
                    Play Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning */}
        {selectedActivity === 'learn' && (
          <div className="space-y-6">
            <MathPuzzle difficulty="easy" />
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-slate-800 mb-6">More Fun!</h3>
              <div className="grid grid-cols-2 gap-3">
                 {/* Existing simple number buttons could be kept or removed */}
              </div>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        {selectedActivity === 'safety' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Safety Rules 🛡️</h3>
            <div className="space-y-4">
              {[
                "Always tell a grown-up where you're going",
                "Don't talk to strangers alone",
                "Never share personal information online",
                "Stay with friends in public places"
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                  <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kindness Lessons */}
        {selectedActivity === 'kindness' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Kindness Makes the World Better 💖</h3>
            <div className="space-y-4">
              {[
                { title: "Share with Others", emoji: "🤝", desc: "Sharing toys and snacks makes friends happy!" },
                { title: "Say Nice Words", emoji: "💬", desc: "Compliments brighten someone's day!" },
                { title: "Help When You Can", emoji: "🙌", desc: "Helping others feels great!" },
                { title: "Be a Good Listener", emoji: "👂", desc: "Listen when friends want to talk!" }
              ].map((lesson, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-pink-50 rounded-xl">
                  <div className="text-4xl">{lesson.emoji}</div>
                  <div>
                    <h4 className="text-slate-800 mb-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}