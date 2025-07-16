#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this script to test your local PostgreSQL connection
 */

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';

// Configure neon to use ws for WebSocket connections
const neonConfig = { webSocketConstructor: ws };

async function testDatabaseConnection() {
  console.log('🚀 Testing database connection...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('Please create a .env file with your database URL:');
    console.log('DATABASE_URL=postgresql://username:password@localhost:5432/lightning_rps');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is set');
  console.log(`🔗 Connection string: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')}`);

  try {
    // Create connection pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool, schema });

    console.log('\n📊 Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version()');
    console.log('✅ Database connection successful!');
    console.log(`⏰ Current time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);

    // Test table existence
    console.log('\n🔍 Checking database tables...');
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('⚠️  No tables found. Run "npm run db:push" to create tables.');
    } else {
      console.log('✅ Found tables:');
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // Test schema tables specifically
    console.log('\n🎯 Testing Lightning RPS schema...');
    
    const expectedTables = ['users', 'game_records', 'user_stats'];
    let allTablesExist = true;

    for (const tableName of expectedTables) {
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);

      if (tableExists.rows[0].exists) {
        console.log(`✅ Table "${tableName}" exists`);
        
        // Get row count
        const count = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
        console.log(`   📊 Rows: ${count.rows[0].count}`);
      } else {
        console.log(`❌ Table "${tableName}" missing`);
        allTablesExist = false;
      }
    }

    if (!allTablesExist) {
      console.log('\n💡 Run "npm run db:push" to create missing tables.');
    }

    // Test sample queries
    console.log('\n🧪 Testing sample queries...');
    
    try {
      // Test users table
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`✅ Users table query successful: ${userCount.rows[0].count} users`);

      // Test game_records table
      const gameCount = await pool.query('SELECT COUNT(*) FROM game_records');
      console.log(`✅ Game records table query successful: ${gameCount.rows[0].count} games`);

      // Test user_stats table
      const statsCount = await pool.query('SELECT COUNT(*) FROM user_stats');
      console.log(`✅ User stats table query successful: ${statsCount.rows[0].count} stats`);

    } catch (error) {
      console.log(`⚠️  Some queries failed: ${error.message}`);
      console.log('   This is normal if tables don\'t exist yet.');
    }

    console.log('\n🎉 Database test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Run "npm run db:push" to create/update tables');
    console.log('2. Run "npm run db:studio" to view database in browser');
    console.log('3. Start your application with "npm run dev"');

    await pool.end();

  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error(`Error: ${error.message}`);
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running locally');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Verify database exists: CREATE DATABASE lightning_rps;');
    console.log('4. Check username/password are correct');
    console.log('5. Ensure PostgreSQL is listening on the correct port');
    
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();