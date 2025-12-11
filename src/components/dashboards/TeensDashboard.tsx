import { useState } from 'react';
import { MessageCircle, Calendar, BookOpen, Target, Shield, Trophy, Brain, Heart, Mic } from 'lucide-react';
import { VoiceInput } from '../VoiceInput';
import { TalkingAvatar } from '../TalkingAvatar';
import { speak } from '../../utils/textToSpeech';
import { getAIResponse } from '../../utils/aiResponse';

interface TeensDashboardProps {
  avatar: any;
  userName: string;
  language?: string;
}

const features = [
  { id: 'chat', name: 'Talk to Buddy', icon: <MessageCircle className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
  { id: 'study', name: 'Study Planner', icon: <Calendar className="w-6 h-6" />, color: 'from-purple-500 to-purple-600' },
  { id: 'academic', name: 'Academic Help', icon: <BookOpen className="w-6 h-6" />, color: 'from-green-500 to-green-600' },
  { id: 'goals', name: 'My Goals', icon: <Target className="w-6 h-6" />, color: 'from-orange-500 to-orange-600' },
  { id: 'safety', name: 'Safety Guide', icon: <Shield className="w-6 h-6" />, color: 'from-red-500 to-red-600' },
  { id: 'motivation', name: 'Motivation', icon: <Trophy className="w-6 h-6" />, color: 'from-yellow-500 to-yellow-600' },
];

export function TeensDashboard({ avatar, userName, language = 'English' }: TeensDashboardProps) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [mood, setMood] = useState<string>('');
  const [isBuddyTalking, setIsBuddyTalking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'buddy', text: string }[]>([
    { sender: 'buddy', text: `Hey ${userName}! How's your day going? I'm here if you want to talk about anything.` }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const studyTopics = [
    { subject: 'Mathematics', nextTest: 'Dec 15', progress: 75 },
    { subject: 'Science', nextTest: 'Dec 18', progress: 60 },
    { subject: 'English', nextTest: 'Dec 20', progress: 85 },
    { subject: 'History', nextTest: 'Dec 22', progress: 70 },
  ];

  const motivationalQuotes = [
    "You're capable of amazing things! Keep pushing forward! 💪",
    "Every expert was once a beginner. Keep learning!",
    "Believe in yourself - you've got this! ⭐",
    "Your hard work will pay off. Stay focused!"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setMessages([...messages, { sender: 'user', text: inputMessage }]);
    
    // Generate intelligent response for teens
    const responseText = getAIResponse(inputMessage, 'teens');

    setInputMessage('');
    
    setTimeout(() => {
      setIsBuddyTalking(true);
      speak(responseText, '13-17'); // TTS Trigger

      setMessages(prev => [...prev, { 
        sender: 'buddy', 
        text: responseText
      }]);

      setTimeout(() => {
        setIsBuddyTalking(false);
      }, responseText.length * 60 + 1000);
      
    }, 1000);
  };

  if (!selectedFeature && !showVoiceModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 relative">
        {/* Floating Action Button for Voice */}
        <button
          onClick={() => setShowVoiceModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:scale-110 transition-transform"
        >
          <Mic className="w-8 h-8" />
        </button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header - Simplified */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full text-3xl">
                {avatar.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-slate-800 mb-1">{avatar.name}</h2>
                <p className="text-gray-600">Hey {userName}! How are you feeling today?</p>
              </div>
            </div>
          </div>

          {/* Mood Check */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              How are you feeling?
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {['😊', '😐', '😔', '😤', '😰'].map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => setMood(emoji)}
                  className={`py-4 text-4xl bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors ${
                    mood === emoji ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Study Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-500" />
              Study Progress
            </h3>
            <div className="space-y-4">
              {studyTopics.map((topic, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{topic.subject}</span>
                    <span className="text-gray-500">Next test: {topic.nextTest}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500">{topic.progress}% complete</div>
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
                className="group relative p-6 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}></div>
                <div className="relative space-y-3">
                  <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <p className="text-center text-sm">{feature.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
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
              <h3 className="text-xl font-semibold text-slate-800">Chat with {avatar.name}</h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-b from-purple-50 to-pink-50 rounded-2xl">
                <TalkingAvatar avatar={avatar} isTalking={isBuddyTalking} />
              </div>
              <div className="p-4 border-2 border-purple-100 rounded-2xl bg-purple-50/50">
                 <p className="text-gray-600 text-sm mb-2">{isBuddyTalking ? 'Speaking...' : 'Listening...'}</p>
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
          className="px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        >
          ← Back
        </button>

        {selectedFeature === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3>Chat with {avatar.name}</h3>
              <p className="text-sm opacity-90">I{"'"}m here to listen and support you</p>
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
                        ? 'bg-purple-500 text-white'
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
                placeholder="Share what's on your mind..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
              <VoiceInput onTranscript={setInputMessage} language={language} />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {selectedFeature === 'study' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Study Timetable</h3>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                <div key={idx} className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-slate-800">{day}</h4>
                    <span className="text-xs text-gray-500">3 subjects</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Math</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Science</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">English</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === 'academic' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Academic Support</h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Brain className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="text-slate-800 mb-2">Ask a Question</h4>
                <p className="text-sm text-gray-600 mb-4">Get help with any subject</p>
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Math Help', 'Science Notes', 'Essay Writing', 'Test Prep'].map((tool, idx) => (
                  <button key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm">
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'goals' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Your Goals</h3>
            <div className="space-y-4">
              {[
                { goal: 'Improve Math Grade', progress: 70, deadline: 'End of term' },
                { goal: 'Read 5 Books', progress: 40, deadline: 'This month' },
                { goal: 'Learn Guitar', progress: 25, deadline: 'This year' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 border-2 border-gray-200 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-slate-800">{item.goal}</h4>
                    <span className="text-xs text-gray-500">{item.deadline}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">{item.progress}%</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === 'safety' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Safety & Wellness Guide</h3>
            <div className="space-y-4">
              {[
                { title: "Online Safety", desc: "Protect your privacy and stay safe online", color: "blue" },
                { title: "Healthy Relationships", desc: "Understand boundaries and respect", color: "pink" },
                { title: "Dealing with Stress", desc: "Manage pressure and stay balanced", color: "green" },
                { title: "When to Ask for Help", desc: "It's okay to reach out to trusted adults", color: "purple" }
              ].map((item, idx) => (
                <div key={idx} className={`p-4 bg-${item.color}-50 border-2 border-${item.color}-200 rounded-xl`}>
                  <h4 className="text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === 'motivation' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">Daily Motivation</h3>
            <div className="space-y-4">
              {motivationalQuotes.map((quote, idx) => (
                <div key={idx} className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <Trophy className="w-8 h-8 text-yellow-600 mb-3" />
                  <p className="text-gray-800">{quote}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}