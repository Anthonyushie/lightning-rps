import { 
  users, 
  gameRecords, 
  userStats,
  type User, 
  type InsertUser,
  type GameRecord,
  type InsertGameRecord,
  type UserStats,
  type InsertUserStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  recordGame(gameRecord: InsertGameRecord): Promise<GameRecord>;
  updateUserStats(stats: InsertUserStats): Promise<UserStats>;
  getUserStats(userId: number): Promise<UserStats | undefined>;
  getLeaderboard(limit?: number): Promise<Array<UserStats & { username: string }>>;
  getGameHistory(userId: number, limit?: number): Promise<GameRecord[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async recordGame(gameRecord: InsertGameRecord): Promise<GameRecord> {
    const [record] = await db
      .insert(gameRecords)
      .values(gameRecord)
      .returning();
    return record;
  }

  async updateUserStats(stats: InsertUserStats): Promise<UserStats> {
    const existingStats = await this.getUserStats(stats.userId!);
    
    if (existingStats) {
      const [updatedStats] = await db
        .update(userStats)
        .set({
          bestStreak: Math.max(existingStats.bestStreak, stats.bestStreak || 0),
          totalGuesses: stats.totalGuesses || existingStats.totalGuesses,
          correctGuesses: stats.correctGuesses || existingStats.correctGuesses,
          lastPlayed: new Date()
        })
        .where(eq(userStats.userId, stats.userId!))
        .returning();
      return updatedStats;
    } else {
      const [newStats] = await db
        .insert(userStats)
        .values(stats)
        .returning();
      return newStats;
    }
  }

  async getUserStats(userId: number): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async getLeaderboard(limit = 10): Promise<Array<UserStats & { username: string }>> {
    const leaderboard = await db
      .select({
        id: userStats.id,
        userId: userStats.userId,
        bestStreak: userStats.bestStreak,
        totalGuesses: userStats.totalGuesses,
        correctGuesses: userStats.correctGuesses,
        lastPlayed: userStats.lastPlayed,
        username: users.username
      })
      .from(userStats)
      .innerJoin(users, eq(userStats.userId, users.id))
      .orderBy(desc(userStats.bestStreak))
      .limit(limit);
    
    return leaderboard;
  }

  async getGameHistory(userId: number, limit = 20): Promise<GameRecord[]> {
    const history = await db
      .select()
      .from(gameRecords)
      .where(eq(gameRecords.userId, userId))
      .orderBy(desc(gameRecords.timestamp))
      .limit(limit);
    
    return history;
  }
}

export const storage = new DatabaseStorage();
