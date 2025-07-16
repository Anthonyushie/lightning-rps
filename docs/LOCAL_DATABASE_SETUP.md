# Local Database Setup Guide

This guide will help you set up a PostgreSQL database locally for testing the Lightning Rock Paper Scissors application.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher

## 1. Install PostgreSQL Locally

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is usually 5432

### macOS:
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14

# Or using Postgres.app
# Download from: https://postgresapp.com/
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Create Database and User

Connect to PostgreSQL as the postgres user:

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Or on Windows/macOS:
psql -U postgres
```

Create the database and user:

```sql
-- Create database
CREATE DATABASE lightning_rps;

-- Create user (optional, you can use postgres user)
CREATE USER rps_user WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE lightning_rps TO rps_user;

-- Exit psql
\q
```

## 3. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your local database credentials:

```env
# Local PostgreSQL configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/lightning_rps

# Or if you created a custom user:
DATABASE_URL=postgresql://rps_user:your_password@localhost:5432/lightning_rps

# Development settings
NODE_ENV=development
PORT=5000
```

## 4. Install Dependencies and Setup Database

```bash
# Install dependencies
npm install

# Push database schema (creates tables)
npm run db:push

# Optional: Generate and run migrations
npm run db:generate
npm run db:migrate
```

## 5. Test Database Connection

Create a simple test script to verify your connection:

```bash
# Test database connection
npm run db:studio
```

This will open Drizzle Studio where you can view your database tables.

## 6. Run the Application

```bash
# Start the development server
npm run dev
```

Your application should now be running with your local PostgreSQL database!

## 7. Database Management Commands

```bash
# View database schema
npm run db:studio

# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Drop database (careful!)
npm run db:drop
```

## 8. Troubleshooting

### Connection Issues:

1. **Database not found**: Make sure you created the database:
   ```sql
   CREATE DATABASE lightning_rps;
   ```

2. **Authentication failed**: Check your username/password in `.env`

3. **Connection refused**: Make sure PostgreSQL is running:
   ```bash
   # Linux/macOS
   sudo systemctl status postgresql
   
   # macOS with Homebrew
   brew services list | grep postgresql
   ```

4. **Port conflicts**: Change the port in your `.env` if 5432 is taken

### Schema Issues:

1. **Table doesn't exist**: Run `npm run db:push` to create tables

2. **Column doesn't exist**: You may need to drop and recreate tables:
   ```bash
   npm run db:drop
   npm run db:push
   ```

### Permission Issues:

Make sure your database user has the correct permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE lightning_rps TO your_user;
GRANT ALL ON SCHEMA public TO your_user;
```

## 9. Sample Data for Testing

You can add sample data through the application or directly in the database:

```sql
-- Connect to your database
psql -U postgres -d lightning_rps

-- Insert sample user
INSERT INTO users (username, password_hash) VALUES ('testuser', 'hashed_password');

-- Insert sample game record
INSERT INTO game_records (user_id, opponent_choice, user_choice, result, stake_amount) 
VALUES (1, 'rock', 'paper', 'win', 1000);

-- Insert sample user stats
INSERT INTO user_stats (user_id, games_played, games_won, total_winnings, best_streak) 
VALUES (1, 1, 1, 1000, 1);
```

## 10. Production vs Development

### Development (Local):
- Use local PostgreSQL instance
- Enable detailed logging
- Use development environment variables

### Production:
- Use hosted PostgreSQL (like Neon, Supabase, or AWS RDS)
- Enable connection pooling
- Use production environment variables
- Enable SSL connections

## 11. Backup and Restore

### Create backup:
```bash
pg_dump -U postgres lightning_rps > backup.sql
```

### Restore backup:
```bash
psql -U postgres lightning_rps < backup.sql
```

## 12. Monitoring

You can monitor your local database using:

1. **pgAdmin**: Web-based PostgreSQL administration
2. **Drizzle Studio**: `npm run db:studio`
3. **Command line**: `psql -U postgres lightning_rps`

## 13. Next Steps

After setting up your local database:

1. Test the application functionality
2. Create sample game records
3. Test the leaderboard features
4. Verify user authentication
5. Test game statistics

Your local database is now ready for Lightning Rock Paper Scissors development!