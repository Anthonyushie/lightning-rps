# API Documentation

## Overview

The Lightning Rock Paper Scissors API provides endpoints for game management, user statistics, and leaderboard functionality. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. User identification is handled through session management.

## Endpoints

### Game Management

#### Record Game Result
Records the outcome of a Rock Paper Scissors game.

```http
POST /api/game/record
```

**Request Body:**
```json
{
  "userId": 1,
  "gameType": "rps",
  "userGuess": "rock",
  "opponentChoice": "scissors",
  "result": "win",
  "amountStaked": 100,
  "amountWon": 200,
  "streak": 3
}
```

**Response:**
```json
{
  "id": 123,
  "userId": 1,
  "gameType": "rps",
  "userGuess": "rock",
  "opponentChoice": "scissors",
  "result": "win",
  "amountStaked": 100,
  "amountWon": 200,
  "streak": 3,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Game recorded successfully
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Server error

### Leaderboard

#### Get Leaderboard
Retrieves the top players ranked by best streak.

```http
GET /api/leaderboard?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 10, max: 100)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "bestStreak": 15,
    "totalGuesses": 45,
    "correctGuesses": 30,
    "lastPlayed": "2024-01-15T10:30:00Z",
    "username": "BitcoinBattler"
  },
  {
    "id": 2,
    "userId": 2,
    "bestStreak": 12,
    "totalGuesses": 38,
    "correctGuesses": 25,
    "lastPlayed": "2024-01-15T09:45:00Z",
    "username": "SatoshiScissors"
  }
]
```

**Status Codes:**
- `200 OK` - Leaderboard retrieved successfully
- `500 Internal Server Error` - Server error

### User Statistics

#### Update User Statistics
Updates or creates user statistics.

```http
POST /api/user/stats
```

**Request Body:**
```json
{
  "userId": 1,
  "bestStreak": 10,
  "totalGuesses": 25,
  "correctGuesses": 15
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "bestStreak": 10,
  "totalGuesses": 25,
  "correctGuesses": 15,
  "lastPlayed": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Statistics updated successfully
- `400 Bad Request` - Invalid request data
- `500 Internal Server Error` - Server error

#### Get User Statistics
Retrieves statistics for a specific user.

```http
GET /api/user/{userId}/stats
```

**Path Parameters:**
- `userId`: User ID (integer)

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "bestStreak": 10,
  "totalGuesses": 25,
  "correctGuesses": 15,
  "lastPlayed": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved successfully
- `404 Not Found` - User statistics not found
- `500 Internal Server Error` - Server error

#### Get User Game History
Retrieves the game history for a specific user.

```http
GET /api/user/{userId}/history?limit=20
```

**Path Parameters:**
- `userId`: User ID (integer)

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 20, max: 100)

**Response:**
```json
[
  {
    "id": 123,
    "userId": 1,
    "gameType": "rps",
    "userGuess": "rock",
    "opponentChoice": "scissors",
    "result": "win",
    "amountStaked": 100,
    "amountWon": 200,
    "streak": 3,
    "timestamp": "2024-01-15T10:30:00Z"
  },
  {
    "id": 122,
    "userId": 1,
    "gameType": "rps",
    "userGuess": "paper",
    "opponentChoice": "rock",
    "result": "win",
    "amountStaked": 100,
    "amountWon": 200,
    "streak": 2,
    "timestamp": "2024-01-15T10:25:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - History retrieved successfully
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

### Global Statistics

#### Get Global Statistics
Retrieves global game statistics across all players.

```http
GET /api/stats/global
```

**Response:**
```json
{
  "totalPlayers": 150,
  "totalGames": 2500,
  "totalCorrect": 1250,
  "topStreak": 25,
  "averageAccuracy": 50
}
```

**Status Codes:**
- `200 OK` - Global statistics retrieved successfully
- `500 Internal Server Error` - Server error

## Data Models

### GameRecord
```typescript
{
  id: number;
  userId: number;
  gameType: "rps";
  userGuess: "rock" | "paper" | "scissors";
  opponentChoice: "rock" | "paper" | "scissors";
  result: "win" | "lose" | "draw";
  amountStaked: number; // in sats
  amountWon: number; // in sats
  streak: number;
  timestamp: string; // ISO 8601 format
}
```

### UserStats
```typescript
{
  id: number;
  userId: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
  lastPlayed: string; // ISO 8601 format
}
```

### LeaderboardEntry
```typescript
{
  id: number;
  userId: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
  lastPlayed: string; // ISO 8601 format
  username: string;
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Error Codes:**
- `400 Bad Request` - Invalid request data or parameters
- `404 Not Found` - Requested resource not found
- `500 Internal Server Error` - Server-side error

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

CORS is enabled for all origins in development. In production, configure CORS to allow only trusted domains.

## WebSocket Support

The API includes WebSocket support for real-time game updates. Connect to:

```
ws://localhost:5000/ws
```

WebSocket events:
- `game_start` - Game has started
- `opponent_joined` - Opponent has joined the game
- `choice_made` - Player has made their choice
- `game_result` - Game result is available

## Lightning Network Integration

The API integrates with the Lightning Network through Alby NWC (Nostr Wallet Connect). Payment processing is handled client-side with the following flow:

1. User connects Alby wallet via NWC
2. Game stakes are held in escrow
3. Winner receives combined stakes
4. Transactions are recorded in game_records table

## Development

### Running the API

```bash
npm run dev
```

### Testing Endpoints

Use curl or Postman to test endpoints:

```bash
# Get leaderboard
curl http://localhost:5000/api/leaderboard

# Record a game
curl -X POST http://localhost:5000/api/game/record \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "gameType": "rps",
    "userGuess": "rock",
    "opponentChoice": "scissors",
    "result": "win",
    "amountStaked": 100,
    "amountWon": 200,
    "streak": 1
  }'
```

### Database Schema

The API uses Drizzle ORM with PostgreSQL. Schema is defined in `shared/schema.ts`.

To update the database:

```bash
npm run db:push
```

## Future Enhancements

- Authentication and authorization
- Real-time multiplayer matching
- Tournament brackets
- Advanced statistics
- Payment processing improvements
- Rate limiting and abuse prevention