import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface ChronoFlipWidgetProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

type GameState = 'waiting' | 'guessing' | 'revealed';
type Symbol = '🔥' | '❄️';

interface GameData {
  symbol: Symbol;
  userGuess: Symbol | null;
  isCorrect: boolean | null;
  streak: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
}

const ChronoFlipWidget: React.FC<ChronoFlipWidgetProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [timeToNext, setTimeToNext] = useState(0);
  const [gameData, setGameData] = useState<GameData>(() => {
    const saved = localStorage.getItem('chronoFlip-data');
    return saved ? JSON.parse(saved) : {
      symbol: '🔥',
      userGuess: null,
      isCorrect: null,
      streak: 0,
      bestStreak: 0,
      totalGuesses: 0,
      correctGuesses: 0
    };
  });
  const [hintRevealed, setHintRevealed] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTime = useRef<number>(0);

  // Save game data to localStorage
  useEffect(() => {
    localStorage.setItem('chronoFlip-data', JSON.stringify(gameData));
  }, [gameData]);

  // Initialize game timing
  useEffect(() => {
    const syncWithMinute = () => {
      const now = Date.now();
      const msIntoMinute = now % 60000;
      const msToNextMinute = 60000 - msIntoMinute;
      
      setTimeToNext(Math.floor(msToNextMinute / 1000));
      
      if (msToNextMinute <= 1000) {
        startNewGame();
      }
    };

    syncWithMinute();
    const interval = setInterval(syncWithMinute, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for guessing phase
  useEffect(() => {
    if (gameState === 'guessing' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'guessing' && countdown === 0) {
      // Time's up - reveal without guess
      revealResult(null);
    }
  }, [gameState, countdown]);

  const startNewGame = () => {
    const symbols: Symbol[] = ['🔥', '❄️'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    setGameData(prev => ({ ...prev, symbol: randomSymbol, userGuess: null, isCorrect: null }));
    setGameState('guessing');
    setCountdown(5);
    setIsFlipped(false);
    setHintRevealed(false);
    gameStartTime.current = Date.now();
  };

  const makeGuess = (guess: Symbol) => {
    if (gameState !== 'guessing') return;
    
    setGameData(prev => ({ ...prev, userGuess: guess }));
    revealResult(guess);
  };

  const revealResult = (guess: Symbol | null) => {
    const isCorrect = guess === gameData.symbol;
    
    setGameData(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      const newTotalGuesses = prev.totalGuesses + 1;
      const newCorrectGuesses = prev.correctGuesses + (isCorrect ? 1 : 0);
      
      return {
        ...prev,
        isCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        totalGuesses: newTotalGuesses,
        correctGuesses: newCorrectGuesses
      };
    });
    
    setGameState('revealed');
    setIsFlipped(true);
    
    // Show result toast
    toast({
      title: isCorrect ? 'Correct!' : 'Wrong!',
      description: guess ? `You guessed ${guess}` : 'Time ran out!',
      variant: isCorrect ? 'default' : 'destructive'
    });
    
    // Return to waiting state after 3 seconds
    setTimeout(() => {
      setGameState('waiting');
      setIsFlipped(false);
    }, 3000);
  };

  const revealHint = () => {
    setHintRevealed(true);
    toast({
      title: 'Hint revealed!',
      description: gameData.symbol === '🔥' ? "It's hot!" : "It's cold!",
    });
  };

  const shareResult = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    const resultText = `I ${gameData.isCorrect ? 'nailed' : 'missed'} the ${currentTime} ${gameData.symbol} flip${gameData.isCorrect ? `—beat me!` : '—better luck next time!'} #ChronoFlip`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resultText);
      toast({
        title: 'Copied to clipboard!',
        description: 'Share your result with friends',
      });
    } else {
      setShareModalOpen(true);
    }
  };

  const getWinRate = () => {
    if (gameData.totalGuesses === 0) return 0;
    return Math.round((gameData.correctGuesses / gameData.totalGuesses) * 100);
  };

  const getCircumference = () => 283; // 2 * π * 45
  const getStrokeDashoffset = () => {
    const circumference = getCircumference();
    return circumference - (circumference * (5 - countdown)) / 5;
  };

  const sizeClasses = {
    small: 'w-full max-w-xs',
    medium: 'w-full max-w-sm',
    large: 'w-full max-w-md'
  };

  const iconSizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  return (
    <div className={`chrono-flip-widget ${sizeClasses[size]} ${className}`}>
      {/* Main Flip Card */}
      <div className="flip-card aspect-square w-full cursor-pointer relative">
        <div 
          className={`flip-card-inner w-full h-full transition-transform duration-800 ease-in-out transform-gpu ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div 
            className="flip-card-front absolute w-full h-full rounded-2xl flex items-center justify-center backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {gameState === 'waiting' && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className={`${iconSizes[size]} animate-pulse`}>⏰</div>
                  <div className="text-white font-semibold">Next flip in</div>
                  <div className="text-2xl font-bold text-blue-400">{timeToNext}s</div>
                </div>
              </div>
            )}
            
            {gameState === 'guessing' && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-full h-full rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center space-y-4">
                  <div className={`${iconSizes[size]}`}>❓</div>
                  <div className="text-white font-semibold">Make your guess!</div>
                  
                  {/* Countdown Timer */}
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="6" 
                        fill="none"
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        stroke="white" 
                        strokeWidth="6" 
                        fill="none"
                        strokeDasharray={getCircumference()}
                        strokeDashoffset={getStrokeDashoffset()}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                      {countdown}
                    </div>
                  </div>
                  
                  {/* Guess Buttons */}
                  {size === 'large' && (
                    <div className="flex space-x-4">
                      <Button 
                        onClick={() => makeGuess('🔥')}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        🔥 Hot
                      </Button>
                      <Button 
                        onClick={() => makeGuess('❄️')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105"
                      >
                        ❄️ Cold
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Back Side */}
          <div 
            className="flip-card-back absolute w-full h-full rounded-2xl flex items-center justify-center backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className={`w-full h-full rounded-2xl flex items-center justify-center ${
              gameData.symbol === '🔥' ? 'fire-gradient' : 'ice-gradient'
            }`}>
              <div className="text-center space-y-4">
                <div className={`${iconSizes[size]} ${gameData.isCorrect ? 'animate-bounce' : ''}`}>
                  {gameData.symbol}
                </div>
                <div className="text-white font-semibold text-xl">
                  {gameData.isCorrect ? 'Correct!' : 'Wrong!'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guess Buttons for Small/Medium */}
      {gameState === 'guessing' && size !== 'large' && (
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={() => makeGuess('🔥')}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-all"
          >
            🔥 Hot
          </Button>
          <Button 
            onClick={() => makeGuess('❄️')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all"
          >
            ❄️ Cold
          </Button>
        </div>
      )}
      
      {/* Widget Controls */}
      <div className="mt-4 space-y-3">
        {/* Stats Display */}
        {size === 'small' && (
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Streak</span>
              <span className="text-lg font-bold text-green-600">{gameData.streak}</span>
            </div>
          </Card>
        )}
        
        {size === 'medium' && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 text-center">
              <div className="text-sm text-gray-600">Streak</div>
              <div className="text-xl font-bold text-green-600">{gameData.streak}</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-sm text-gray-600">Best</div>
              <div className="text-xl font-bold text-blue-600">{gameData.bestStreak}</div>
            </Card>
          </div>
        )}
        
        {size === 'large' && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-2xl font-bold text-green-600">{gameData.streak}</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600">Best Streak</div>
              <div className="text-2xl font-bold text-blue-600">{gameData.bestStreak}</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-sm text-gray-600">Win Rate</div>
              <div className="text-2xl font-bold text-purple-600">{getWinRate()}%</div>
            </Card>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            onClick={revealHint}
            disabled={hintRevealed || gameState !== 'guessing'}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors"
          >
            💡 {size === 'large' ? 'Get Hint (10 sats)' : 'Hint'}
          </Button>
          <Button 
            onClick={shareResult}
            disabled={gameState !== 'revealed'}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
          >
            📤 {size === 'large' ? 'Share Result' : 'Share'}
          </Button>
        </div>
        
        {/* Hint Display */}
        {hintRevealed && (
          <Card className="bg-amber-50 border-amber-200 p-3 text-center">
            <div className="text-amber-800 font-medium">
              💡 Hint: {gameData.symbol === '🔥' ? "It's hot!" : "It's cold!"}
            </div>
          </Card>
        )}
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-sm w-full mx-4 p-6">
            <div className="text-center space-y-4">
              <div className="text-2xl">🎉</div>
              <h3 className="text-lg font-semibold text-gray-900">Share Your Result!</h3>
              <Card className="bg-gray-50 p-4">
                <p className="text-sm text-gray-700">
                  I {gameData.isCorrect ? 'nailed' : 'missed'} the {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })} {gameData.symbol} flip—beat me! #ChronoFlip
                </p>
              </Card>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setShareModalOpen(false)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChronoFlipWidget;
