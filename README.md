# ⚡ Lightning Rock Paper Scissors

A neo-brutalist, pixelated Rock Paper Scissors game with Bitcoin Lightning Network integration. Battle opponents, stake sats, and experience retro gaming with modern crypto payments.

![Lightning RPS Demo](https://via.placeholder.com/800x400/ff6b00/000000?text=LIGHTNING+RPS)

## 🎮 Features

- **Neo-Brutalist Design**: Heavy borders, bold shadows, pixelated aesthetics
- **Bitcoin Lightning Integration**: Stake and win sats using Alby NWC
- **Real-time Multiplayer**: Battle opponents in pixelated RPS matches
- **Retro Gaming Feel**: Press Start 2P font, pixel animations, glitch effects
- **Secure Payments**: Lightning Network for instant, low-fee transactions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Alby wallet with NWC support (for Bitcoin features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lightning-rps.git
cd lightning-rps
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to play the game!

## 🎯 How to Play

1. **Connect Wallet**: Enter your Alby NWC connection string
2. **Set Stake**: Choose how many sats to wager (1-1000+)
3. **Find Opponent**: Click "START GAME" to match with a player
4. **Make Choice**: Select Rock (✊), Paper (✋), or Scissors (✌️)
5. **Battle**: Watch the pixelated reveal and see who wins
6. **Collect Winnings**: Sats are automatically transferred to the winner

## 🔧 Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** with custom neo-brutalist utilities
- **Press Start 2P** font for retro gaming aesthetic
- **shadcn/ui** components adapted for brutalist design

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with connection pooling
- **Drizzle ORM** for type-safe database operations
- **RESTful API** for game state management

### Bitcoin Integration
- **Alby NWC** (Nostr Wallet Connect) for Lightning payments
- **Real-time balance updates** and transaction handling
- **Secure sat transfers** with proper error handling

## 📁 Project Structure

```
lightning-rps/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── RockPaperScissors.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
└── docs/                  # Documentation
    └── API.md             # API documentation
```

## 🎨 Design System

### Neo-Brutalist Components

- **brutalist-card**: Heavy borders with bold shadows
- **brutalist-button**: Pixelated buttons with hover effects
- **pixel-emoji**: Large, pixelated game symbols
- **glitch-text**: Animated text with RGB shift effects
- **neon-glow**: Glowing effects for special elements

### Color Palette

- **Bitcoin Orange**: `#ff6b00` - Primary accent color
- **Neon Green**: `#00ff00` - Success states
- **Neon Pink**: `#ff00ff` - Error states
- **High Contrast**: Black borders, white backgrounds

## 🔌 API Endpoints

### Game Management
- `POST /api/game/record` - Record game results
- `GET /api/leaderboard` - Get top players
- `GET /api/stats/global` - Global game statistics

### User Management
- `POST /api/user/stats` - Update user statistics
- `GET /api/user/:id/stats` - Get user stats
- `GET /api/user/:id/history` - Get game history

See [API Documentation](docs/API.md) for detailed endpoint specifications.

## 🗄️ Database Schema

### Core Tables

**users**
- `id` (serial, primary key)
- `username` (text, unique)
- `password` (text)

**game_records**
- `id` (serial, primary key)
- `user_id` (integer, foreign key)
- `game_type` (text: 'rps')
- `user_guess` (text: 'rock'/'paper'/'scissors')
- `opponent_choice` (text: 'rock'/'paper'/'scissors')
- `result` (text: 'win'/'lose'/'draw')
- `amount_staked` (integer, sats)
- `amount_won` (integer, sats)
- `timestamp` (timestamp)

**user_stats**
- `id` (serial, primary key)
- `user_id` (integer, foreign key)
- `best_streak` (integer)
- `total_guesses` (integer)
- `correct_guesses` (integer)
- `last_played` (timestamp)

## ⚡ Lightning Integration

### Alby NWC Setup

1. Install Alby browser extension
2. Generate NWC connection string in Alby settings
3. Enter connection string in the game interface
4. Approve payment permissions for gaming

### Payment Flow

1. **Stake Creation**: Player sets bet amount
2. **Escrow**: Sats held in temporary escrow
3. **Game Resolution**: Winner determined by RPS rules
4. **Payout**: Sats transferred to winner's wallet
5. **Confirmation**: Balance updated in real-time

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Database Tests
```bash
npm run test:db
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
```

### Docker Deployment
```bash
docker build -t lightning-rps .
docker run -p 5000:5000 lightning-rps
```

## 🔐 Security Considerations

- **NWC Security**: Connection strings stored securely
- **Input Validation**: All user inputs validated with Zod
- **SQL Injection**: Prevented with Drizzle ORM
- **Rate Limiting**: API endpoints protected from spam
- **HTTPS**: Required for production Lightning payments

## 🐛 Troubleshooting

### Common Issues

**NWC Connection Fails**
- Verify Alby extension is installed
- Check NWC string format
- Ensure proper permissions granted

**Game Doesn't Start**
- Check network connection
- Verify sufficient balance
- Clear browser cache

**Payment Errors**
- Confirm Lightning channel capacity
- Check wallet connection status
- Verify transaction fees

## 📈 Performance

- **Frontend**: Vite HMR for instant updates
- **Backend**: Express with efficient routing
- **Database**: Connection pooling for scalability
- **Lightning**: Instant payments with low fees

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit pull request
5. Follow code style guidelines

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bitcoin Lightning Network** for instant payments
- **Alby** for excellent wallet integration
- **Nostr** for decentralized protocols
- **Replit** for development environment

---

**Ready to battle?** Connect your wallet and start earning sats! ⚡

For support, join our [Discord](https://discord.gg/lightning-rps) or open an issue on GitHub.