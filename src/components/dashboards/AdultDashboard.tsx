import { useState } from "react";
import {
  MessageCircle,
  Briefcase,
  Target,
  Heart,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  Globe,
  Mic,
  User,
} from "lucide-react";
import { VoiceInput } from "../VoiceInput";
import { TalkingAvatar } from "../TalkingAvatar";
import { getTranslation } from "../../utils/translations";
import { speak } from "../../utils/textToSpeech";
import { getAIResponse } from "../../utils/aiResponse";
import { MathPuzzle } from "../games/MathPuzzle";
import { ProfileSettings } from "./adult/ProfileSettings";

interface AdultDashboardProps {
  avatar: any;
  userName: string;
  language?: string;
  userData?: any;
  onUpdateProfile?: (data: any) => void;
}

const features = [
  {
    id: "chat",
    key: "emotionalSupport",
    icon: <MessageCircle className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "math",
    key: "brainTraining",
    icon: <Activity className="w-6 h-6" />,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "profile",
    key: "myProfile",
    icon: <User className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600",
  }, // Added Profile
  {
    id: "career",
    key: "careerGrowth",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "goals",
    key: "lifeGoals",
    icon: <Target className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
  },
  {
    id: "wellness",
    key: "wellness",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-pink-600",
  },
];

export function AdultDashboard({
  avatar,
  userName,
  language = "English",
  userData,
  onUpdateProfile,
}: AdultDashboardProps) {
  const [currentLang, setCurrentLang] = useState(language);
  const [selectedFeature, setSelectedFeature] = useState<
    string | null
  >(null);
  const [isBuddyTalking, setIsBuddyTalking] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false); // New voice modal state
  const [messages, setMessages] = useState<
    { sender: "user" | "buddy"; text: string }[]
  >([
    {
      sender: "buddy",
      text: getTranslation(language, "buddyGreeting", {
        name: userName,
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const healthMetrics = [
    {
      label: getTranslation(currentLang, "heartRate"),
      value: "72 bpm",
      status: "good",
      icon: "💓",
    },
    {
      label: getTranslation(currentLang, "steps"),
      value: "8,421",
      status: "good",
      icon: "👟",
    },
    {
      label: getTranslation(currentLang, "sleep"),
      value: "7h 15m",
      status: "medium",
      icon: "😴",
    },
    {
      label: getTranslation(currentLang, "stress"),
      value: "Moderate",
      status: "medium",
      icon: "🧘",
    },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages([
      ...messages,
      { sender: "user", text: inputMessage },
    ]);

    // Generate intelligent response based on user input
    const responseText = getAIResponse(inputMessage, "adults");

    setInputMessage("");

    setTimeout(() => {
      setIsBuddyTalking(true);
      speak(responseText, "adult"); // TTS Trigger

      setMessages((prev) => [
        ...prev,
        {
          sender: "buddy",
          text: responseText,
        },
      ]);

      setTimeout(
        () => {
          setIsBuddyTalking(false);
        },
        responseText.length * 60 + 1000,
      );
    }, 1000);
  };

  const t = (key: string) => getTranslation(currentLang, key);

  if (!selectedFeature && !showVoiceModal) {
    // Hide if voice modal is open
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6 relative">
        {/* Floating Action Button for Voice */}
        <button
          onClick={() => setShowVoiceModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white z-50 hover:scale-110 transition-transform"
        >
          <Mic className="w-8 h-8" />
        </button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header - Removed Big Avatar, Simplified */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-6">
              {/* Small profile pic instead of large talking avatar */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                {avatar.emoji}
              </div>
              <div className="flex-1">
                <h2 className="text-slate-800 mb-1">
                  {t("welcome")} {userName}
                </h2>
                <p className="text-gray-600 text-sm">
                  Your personal growth companion
                </p>
              </div>
              <div className="text-right space-y-2">
                <button
                  onClick={() =>
                    setCurrentLang((prev) =>
                      prev === "English" ? "Telugu" : "English",
                    )
                  }
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors ml-auto"
                >
                  <Globe className="w-4 h-4" />
                  {currentLang}
                </button>
                <div>
                  <p className="text-sm text-gray-500">
                    {t("today")}
                  </p>
                  <p className="text-gray-700">
                    {new Date().toLocaleDateString(
                      currentLang === "Telugu"
                        ? "te-IN"
                        : "en-US",
                      {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              {t("healthWellness")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 ${
                    metric.status === "good"
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {metric.icon}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-gray-800">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="mb-4">{t("dailyCheckin")}</h3>
            <p className="mb-4 opacity-90">{t("howAreYou")}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                t("overwhelmed"),
                t("balanced"),
                t("energized"),
              ].map((mood, idx) => (
                <button
                  key={idx}
                  className="py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-all"
                >
                  {mood}
                </button>
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
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`}
                ></div>
                <div className="relative space-y-3">
                  <div
                    className={`w-14 h-14 mx-auto bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {feature.icon}
                  </div>
                  <p className="text-center text-sm">
                    {t(feature.key)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
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
              <h3 className="text-xl font-semibold text-slate-800">
                Talk to {avatar.name}
              </h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl">
                <TalkingAvatar
                  avatar={avatar}
                  isTalking={isBuddyTalking}
                  emotion="happy"
                />
              </div>
              <div className="p-4 border-2 border-blue-100 rounded-2xl bg-blue-50/50">
                <p className="text-gray-600 text-sm mb-2">
                  {isBuddyTalking
                    ? "Speaking..."
                    : "Listening..."}
                </p>
                <VoiceInput
                  onTranscript={(text) => {
                    setInputMessage(text);
                    handleSendMessage();
                  }}
                  language={currentLang}
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
          ← {t("back")}
        </button>

        {selectedFeature === "math" && (
          <MathPuzzle difficulty="medium" />
        )}

        {selectedFeature === "profile" &&
          userData &&
          onUpdateProfile && (
            <ProfileSettings
              userData={userData}
              onUpdate={onUpdateProfile}
            />
          )}

        {selectedFeature === "chat" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <h3>{t("chatTitle")}</h3>
              <p className="text-sm opacity-90">
                {t("chatSubtitle")}
              </p>
            </div>
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
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
                onChange={(e) =>
                  setInputMessage(e.target.value)
                }
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSendMessage()
                }
                placeholder={t("typeMessage")}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              <VoiceInput
                onTranscript={setInputMessage}
                language={currentLang}
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                {t("send")}
              </button>
            </div>
          </div>
        )}

        {selectedFeature === "career" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-slate-800 mb-6">
                Career Development
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Skill Assessment",
                    desc: "Identify your strengths and areas for growth",
                    icon: "📊",
                  },
                  {
                    title: "Career Pathways",
                    desc: "Explore opportunities aligned with your goals",
                    icon: "🎯",
                  },
                  {
                    title: "Learning Resources",
                    desc: "Curated courses and materials",
                    icon: "📚",
                  },
                  {
                    title: "Networking Tips",
                    desc: "Build meaningful professional connections",
                    icon: "🤝",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <div className="text-4xl">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-slate-800 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedFeature === "goals" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">
              Life Goals Tracker
            </h3>
            <div className="space-y-4">
              {[
                {
                  goal: "Switch to new career path",
                  progress: 45,
                  category: "Career",
                  deadline: "6 months",
                },
                {
                  goal: "Save for house down payment",
                  progress: 60,
                  category: "Finance",
                  deadline: "2 years",
                },
                {
                  goal: "Run a marathon",
                  progress: 30,
                  category: "Health",
                  deadline: "1 year",
                },
                {
                  goal: "Learn Spanish fluently",
                  progress: 50,
                  category: "Personal",
                  deadline: "1 year",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border-2 border-gray-200 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-slate-800">
                        {item.goal}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.deadline}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {item.progress}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === "wellness" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">
              Wellness & Self-Care
            </h3>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <Heart className="w-8 h-8 text-pink-600 mb-3" />
                <h4 className="text-slate-800 mb-2">
                  Today{"'"}s Self-Care
                </h4>
                <div className="space-y-2">
                  {[
                    { task: "Morning meditation", done: true },
                    { task: "30 min exercise", done: true },
                    { task: "Healthy lunch", done: false },
                    { task: "Evening walk", done: false },
                  ].map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 p-2"
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        className="w-5 h-5 text-pink-500 rounded"
                        readOnly
                      />
                      <span
                        className={
                          item.done
                            ? "line-through text-gray-500"
                            : "text-gray-700"
                        }
                      >
                        {item.task}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedFeature === "finance" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">
              Financial Wellness
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Budget Tracking",
                  desc: "Monitor your expenses and savings",
                  icon: "💰",
                  color: "yellow",
                },
                {
                  title: "Saving Goals",
                  desc: "Set and achieve financial targets",
                  icon: "🎯",
                  color: "green",
                },
                {
                  title: "Investment Basics",
                  desc: "Learn about growing your wealth",
                  icon: "📈",
                  color: "blue",
                },
                {
                  title: "Debt Management",
                  desc: "Strategies for financial freedom",
                  icon: "💳",
                  color: "purple",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 bg-${item.color}-50 rounded-xl`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFeature === "habits" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-slate-800 mb-6">
              Habit Tracker
            </h3>
            <div className="space-y-4">
              {[
                {
                  habit: "Morning workout",
                  streak: 12,
                  icon: "💪",
                },
                {
                  habit: "Read for 30 min",
                  streak: 8,
                  icon: "📖",
                },
                {
                  habit: "Drink 8 glasses of water",
                  streak: 15,
                  icon: "💧",
                },
                {
                  habit: "No social media after 9 PM",
                  streak: 5,
                  icon: "📱",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h4 className="text-slate-800">
                        {item.habit}
                      </h4>
                      <p className="text-sm text-orange-600">
                        {item.streak} day streak 🔥
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Log Today
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}