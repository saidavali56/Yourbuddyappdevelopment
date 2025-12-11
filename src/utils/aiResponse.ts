interface ResponsePattern {
  keywords: string[];
  responses: {
    kids: string[];
    teens: string[];
    adults: string[];
    seniors: string[];
  };
}

const patterns: ResponsePattern[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'afternoon', 'evening'],
    responses: {
      kids: [
        "Hi there! ready to play?",
        "Hello friend! You look happy today!",
        "Hey! What shall we do today?",
        "Hi! I'm so glad to see you!"
      ],
      teens: [
        "Hey! How's it going?",
        "What's up? I'm here if you want to chat.",
        "Hey there. How are you feeling right now?",
        "Hi! Good to see you."
      ],
      adults: [
        "Hello. How can I support you today?",
        "Hi there. I hope your day is going well.",
        "Greetings. Ready to tackle today's goals?",
        "Hello! I'm here to help with whatever you need."
      ],
      seniors: [
        "Good day to you! It is lovely to speak with you.",
        "Hello! I hope you are having a pleasant day.",
        "Greetings, dear friend. How are you feeling?",
        "Hello! I am ready to listen whenever you'd like to talk."
      ]
    }
  },
  {
    keywords: ['sad', 'unhappy', 'cry', 'bad', 'lonely', 'depressed', 'upset', 'angry'],
    responses: {
      kids: [
        "Oh no, don't be sad! I'm here for you. Want to play a game?",
        "It's okay to feel sad sometimes. You are still awesome!",
        "Sending you a big virtual hug! 🤗",
        "Let's turn that frown upside down! What makes you smile?"
      ],
      teens: [
        "I'm sorry you're feeling this way. Do you want to talk about it?",
        "That sounds tough. I'm here to listen, no judgment.",
        "It's valid to feel like that. Take your time.",
        "You're not alone. I've got your back."
      ],
      adults: [
        "I hear you. It sounds like a difficult moment. How can I help?",
        "It's okay to not be okay. Remember to take a breath.",
        "I'm sorry you're going through this. Let's take it one step at a time.",
        "Would you like to focus on a solution, or just vent? I'm here for both."
      ],
      seniors: [
        "I am so sorry to hear that. I am right here with you.",
        "Please know that you are not alone. I am here to keep you company.",
        "It is perfectly alright to feel this way. Take a moment for yourself.",
        "I care about you deeply. Is there anything specific on your mind?"
      ]
    }
  },
  {
    keywords: ['happy', 'good', 'great', 'awesome', 'excited', 'fun', 'love', 'joy'],
    responses: {
      kids: [
        "Yay! That makes me so happy too! 🎉",
        "That's wonderful! You're a superstar!",
        "Awesome! Let's celebrate with a high five!",
        "I love seeing you happy! It's the best!"
      ],
      teens: [
        "That's awesome! Glad things are going well.",
        "Love to hear that! Keep that energy going.",
        "That's great news! What's the best part?",
        "Nice! You deserve it."
      ],
      adults: [
        "That's excellent news. I'm glad things are looking up.",
        "Wonderful! It's important to celebrate these wins.",
        "Great to hear! How can we keep this momentum going?",
        "That sounds fantastic. I'm happy for you."
      ],
      seniors: [
        "That is simply wonderful news!",
        "I am delighted to hear that. It brings me joy.",
        "How marvelous! You deserve all the happiness.",
        "That warms my heart. Thank you for sharing that with me."
      ]
    }
  },
  {
    keywords: ['tired', 'sleepy', 'exhausted', 'drained', 'busy', 'stress', 'work'],
    responses: {
      kids: [
        "Maybe it's time for a nap? Or a quiet story?",
        "You've been playing hard! Rest is important too.",
        "Let's take a break. Taking deep breaths helps!",
        "Even superheroes need to sleep sometimes!"
      ],
      teens: [
        "Sounds like you need a break. Don't burn yourself out.",
        "School and life can be a lot. Have you taken 5 minutes for yourself?",
        "Stress is real. Maybe listen to some music and chill?",
        "It's okay to take a step back and rest."
      ],
      adults: [
        "Burnout is real. Have you taken a break recently?",
        "Remember, productivity requires rest. Take a moment.",
        "That sounds draining. Can we simplify your schedule for today?",
        "Let's focus on one thing at a time. Deep breath."
      ],
      seniors: [
        "Please rest your body. Comfort is very important.",
        "There is no rush. Take all the time you need to relax.",
        "Maybe a nice cup of tea would help you relax?",
        "Rest is the best medicine. I will be here when you wake up."
      ]
    }
  },
  {
    keywords: ['joke', 'funny', 'laugh'],
    responses: {
      kids: [
        "Why did the cookie go to the hospital? Because he felt crummy! 😂",
        "What do you call a sleeping dinosaur? A dino-snore!",
        "Why was the math book sad? It had too many problems!",
        "Knock knock! Who's there? Cows go. Cows go who? No, cows go MOO!"
      ],
      teens: [
        "I'm on a seafood diet. I see food and I eat it.",
        "Parallel lines have so much in common. It’s a shame they’ll never meet.",
        "I told my computer I needed a break, and now it won't stop sending me Kit-Kats.",
        "Why don't skeletons fight each other? They don't have the guts."
      ],
      adults: [
        "I threw a boomerang a few years ago. I now live in constant fear.",
        "My boss told me to have a good day.. so I went home.",
        "Why don't scientists trust atoms? Because they make up everything.",
        "I used to play piano by ear, but now I use my hands."
      ],
      seniors: [
        "What do you call a cheese that isn't yours? Nacho Cheese!",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        "Why did the scarecrow win an award? Because he was outstanding in his field!"
      ]
    }
  },
  {
    keywords: ['story', 'tell', 'hear'],
    responses: {
      kids: [
        "Once upon a time, there was a brave little robot who loved to help...",
        "Let me tell you about the magical forest where trees could sing...",
        "There was a tiny star that wanted to shine brighter than the moon...",
        "Do you know the story of the fast turtle? He had a jetpack!"
      ],
      teens: [
        "I can tell you about some cool history facts if you want?",
        "Have you heard the one about the AI who learned to paint?",
        "I've got stories about space, the ocean, or future tech. Pick one!",
        "Let's make up a story together. You start!"
      ],
      adults: [
        "I can share an inspiring biography or a quick fable?",
        "Sometimes stories help us gain perspective. What genre do you like?",
        "I recall a story about resilience...",
        "Would you like to hear something motivational?"
      ],
      seniors: [
        "I would love to tell you a classic tale. Shall we begin?",
        "Do you remember the old fables? I can recite one for you.",
        "Stories from the past are the best. Let me share a gentle one.",
        "I can tell you a story, or would you prefer to tell me one of yours?"
      ]
    }
  }
];

const defaultResponses = {
  kids: [
    "That's interesting! Tell me more!",
    "I'm listening! You're so smart.",
    "Wow! Really? That's cool!",
    "Can you explain that to me again?"
  ],
  teens: [
    "I get that. Go on.",
    "Interesting point. What else?",
    "Yeah, I hear you.",
    "That makes sense. Tell me more."
  ],
  adults: [
    "I see. Please continue.",
    "That's an interesting perspective.",
    "I understand. How does that impact you?",
    "Could you elaborate on that?"
  ],
  seniors: [
    "I am listening intently, my friend.",
    "That is very interesting. Please go on.",
    "I appreciate you sharing that with me.",
    "Oh really? Do tell me more."
  ]
};

export function getAIResponse(input: string, ageGroup: 'kids' | 'teens' | 'adults' | 'seniors'): string {
  const normalizedInput = input.toLowerCase();
  
  // Find matching pattern
  const matchedPattern = patterns.find(pattern => 
    pattern.keywords.some(keyword => normalizedInput.includes(keyword))
  );

  if (matchedPattern) {
    const responses = matchedPattern.responses[ageGroup];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default response if no keywords match
  const defaults = defaultResponses[ageGroup];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
