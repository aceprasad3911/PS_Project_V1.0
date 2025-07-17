#!/usr/bin/env node

// Simple script to run the server with development authentication
console.log('🚀 Starting Sapient Slingshot in Development Mode...');

// Set development environment variables
process.env.NODE_ENV = 'development';
process.env.REPL_ID = 'development-repl-id';
process.env.DATABASE_URL = 'postgresql://localhost:5432/temp_db';
process.env.SESSION_SECRET = 'dev-secret-key-for-local-development';
process.env.REPLIT_DOMAINS = 'localhost:3000,localhost:5000';
process.env.ISSUER_URL = 'https://replit.com/oidc';
process.env.PORT = '3000';
process.env.HOST = 'localhost';

console.log('📋 Environment Configuration:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   REPL_ID: ${process.env.REPL_ID}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   HOST: ${process.env.HOST}`);
console.log('');

// Import and run the server
import('./server/index.ts');