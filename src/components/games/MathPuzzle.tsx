import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface MathPuzzleProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete?: () => void;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

export function MathPuzzle({ difficulty, onComplete }: MathPuzzleProps) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  const generateQuestion = () => {
    let num1, num2, operator, answer;
    let ops = ['+', '-'];

    if (difficulty === 'medium') ops.push('*');
    if (difficulty === 'hard') ops = ['*', '/', '+', '-'];

    operator = ops[Math.floor(Math.random() * ops.length)];

    switch (difficulty) {
      case 'easy': // Kids
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium': // Teens/Adults
        num1 = Math.floor(Math.random() * 20) + 5;
        num2 = Math.floor(Math.random() * 20) + 5;
        break;
      case 'hard': // Challenge
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
      default:
        num1 = 5; num2 = 5;
    }

    // Adjust for subtraction to avoid negatives for easy mode
    if (operator === '-' && num1 < num2) [num1, num2] = [num2, num1];
    
    // Adjust for division to ensure integer results
    if (operator === '/') {
      num2 = Math.floor(Math.random() * 10) + 2;
      num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    }

    switch (operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      case '/': answer = num1 / num2; break;
      default: answer = 0;
    }

    // Generate options
    const options = new Set<number>();
    options.add(answer);
    while (options.size < 4) {
      let offset = Math.floor(Math.random() * 10) - 5;
      if (offset === 0) offset = 1;
      options.add(answer + offset);
    }

    setQuestion({
      text: `${num1} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator} ${num2} = ?`,
      answer,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    });
    setShowFeedback(null);
  };

  const handleAnswer = (selected: number) => {
    if (!question) return;

    if (selected === question.answer) {
      setScore(s => s + 10 + (streak * 2));
      setStreak(s => s + 1);
      setShowFeedback('correct');
      setTimeout(generateQuestion, 1000);
    } else {
      setStreak(0);
      setShowFeedback('incorrect');
      setTimeout(generateQuestion, 1500);
    }
  };

  if (!question) return null;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-indigo-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-3xl">🧮</span> Math Puzzle
          </h3>
          <p className="text-gray-500 text-sm">Solve to power up your brain!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-xl font-bold text-slate-700">{score}</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-8 relative">
        <motion.div
          key={question.text}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl md:text-6xl font-bold text-indigo-600 bg-indigo-50 py-8 rounded-2xl"
        >
          {question.text}
        </motion.div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {showFeedback === 'correct' ? (
                <div className="bg-green-100 p-4 rounded-full shadow-lg">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-4 rounded-full shadow-lg">
                  <XCircle className="w-16 h-16 text-red-600" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(opt)}
            disabled={showFeedback !== null}
            className={`p-6 text-2xl font-bold rounded-xl shadow-sm border-2 transition-all
              ${showFeedback === 'incorrect' && opt === question.answer 
                ? 'bg-green-100 border-green-400 text-green-800' // Show correct answer if wrong
                : 'bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700'
              }
            `}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <span>Streak: {streak} 🔥</span>
        <button 
          onClick={() => { setScore(0); setStreak(0); generateQuestion(); }}
          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
