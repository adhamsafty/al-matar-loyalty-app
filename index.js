import express from 'express';
import 'dotenv/config';
import initRoutes from './startup/routes.js';
import { initDB } from './startup/db.js';

const app = express();

initRoutes(app);
initDB();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});