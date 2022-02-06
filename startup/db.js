import Sequelize from 'sequelize';
import mysql from 'mysql2/promise';

const host = process.env.MYSQL_DB_HOST;
const port = process.env.MYSQL_DB_PORT;
const user = process.env.MYSQL_DB_USERNAME;
const pw = process.env.MYSQL_DB_PW;
const dbName = process.env.MYSQL_DB_NAME;

async function initDB() {
    const connection = await mysql.createConnection({ host, port, user, password: pw });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

}

const sequelize = new Sequelize(dbName, user, pw, {
    dialect: 'mysql',
    host,
    port,
});
export { sequelize, initDB };