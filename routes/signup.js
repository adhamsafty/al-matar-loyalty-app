import express from 'express';
import { registerUserApi, loginApi }  from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUserApi);
router.post('/login', loginApi);

export default router;