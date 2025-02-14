import sql from 'mssql';    

const config = {
  user: 'adminFirstDay',
  password: process.env.DB_PASSWORD,
  server: 'firstday-ai-db-cluster.database.windows.net',
  database: 'firstday-user-profile-data',
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Required for Azure
  },
};

export async function connectToDatabase() {
  try {
    await sql.connect(config);
    return sql;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
    }
}