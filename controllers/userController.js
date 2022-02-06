import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//------------------------------------------------------------------
async function registerUserApi(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send({ message: 'Missing input' });

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    req.body.password = hash;
    let user = User.build(req.body);
    user.points = 500;
    try {
        user = await user.save();
    } catch (err) {
        return res.status(400).send({ message: err.original.sqlMessage });
    }
    return res.status(200).send({ message: 'User registered successfully', user });
}

//------------------------------------------------------------------
async function loginApi(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: 'Missing input'});
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).send({ message: 'Email is incorrect' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ message: 'Password is incorrect' });

    const token = jwt.sign({
        id: user.id,
        email: user.email,
    }, 'shhhhh');
    return res.status(200).send({ message: 'Login successful', token });
}

//------------------------------------------------------------------
async function getUserPoints(req, res) {
    if (!req.user || !req.user.id) return res.status(401).send({ message: 'Forbidden' });
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    return res.status(200).send({ points: user.points });
}

//------------------------------------------------------------------
export {
    registerUserApi,
    loginApi,
    getUserPoints,
};