import express from 'express';
import { createTransferApi, confirmTransferApi, getTransactionsApi } from '../controllers/transactionController.js';

const router = express.Router();

router.post('/create', createTransferApi);
router.put('/confirm/:transactionId', confirmTransferApi);
router.get('/', getTransactionsApi);

export default router;