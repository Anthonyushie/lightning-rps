import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaderboardEntry {
  id: number;
  userId: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
  username: string;
  lastPlayed: string;
}

interface GlobalStats {
  totalPlayers: number;
  totalGames: number;
  totalCorrect: number;
  topStreak: number;
  averageAccuracy: number;
}

const Leaderboard = () => {
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard'],
    queryFn: async () => {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
  });

  const { data: globalStats, isLoading: statsLoading } = useQuery<GlobalStats>({
    queryKey: ['/api/stats/global'],
    queryFn: async () => {
      const response = await fetch('/api/stats/global');
      if (!response.ok) throw new Error('Failed to fetch global stats');
      return response.json();
    },
  });

  const getAccuracy = (correct: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Statistics */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Global Statistics</h2>
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : globalStats ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{globalStats.totalPlayers}</div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{globalStats.totalGames}</div>
              <div className="text-sm text-gray-600">Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{globalStats.totalCorrect}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{globalStats.topStreak}</div>
              <div className="text-sm text-gray-600">Top Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{globalStats.averageAccuracy}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No global stats available</div>
        )}
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
        {leaderboardLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold w-12 text-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{entry.username}</div>
                    <div className="text-sm text-gray-600">
                      {entry.totalGuesses} games played
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{entry.bestStreak}</div>
                    <div className="text-xs text-gray-500">Best Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {getAccuracy(entry.correctGuesses, entry.totalGuesses)}%
                    </div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <Badge variant={index < 3 ? 'default' : 'secondary'}>
                    {entry.correctGuesses}/{entry.totalGuesses}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎯</div>
            <div>No players yet. Be the first to play!</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;