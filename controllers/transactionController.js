import User from '../models/user.js';
import Transaction from '../models/transaction.js';
import { Op } from 'sequelize';

//------------------------------------------------------------------
async function expireTransaction(transactionId) {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) return;
    if (transaction.status !== 'PENDING') return;
    transaction.status = 'CANCELLED';
    try { await transaction.save(); } catch(err) {}

    const user = await User.findByPk(transaction.sender_id);
    if (!user) return;
    user.points += transaction.points;
    try { await user.save(); } catch(err) {}
}

//------------------------------------------------------------------
async function createTransferApi(req, res) {
    const { points, email } = req.body;
    if (!points || !email) return res.status(400).send({ message: 'Invalid input' });
    
    const sender = await User.findByPk(req.user.id);
    if (points > sender.points) return res.status(400).send({ message: 'You don\'t have sufficient points to send' });
    
    const receiver = await User.findOne({ where: { email } });
    if (!receiver) return res.status(404).send({ message: 'User not found' });

    if (sender.id === receiver.id) return res.status(400).send({ message: 'You cannot send points to yourself' });

    const transaction = await Transaction.create({
        sender_id: sender.id,
        receiver_id: receiver.id,
        status: 'PENDING',
        points,
    });

    sender.points -= points;
    try {
        await sender.save();   
    } catch(err) {
        return res.status(400).send({ message: err.original.sqlMessage });
    }

    const timer = 10 * 60 * 1000;
    setTimeout(expireTransaction, timer, transaction.id);
    return res.status(200).send({ message: 'Transaction created successfully. Please confirm it within 10 minutes', transactionId: transaction.id });
}

//------------------------------------------------------------------
async function confirmTransferApi(req, res) {
    const { transactionId } = req.params;
    if (!transactionId) return res.status(400).send({ message: 'Transaction ID is missing' });

    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) return res.status(404).send({ message: 'Transaction not found' });

    const user = await User.findByPk(transaction.receiver_id);
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (transaction.sender_id !== req.user.id) return res.status(400).send({ message: 'You are not allowed to confirm this transaction' });
    if (transaction.status !== 'PENDING') return res.status(400).send({ message: 'Transaction is not pending confirmation' });
    transaction.status = 'COMPLETED';
    try {
        await transaction.save();
    } catch(err) {
        return res.status(400).send({ message: err.original.sqlMessage });
    }

    user.points += transaction.points;
    try {
        await user.save();
    } catch(err) {
        return res.status(400).send({ message: err.original.sqlMessage });
    }
    return res.status(200).send({ message: 'Transaction confirmed successfully' });
}

//------------------------------------------------------------------
async function getTransactionsApi(req, res) {
    const { id } = req.user;
    if (!id) return res.status(400).send({ message: 'ID is missing' });

    const transactions = await Transaction.findAll({
        where: {
            [Op.or]: [{ sender_id: id }, { receiver_id: id }],
        },
    });
    return res.status(200).send({ transactions });
}

//------------------------------------------------------------------
export {
    createTransferApi,
    confirmTransferApi,
    getTransactionsApi,
};