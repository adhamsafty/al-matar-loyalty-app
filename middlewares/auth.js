import jwt from 'jsonwebtoken';
import User from '../models/user.js';

async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).send({ message: 'Forbidden' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(403).send({ message: 'Forbidden' });
    let decoded;
    try {
        decoded = jwt.verify(token, 'shhhhh');
    } catch (err) {
        return res.status(400).send({ message: 'Failed to authenticate token' });
    }
    
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(403).send({ message: 'Forbidden' });

    req.user = user;
    next();
}

export default authenticateUser;