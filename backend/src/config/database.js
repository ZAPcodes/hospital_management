const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
  connectionString: "postgresql://hospital_management_xzsp_user:3YTPSJSC4n4XZpIuUomY7njoNCB34RKW@dpg-cu3bvqlds78s73eic1vg-a.singapore-postgres.render.com/hospital_management_xzsp",
  ssl: {
    rejectUnauthorized: true, // Enable this for Render's managed database
  },
});


module.exports = db;
