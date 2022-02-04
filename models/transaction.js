import { DataTypes } from 'sequelize';
import sequelize from '../startup/db.js';
import User from './user.js';

const Transaction = sequelize.define('Transaction', {
    sender_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'COMPLETED', 'CANCELLED'],
    },
});

export default Transaction;