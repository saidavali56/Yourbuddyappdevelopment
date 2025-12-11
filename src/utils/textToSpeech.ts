export const speak = (text: string, ageGroup: string) => {
  if (!window.speechSynthesis) {
    console.warn('Text-to-speech not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Get available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a suitable voice based on age group preference if possible
  // This is browser dependent, so we'll set attributes mostly
  
  // Default settings
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Age group specific adjustments
  switch (ageGroup) {
    case '6-12': // Kids
      utterance.pitch = 1.2; // Higher pitch
      utterance.rate = 0.9;  // Slightly slower/clearer
      break;
      
    case '13-17': // Teens
      utterance.pitch = 1.0;
      utterance.rate = 1.1; // Slightly faster, casual
      break;
      
    case 'senior': // Seniors
      utterance.pitch = 1.0;
      utterance.rate = 0.85; // Slower, clearer
      utterance.volume = 1.0; // Max volume
      break;
      
    default: // Adults (18-20, 21-40)
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      break;
  }

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
