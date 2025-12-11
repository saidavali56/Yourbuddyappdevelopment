import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw } from 'lucide-react';

interface Card {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  onComplete?: () => void;
  category?: 'kids' | 'adults' | 'seniors';
}

export function MemoryMatch({ onComplete, category = 'kids' }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Different card sets based on category
  const getEmojis = () => {
    switch(category) {
      case 'seniors':
        return ['🌹', '🌺', '🌻', '🌼', '🌷', '🌲', '🍀', '🍁'];
      case 'adults':
        return ['💼', '📊', '💡', '💰', '🎯', '📱', '💻', '🤝'];
      default: // kids
        return ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    }
  };

  useEffect(() => {
    initializeGame();
  }, [category]);

  const initializeGame = () => {
    const emojis = getEmojis();
    // Create pairs
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (currentFlipped: number[]) => {
    const [id1, id2] = currentFlipped;
    // Compare content
    if (cards[id1].content === cards[id2].content) {
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) => 
          (idx === id1 || idx === id2) ? { ...card, isMatched: true } : card
        ));
        setFlippedCards([]);
        
        // Check win condition using current state logic
        setCards(prev => {
           if (prev.every(card => card.isMatched)) {
             setIsWon(true);
             onComplete?.();
           }
           return prev;
        });
      }, 500);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((card, idx) => 
          (idx === id1 || idx === id2) ? { ...card, isFlipped: false } : card
        ));
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Memory Match</h3>
          <p className="text-gray-500 text-sm">Find all the matching pairs!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 text-sm mr-2">Moves</span>
            <span className="text-xl font-bold text-blue-600">{moves}</span>
          </div>
          <button 
            onClick={initializeGame}
            className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
            title="Restart Game"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {cards.map((card) => (
          <div key={card.id} className="aspect-square relative perspective-1000" onClick={() => handleCardClick(card.id)}>
            <motion.div
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full relative preserve-3d cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card (Hidden state) */}
              <div 
                className={`absolute inset-0 w-full h-full rounded-2xl shadow-md flex items-center justify-center text-3xl md:text-4xl
                  ${category === 'kids' ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white' : 
                    category === 'seniors' ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' :
                    'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}
                `}
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                ?
              </div>
              
              {/* Back of card (Revealed state) */}
              <div 
                className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border-2 border-white flex items-center justify-center text-4xl md:text-5xl"
                style={{ 
                  backfaceVisibility: 'hidden', 
                  WebkitBackfaceVisibility: 'hidden', 
                  transform: 'rotateY(180deg)' 
                }}
              >
                {card.content}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 text-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            <h4 className="text-2xl font-bold text-green-800 mb-2">Spectacular Victory!</h4>
            <p className="text-green-700 mb-6">You solved it in {moves} moves. Keep up the great brain work!</p>
            <button 
              onClick={initializeGame}
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
