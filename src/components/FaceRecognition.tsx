import { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';

interface FaceRecognitionProps {
  onComplete: (faceData: string) => void;
  mode: 'register' | 'login';
}

export function FaceRecognition({ onComplete, mode }: FaceRecognitionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLDivElement>(null);

  const startScan = () => {
    setIsScanning(true);
    setStatus('scanning');
    setProgress(0);

    // Simulate face scanning progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          setTimeout(() => {
            onComplete('face_data_' + Date.now());
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Camera className="w-16 h-16 mx-auto text-primary" />
        <h3 className="text-slate-800">
          {mode === 'register' ? 'Register Your Face' : 'Face Recognition Login'}
        </h3>
        <p className="text-gray-600">
          {mode === 'register'
            ? 'Position your face in the frame and click start'
            : 'Look at the camera to authenticate'}
        </p>
      </div>

      <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video">
        <div
          ref={videoRef}
          className="w-full h-full flex items-center justify-center"
        >
          {status === 'idle' && (
            <div className="text-center text-white space-y-4">
              <Camera className="w-20 h-20 mx-auto opacity-50" />
              <p className="opacity-70">Camera will activate when you start</p>
            </div>
          )}
          
          {status === 'scanning' && (
            <div className="text-center text-white space-y-4">
              <div className="relative w-48 h-48 mx-auto">
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse"></div>
                <div className="absolute inset-4 border-4 border-secondary rounded-full animate-ping"></div>
                <Camera className="w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p>Scanning... {progress}%</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center text-white space-y-4">
              <CheckCircle className="w-20 h-20 mx-auto text-success" />
              <p>Face recognized successfully!</p>
            </div>
          )}
        </div>

        {isScanning && status === 'scanning' && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {!isScanning && status === 'idle' && (
        <button
          onClick={startScan}
          className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
        >
          Start Face Recognition
        </button>
      )}

      <div className="text-xs text-center text-gray-500">
        <AlertCircle className="w-4 h-4 inline mr-1" />
        This is a simulated face recognition for demo purposes
      </div>
    </div>
  );
}
