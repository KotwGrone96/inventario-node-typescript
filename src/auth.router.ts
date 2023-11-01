import { Router } from 'express';
import AuthController from './Controllers/AuthController';

const authRouter = Router();

//***** CONTROLLERS *****/
const authController = new AuthController();

authRouter.get('/login', (req, res) => {
	res.render('LoginPage', { title: 'Ingresar' });
});
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.get('/logout', (req, res) => authController.logout(req, res));

export default authRouter;
