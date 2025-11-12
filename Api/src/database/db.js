import { createPool } from 'mysql2/promise'

import dotenv from 'dotenv'
dotenv.config()

const db_host = process.env.HOST || 'localhost'
const db_user = process.env.USER || 'root'
const db_password = process.env.DB_PASS
const db_database = process.env.DB_NAME || 'prototipo'


const pool = createPool({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_database
})

export function query(sql, params = []) {
  return pool.query(sql, params)
}

export async function getConnection() {
  return await pool.getConnection()
}

export default pool