const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional but good: ssl for Render (they require it on some setups)
  ssl: false,
});

pool.on('error', (err) => {
  console.error('Idle client error:', err.stack);
});

// Right after creating the pool
console.log('Attempting DB connection with URL:', process.env.DATABASE_URL ? 'Set (value hidden for security)' : 'MISSING - CRITICAL ERROR!');

// In the async test block
(async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected successfully');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection FAILED with full details:');
    console.error(err);               // ← This logs the entire Error object
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Code:', err.code); // e.g., ECONNREFUSED, 28P01 for auth fail
    process.exit(1);
  }
})();

module.exports = pool;