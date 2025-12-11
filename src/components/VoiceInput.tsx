import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, X, Info } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onVoiceDetected?: (isDetected: boolean) => void;
  language?: string;
}

export function VoiceInput({ onTranscript, onVoiceDetected, language = 'English' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState('');
  const recognitionRef = useRef<any>(null);
  const isCheckingRef = useRef(false);

  // Check availability on mount
  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    // Check 1: Secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      setIsAvailable(false);
      setUnavailableReason('Voice input requires a secure connection (HTTPS or localhost).');
      isCheckingRef.current = false;
      return;
    }

    // Check 2: Browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsAvailable(false);
      setUnavailableReason('Your browser does not support speech recognition. Try Chrome, Edge, or Safari.');
      isCheckingRef.current = false;
      return;
    }

    // Check 3: Media devices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsAvailable(false);
      setUnavailableReason('Media devices API is not available in your browser.');
      isCheckingRef.current = false;
      return;
    }

    // Check 4: Test microphone access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsAvailable(true);
      isCheckingRef.current = false;
    } catch (error: any) {
      console.error('Microphone access check failed:', error);
      setIsAvailable(false);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setUnavailableReason('Microphone access is blocked. Click here to learn how to enable it.');
      } else if (error.name === 'NotFoundError') {
        setUnavailableReason('No microphone found. Please connect a microphone.');
      } else {
        setUnavailableReason('Unable to access microphone. Click here for help.');
      }
      isCheckingRef.current = false;
    }
  };

  const startListening = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Map language names to BCP 47 language tags
      const langMap: { [key: string]: string } = {
        'English': 'en-US',
        'Telugu': 'te-IN',
        'Hindi': 'hi-IN',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Chinese': 'zh-CN',
        'Japanese': 'ja-JP',
        'Arabic': 'ar-SA',
        'Portuguese': 'pt-PT',
        'Russian': 'ru-RU'
      };
      
      recognition.lang = langMap[language] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onVoiceDetected?.(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsAvailable(false);
          setUnavailableReason('Microphone access is blocked. Click here to learn how to enable it.');
        }
        // Silently handle other errors like no-speech, aborted
      };

      recognition.onend = () => {
        setIsListening(false);
        onVoiceDetected?.(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      onVoiceDetected?.(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    onVoiceDetected?.(false);
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Still checking availability
  if (isAvailable === null) {
    return (
      <button
        disabled
        className="p-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed"
        title="Checking microphone availability..."
      >
        <Mic className="w-5 h-5 opacity-50" />
      </button>
    );
  }

  // Voice input not available - show disabled state with info
  if (!isAvailable) {
    return (
      <>
        <button
          onClick={() => setShowInfo(true)}
          className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors"
          title={unavailableReason}
        >
          <MicOff className="w-5 h-5" />
        </button>

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowInfo(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Info className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Voice Input Unavailable</h3>
                    <p className="text-sm text-gray-500 mt-1">{unavailableReason}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm mb-3"><strong>To enable voice input:</strong></p>
                  
                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <p className="mb-1"><strong>1. Enable microphone in your browser:</strong></p>
                      <ul className="list-disc list-inside ml-2 text-gray-600 space-y-1">
                        <li>Click the lock or microphone icon in the address bar</li>
                        <li>Set microphone permission to &quot;Allow&quot;</li>
                        <li>Refresh this page</li>
                      </ul>
                    </div>

                    <div>
                      <p className="mb-1"><strong>2. Make sure you&apos;re using HTTPS:</strong></p>
                      <p className="text-gray-600 ml-2">The URL should start with <code className="bg-gray-100 px-1 rounded">https://</code> (or <code className="bg-gray-100 px-1 rounded">http://localhost</code> for development)</p>
                    </div>

                    <div>
                      <p className="mb-1"><strong>3. Use a supported browser:</strong></p>
                      <p className="text-gray-600 ml-2">Chrome, Edge, or Safari work best</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> You can still type your messages normally without voice input.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowInfo(false);
                      window.location.reload();
                    }}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reload & Retry
                  </button>
                  <button
                    onClick={() => setShowInfo(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Voice input available - show active button
  return (
    <button
      onClick={handleClick}
      className={`relative p-3 rounded-xl transition-all ${
        isListening
          ? 'bg-red-500 text-white shadow-lg animate-pulse'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <>
          <Volume2 className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
}