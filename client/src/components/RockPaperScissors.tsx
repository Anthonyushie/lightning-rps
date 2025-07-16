import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useYakiHonne } from '@/contexts/YakiHonneContext';

type Choice = 'rock' | 'paper' | 'scissors';
type GameStatus = 'waiting' | 'connecting' | 'playing' | 'revealing' | 'result';

interface Player {
  id: string;
  name: string;
  choice?: Choice;
  stake: number;
  connected: boolean;
  isReady: boolean;
}

interface GameState {
  status: GameStatus;
  players: Player[];
  gameId: string;
  winner?: string;
  result?: 'win' | 'lose' | 'draw';
  countdown: number;
}

const RockPaperScissors: React.FC = () => {
  const { user, isReady, publishEvent, sendCustomData } = useYakiHonne();
  
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    players: [],
    gameId: '',
    countdown: 10
  });
  
  const [localPlayer, setLocalPlayer] = useState<Player>({
    id: Math.random().toString(36).substr(2, 9),
    name: user?.display_name || user?.name || 'Player',
    stake: 100,
    connected: false,
    isReady: false
  });

  const [balance, setBalance] = useState(1000);

  const choices: { [key in Choice]: string } = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
  };

  const choiceColors: { [key in Choice]: string } = {
    rock: 'bg-red-500',
    paper: 'bg-blue-500',
    scissors: 'bg-green-500'
  };

  // Update player name when user data is available
  useEffect(() => {
    if (user) {
      setLocalPlayer(prev => ({
        ...prev,
        name: user.display_name || user.name || 'Player'
      }));
    }
  }, [user]);

  const createGame = () => {
    const gameId = Math.random().toString(36).substr(2, 9);
    setGameState(prev => ({
      ...prev,
      status: 'connecting',
      gameId,
      players: [{ ...localPlayer, connected: true }]
    }));

    // Simulate opponent joining
    setTimeout(() => {
      const opponent: Player = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Opponent',
        stake: localPlayer.stake,
        connected: true,
        isReady: false
      };

      setGameState(prev => ({
        ...prev,
        status: 'playing',
        players: [prev.players[0], opponent]
      }));

      toast({
        title: 'Opponent Found!',
        description: 'Game is starting...',
      });
    }, 2000);
  };

  const makeChoice = (choice: Choice) => {
    if (gameState.status !== 'playing') return;

    setLocalPlayer(prev => ({ ...prev, choice, isReady: true }));
    
    // Simulate opponent choice
    const opponentChoices: Choice[] = ['rock', 'paper', 'scissors'];
    const opponentChoice = opponentChoices[Math.floor(Math.random() * 3)];
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        status: 'revealing',
        players: prev.players.map((player, index) => 
          index === 0 
            ? { ...player, choice, isReady: true }
            : { ...player, choice: opponentChoice, isReady: true }
        )
      }));

      // Determine winner
      setTimeout(() => {
        const result = determineWinner(choice, opponentChoice);
        const winner = result === 'win' ? localPlayer.name : result === 'lose' ? 'Opponent' : 'Draw';
        
        setGameState(prev => ({
          ...prev,
          status: 'result',
          winner,
          result
        }));

        // Update balance and publish game result to Nostr
        if (result === 'win') {
          setBalance(prev => prev + localPlayer.stake);
          toast({
            title: 'You Won!',
            description: `+${localPlayer.stake} sats`,
          });
          
          // Publish win to Nostr
          publishEvent({
            content: `⚡ Just won ${localPlayer.stake} sats playing Lightning Rock Paper Scissors! 🎉\n\nGame: ${choice} vs ${opponentChoice}\nResult: Victory! 🏆`,
            tags: [['t', 'lightning'], ['t', 'gaming'], ['t', 'yakihonne'], ['t', 'rockpaperscissors']],
            kind: 1
          });
        } else if (result === 'lose') {
          setBalance(prev => prev - localPlayer.stake);
          toast({
            title: 'You Lost!',
            description: `-${localPlayer.stake} sats`,
            variant: 'destructive'
          });
          
          // Publish loss to Nostr
          publishEvent({
            content: `⚡ Lost ${localPlayer.stake} sats playing Lightning Rock Paper Scissors 😅\n\nGame: ${choice} vs ${opponentChoice}\nResult: Defeat, but I'll be back! 💪`,
            tags: [['t', 'lightning'], ['t', 'gaming'], ['t', 'yakihonne'], ['t', 'rockpaperscissors']],
            kind: 1
          });
        } else {
          toast({
            title: 'Draw!',
            description: 'No sats lost or gained',
          });
          
          // Publish draw to Nostr
          publishEvent({
            content: `⚡ Draw in Lightning Rock Paper Scissors! 🤝\n\nGame: ${choice} vs ${opponentChoice}\nResult: Tie - no sats lost or gained`,
            tags: [['t', 'lightning'], ['t', 'gaming'], ['t', 'yakihonne'], ['t', 'rockpaperscissors']],
            kind: 1
          });
        }
      }, 2000);
    }, 1500);
  };

  const determineWinner = (choice1: Choice, choice2: Choice): 'win' | 'lose' | 'draw' => {
    if (choice1 === choice2) return 'draw';
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[choice1] === choice2 ? 'win' : 'lose';
  };

  const resetGame = () => {
    setGameState({
      status: 'waiting',
      players: [],
      gameId: '',
      countdown: 10
    });
    setLocalPlayer(prev => ({ ...prev, choice: undefined, isReady: false }));
  };

  const updateStake = (newStake: number) => {
    if (newStake <= balance && newStake > 0) {
      setLocalPlayer(prev => ({ ...prev, stake: newStake }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 
          className="text-pixel-xl glitch-text mb-4" 
          data-text="ROCK PAPER SCISSORS"
        >
          ROCK PAPER SCISSORS
        </h1>
        <div className="text-pixel text-orange-500">
          ⚡ LIGHTNING NETWORK BATTLES ⚡
        </div>
      </div>

      {/* YakiHonne Authentication */}
      {!isReady ? (
        <Card className="brutalist-card p-6">
          <div className="space-y-4">
            <h2 className="text-pixel-lg text-center">CONNECTING TO YAKIHONNE</h2>
            <div className="text-center">
              <div className="animate-pulse text-pixel text-orange-500">
                ⚡ Authenticating with Nostr... ⚡
              </div>
            </div>
            <div className="text-center text-pixel text-gray-600">
              Connecting to YakiHonne for secure gameplay
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* User Info & Balance */}
          <Card className="brutalist-card p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-pixel text-blue-500">
                  PLAYER: {user?.display_name || user?.name || 'Player'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-pixel text-orange-500 bitcoin-glow">
                  BALANCE: {balance} SATS
                </div>
              </div>
              <div className="text-center">
                <div className="text-pixel">
                  STAKE: 
                  <Input
                    type="number"
                    value={localPlayer.stake}
                    onChange={(e) => updateStake(parseInt(e.target.value) || 0)}
                    className="brutalist-button w-20 ml-2 inline-block"
                    min="1"
                    max={balance}
                  />
                  SATS
                </div>
              </div>
            </div>
          </Card>

          {/* Game Area */}
          <Card className="brutalist-card p-6">
            {gameState.status === 'waiting' && (
              <div className="text-center space-y-6">
                <div className="text-pixel-lg">READY TO BATTLE?</div>
                <Button
                  onClick={createGame}
                  className="brutalist-button bg-green-500 hover:bg-green-600 text-pixel-lg px-8 py-4"
                >
                  START GAME
                </Button>
              </div>
            )}

            {gameState.status === 'connecting' && (
              <div className="text-center space-y-4">
                <div className="text-pixel-lg animate-pulse">
                  FINDING OPPONENT...
                </div>
                <div className="text-pixel">
                  GAME ID: {gameState.gameId}
                </div>
              </div>
            )}

            {gameState.status === 'playing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-pixel-lg">MAKE YOUR CHOICE!</div>
                  <div className="text-pixel mt-2">
                    STAKES: {localPlayer.stake} SATS EACH
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {(Object.keys(choices) as Choice[]).map((choice) => (
                    <Button
                      key={choice}
                      onClick={() => makeChoice(choice)}
                      disabled={localPlayer.choice !== undefined}
                      className={`rps-card h-32 ${choiceColors[choice]} hover:scale-105 transition-transform`}
                    >
                      <div className="text-center">
                        <div className="pixel-emoji">{choices[choice]}</div>
                        <div className="text-pixel mt-2">{choice.toUpperCase()}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {localPlayer.choice && (
                  <div className="text-center">
                    <div className="text-pixel animate-pulse">
                      WAITING FOR OPPONENT...
                    </div>
                  </div>
                )}
              </div>
            )}

            {gameState.status === 'revealing' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-pixel-lg animate-pulse">
                    REVEALING...
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-4">
                    <div className="text-pixel">YOU</div>
                    <div className="rps-card h-32 bg-blue-500 flex items-center justify-center">
                      <div className="pixel-emoji animate-pixel-bounce">
                        {localPlayer.choice ? choices[localPlayer.choice] : '❓'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="text-pixel">OPPONENT</div>
                    <div className="rps-card h-32 bg-red-500 flex items-center justify-center">
                      <div className="pixel-emoji animate-pixel-bounce">
                        {gameState.players[1]?.choice ? choices[gameState.players[1].choice] : '❓'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState.status === 'result' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-pixel-xl ${
                    gameState.result === 'win' ? 'text-green-500 neon-glow' : 
                    gameState.result === 'lose' ? 'text-red-500 animate-shake' : 
                    'text-yellow-500'
                  }`}>
                    {gameState.result === 'win' ? 'YOU WIN!' : 
                     gameState.result === 'lose' ? 'YOU LOSE!' : 
                     'DRAW!'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center space-y-4">
                    <div className="text-pixel">YOU</div>
                    <div className="rps-card h-32 bg-blue-500 flex items-center justify-center">
                      <div className="pixel-emoji">
                        {localPlayer.choice ? choices[localPlayer.choice] : '❓'}
                      </div>
                    </div>
                    <Badge className={`text-pixel ${
                      gameState.result === 'win' ? 'bg-green-500' : 
                      gameState.result === 'lose' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}>
                      {gameState.result === 'win' ? `+${localPlayer.stake}` : 
                       gameState.result === 'lose' ? `-${localPlayer.stake}` : 
                       '0'} SATS
                    </Badge>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="text-pixel">OPPONENT</div>
                    <div className="rps-card h-32 bg-red-500 flex items-center justify-center">
                      <div className="pixel-emoji">
                        {gameState.players[1]?.choice ? choices[gameState.players[1].choice] : '❓'}
                      </div>
                    </div>
                    <Badge className={`text-pixel ${
                      gameState.result === 'lose' ? 'bg-green-500' : 
                      gameState.result === 'win' ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}>
                      {gameState.result === 'lose' ? `+${localPlayer.stake}` : 
                       gameState.result === 'win' ? `-${localPlayer.stake}` : 
                       '0'} SATS
                    </Badge>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={resetGame}
                    className="brutalist-button bg-purple-500 hover:bg-purple-600 text-pixel-lg px-8 py-4"
                  >
                    PLAY AGAIN
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Game Stats */}
          <Card className="brutalist-card p-4">
            <div className="text-center">
              <div className="text-pixel-lg mb-4">⚡ LIGHTNING STATS ⚡</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-pixel text-orange-500">{balance}</div>
                  <div className="text-pixel text-xs">BALANCE</div>
                </div>
                <div className="text-center">
                  <div className="text-pixel text-green-500">0</div>
                  <div className="text-pixel text-xs">WINS</div>
                </div>
                <div className="text-center">
                  <div className="text-pixel text-red-500">0</div>
                  <div className="text-pixel text-xs">LOSSES</div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default RockPaperScissors;