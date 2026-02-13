const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional but good: ssl for Render (they require it on some setups)
  ssl: {
    rejectUnauthorized: false  // Common for self-signed certs on Render
  }
});

pool.on('error', (err) => {
  console.error('Idle client error:', err.stack);
});

// Test connection once on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;