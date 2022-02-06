import bodyParser from 'body-parser';
import user from '../routes/user.js';
import transaction from '../routes/transaction.js';
import authenticateUser from '../middlewares/auth.js';
import signup from '../routes/signup.js';

async function initRoutes(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api/signup', signup);
    app.use(authenticateUser);
    app.use('/api/users', user);
    app.use('/api/transactions', transaction);
}

export default initRoutes;