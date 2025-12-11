export const translations: { [key: string]: { [key: string]: string } } = {
  English: {
    // General
    welcome: "Welcome",
    logout: "Logout",
    back: "Back",
    today: "Today",
    send: "Send",
    typeMessage: "Express yourself freely...",
    
    // Adult Dashboard
    emotionalSupport: "Emotional Support",
    careerGrowth: "Career Growth",
    lifeGoals: "Life Goals",
    wellness: "Wellness",
    financeTips: "Finance Tips",
    habitTracking: "Habit Tracking",
    
    dailyCheckin: "Daily Check-in",
    howAreYou: "How are you managing today?",
    overwhelmed: "Overwhelmed",
    balanced: "Balanced",
    energized: "Energized",
    
    healthWellness: "Health & Wellness Today",
    heartRate: "Heart Rate",
    steps: "Steps Today",
    sleep: "Sleep",
    stress: "Stress Level",
    
    // Chat
    chatTitle: "Emotional Support Chat",
    chatSubtitle: "A safe space for your thoughts",
    buddyGreeting: "Hello {name}, how can I support you today? I'm here to help with career, wellness, or just to listen.",
    
    // Senior Dashboard
    medication: "Medication",
    appointments: "Appointments",
    familyConnect: "Family Connect",
    emergency: "Emergency",
    activities: "Activities",
    
    // Kids Dashboard
    play: "Play",
    learn: "Learn",
    stories: "Stories",
    friends: "Friends",
    
    // Teens Dashboard
    study: "Study Helper",
    mood: "Mood Tracker",
    social: "Social Tips",
    future: "Future Planning"
  },
  Telugu: {
    // General
    welcome: "స్వాగతం",
    logout: "లాగ్ అవుట్",
    back: "వెనుకకు",
    today: "ఈ రోజు",
    send: "పంపండి",
    typeMessage: "మీ భావాలను వ్యక్తపరచండి...",
    
    // Adult Dashboard
    emotionalSupport: "మానసిక మద్దతు",
    careerGrowth: "వృత్తిపరమైన అభివృద్ధి",
    lifeGoals: "జీవిత లక్ష్యాలు",
    wellness: "ఆరోగ్యం",
    financeTips: "ఆర్థిక చిట్కాలు",
    habitTracking: "అలవాట్ల ట్రాకింగ్",
    
    dailyCheckin: "రోజువారీ పరిశీలన",
    howAreYou: "ఈ రోజు మీరు ఎలా ఉన్నారు?",
    overwhelmed: "ఒత్తిడి",
    balanced: "సమతుల్యం",
    energized: "ఉత్సాహం",
    
    healthWellness: "ఈ రోజు ఆరోగ్యం",
    heartRate: "హృదయ స్పందన",
    steps: "అడుగులు",
    sleep: "నిద్ర",
    stress: "ఒత్తిడి స్థాయి",
    
    // Chat
    chatTitle: "మానసిక మద్దతు చాట్",
    chatSubtitle: "మీ ఆలోచనల కోసం సురక్షితమైన ప్రదేశం",
    buddyGreeting: "నమస్తే {name}, ఈ రోజు నేను మీకు ఎలా సహాయపడగలను? నేను కెరీర్, ఆరోగ్యం లేదా వినడానికి ఇక్కడ ఉన్నాను.",
    
    // Senior Dashboard
    medication: "మందులు",
    appointments: "అపాయింట్‌మెంట్లు",
    familyConnect: "కుటుంబం",
    emergency: "అత్యవసర",
    activities: "కార్యకలాపాలు",
    
    // Kids Dashboard
    play: "ఆటలు",
    learn: "నేర్చుకోండి",
    stories: "కథలు",
    friends: "స్నేహితులు",
    
    // Teens Dashboard
    study: "చదువు సహాయం",
    mood: "మూడ్ ట్రాకర్",
    social: "సామాజిక చిట్కాలు",
    future: "భవిష్యత్తు ప్రణాళిక"
  }
};

export const getTranslation = (lang: string, key: string, params: { [key: string]: string } = {}) => {
  const language = translations[lang] ? lang : 'English';
  let text = translations[language][key] || translations['English'][key] || key;
  
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  
  return text;
};
