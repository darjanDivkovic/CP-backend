const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", 
  password: "root",
  port: 5432,
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