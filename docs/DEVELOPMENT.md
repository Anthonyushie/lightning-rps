# Development Guide

## Overview

This guide covers local development setup, coding standards, and contribution guidelines for the Lightning Rock Paper Scissors application.

## Development Setup

### Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- Git
- Code editor (VS Code recommended)

### Local Installation

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
# Edit .env with your local database credentials
```

4. Start PostgreSQL and create database:
```bash
createdb lightning_rps_dev
```

5. Initialize database schema:
```bash
npm run db:push
```

6. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
lightning-rps/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── RockPaperScissors.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx
│   │   │   └── not-found.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/            # Utility functions
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx         # Main app component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   ├── vite.ts            # Vite dev server integration
│   └── index.ts           # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
├── docs/                  # Documentation
│   ├── API.md             # API documentation
│   ├── DEPLOYMENT.md      # Deployment guide
│   └── DEVELOPMENT.md     # This file
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── drizzle.config.ts      # Drizzle ORM configuration
```

## Development Workflow

### 1. Feature Development

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes following coding standards
3. Test your changes thoroughly
4. Commit with descriptive messages
5. Push and create pull request

### 2. Database Changes

1. Modify schema in `shared/schema.ts`
2. Push changes to database:
```bash
npm run db:push
```

3. Test migrations thoroughly
4. Document schema changes

### 3. Frontend Development

The frontend uses React with TypeScript, Tailwind CSS, and Vite for fast development.

**Key Technologies:**
- React 18 with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for development server
- TanStack Query for API calls

**Development Commands:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 4. Backend Development

The backend uses Express with TypeScript, Drizzle ORM, and PostgreSQL.

**Key Technologies:**
- Express.js for API server
- TypeScript for type safety
- Drizzle ORM for database operations
- PostgreSQL for data storage
- Zod for validation

**Development Commands:**
```bash
# Start server in development mode
npm run dev

# Run database migrations
npm run db:push

# Generate database client
npm run db:generate
```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type guards for runtime validation
- Prefer `const` over `let` when possible

```typescript
// Good
interface Player {
  id: string;
  name: string;
  choice?: Choice;
}

const player: Player = {
  id: generateId(),
  name: 'PlayerName'
};

// Bad
let player: any = {
  id: generateId(),
  name: 'PlayerName'
};
```

### React Components

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript interfaces for props
- Follow component composition patterns

```tsx
// Good
interface GameProps {
  onGameEnd: (result: GameResult) => void;
  initialStake: number;
}

const Game: React.FC<GameProps> = ({ onGameEnd, initialStake }) => {
  // Component logic
};

// Bad
const Game = (props: any) => {
  // Component logic
};
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow neo-brutalist design principles
- Use custom CSS classes for complex animations
- Maintain consistent spacing and typography

```css
/* Good - Custom utility classes */
.brutalist-button {
  @apply border-4 border-black bg-primary text-black;
  box-shadow: 4px 4px 0px black;
  transition: all 0.1s ease-out;
}

/* Bad - Inline styles */
<button style={{ border: '4px solid black' }}>
```

### API Design

- Use RESTful endpoints
- Implement proper error handling
- Validate all inputs with Zod
- Return consistent response formats

```typescript
// Good
app.post('/api/game/record', async (req, res) => {
  try {
    const gameData = insertGameRecordSchema.parse(req.body);
    const result = await storage.recordGame(gameData);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Invalid game data' });
  }
});

// Bad
app.post('/api/game/record', (req, res) => {
  const result = storage.recordGame(req.body);
  res.json(result);
});
```

## Testing

### Unit Tests

Run unit tests for individual components:

```bash
npm test
```

Test structure:
```typescript
// __tests__/components/RockPaperScissors.test.tsx
import { render, screen } from '@testing-library/react';
import RockPaperScissors from '@/components/RockPaperScissors';

describe('RockPaperScissors', () => {
  it('renders game interface', () => {
    render(<RockPaperScissors />);
    expect(screen.getByText('ROCK PAPER SCISSORS')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test API endpoints:

```typescript
// __tests__/api/game.test.ts
import request from 'supertest';
import app from '@/server/index';

describe('Game API', () => {
  it('should record game results', async () => {
    const response = await request(app)
      .post('/api/game/record')
      .send({
        userId: 1,
        gameType: 'rps',
        userGuess: 'rock',
        opponentChoice: 'scissors',
        result: 'win'
      });
    
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests

Use Playwright for end-to-end testing:

```bash
npx playwright test
```

## Debugging

### Frontend Debugging

1. Use React Developer Tools
2. Enable Vite HMR for instant updates
3. Use browser DevTools for network requests
4. Console.log for state debugging

### Backend Debugging

1. Use Node.js inspector:
```bash
node --inspect server/index.ts
```

2. Add debug logging:
```typescript
import debug from 'debug';
const log = debug('app:game');

log('Game state:', gameState);
```

3. Use database debugging:
```typescript
// Enable query logging
const db = drizzle(pool, { 
  schema, 
  logger: true 
});
```

## Performance Optimization

### Frontend Performance

1. Use React.memo for expensive components
2. Implement virtualization for large lists
3. Optimize bundle size with code splitting
4. Use service workers for caching

### Backend Performance

1. Implement connection pooling
2. Use database indexing
3. Add response caching
4. Optimize SQL queries

### Database Performance

1. Add appropriate indexes:
```sql
CREATE INDEX idx_game_records_user_id ON game_records(user_id);
CREATE INDEX idx_game_records_timestamp ON game_records(timestamp);
```

2. Use query optimization:
```typescript
// Good - Use specific columns
const stats = await db
  .select({
    bestStreak: userStats.bestStreak,
    totalGuesses: userStats.totalGuesses
  })
  .from(userStats);

// Bad - Select all columns
const stats = await db.select().from(userStats);
```

## Lightning Network Development

### Local Testing

1. Use regtest Lightning Network
2. Set up local Alby wallet
3. Test with small amounts
4. Mock payment flows for development

### NWC Integration

```typescript
// Test NWC connection
const testNWC = async (connectionString: string) => {
  try {
    const nwc = new NWCClient(connectionString);
    await nwc.connect();
    const balance = await nwc.getBalance();
    return { success: true, balance };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

## Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `docs/documentation-update` - Documentation

### Commit Messages

Use conventional commits:

```
feat: add Lightning payment integration
fix: resolve game state synchronization issue
docs: update API documentation
style: improve brutalist button styling
refactor: optimize database queries
test: add unit tests for game logic
```

### Pull Request Process

1. Create descriptive PR title
2. Fill out PR template
3. Request reviews from team members
4. Address feedback and comments
5. Merge after approval

## Common Issues

### Development Problems

1. **Database connection issues**
   - Check PostgreSQL is running
   - Verify connection string
   - Check firewall settings

2. **Build failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify Vite configuration

3. **Lightning integration issues**
   - Ensure HTTPS in production
   - Check Alby wallet connection
   - Verify NWC permissions

### Debugging Tips

1. Use TypeScript strict mode
2. Enable ESLint and Prettier
3. Use React Strict Mode
4. Monitor console for errors
5. Check network tab for API calls

## IDE Setup

### VS Code Extensions

Recommended extensions:
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    "tw`([^`]*)",
    "tw=\"([^\"]*)",
    "tw={\"([^\"}]*)"
  ]
}
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following standards
4. Add tests for new features
5. Submit pull request
6. Address review feedback

## Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [Lightning Network Documentation](https://lightning.network/docs)
- [Alby NWC Documentation](https://nwc.getalby.com/docs)

## Support

For development questions:
1. Check documentation first
2. Search existing issues
3. Ask in team chat
4. Create GitHub issue if needed

---

Happy coding! ⚡