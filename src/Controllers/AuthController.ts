import { Response, Request } from 'express';
import { User } from '../models/User.model';
import AuthService from '../Services/AuthService';
import UserService from '../Services/UserService';

export default class AuthController {
	authService: AuthService;
	userService: UserService;
	constructor() {
		this.authService = new AuthService();
		this.userService = new UserService();
	}

	async login(req: Request, res: Response) {
		const { body } = req;
		if ('username' in body == false || 'password' in body == false) {
			return res.json({
				ok: false,
				message: 'Debe completar todos los campos',
			});
		}
		const { username, password } = body as User;
		if (username.trim().length == 0 || password.trim().length == 0) {
			return res.json({
				ok: false,
				message: 'Debe completar todos los campos',
			});
		}
		const query = await this.authService.login(body);
		if (!query.ok) {
			return res.json(query);
		}
		this.setSession(query.user!, req);
		const { user, ...newQuery } = query;
		return res.json(newQuery);
	}

	setSession(user: User, req: Request) {
		const { password, ...userSession } = user;
		const _id = userSession._id!;
		const { name, lastname, email, created_at, username } = userSession;
		req.session['user'] = { _id, name, lastname, email, created_at, username };
	}

	async register(req: Request, res: Response) {
		const { body } = req;
		if (
			'username' in body == false ||
			'password' in body == false ||
			'name' in body == false ||
			'lastname' in body == false ||
			'email' in body == false ||
			'id_num' in body == false
		) {
			return res.json({
				ok: false,
				message: 'Debe completar todos los campos',
			});
		}
		const { username, password, name, lastname, email, id_num } = body as User;
		if (
			username.trim().length == 0 ||
			password.trim().length == 0 ||
			name.trim().length == 0 ||
			lastname.trim().length == 0 ||
			email.trim().length == 0 ||
			id_num.trim().length == 0
		) {
			return res.json({
				ok: false,
				message: 'Debe completar todos los campos',
			});
		}
		const alreadyExist = await this.userService.findOne(body);
		if (alreadyExist) {
			return res.json({
				ok: false,
				message: 'El nombre de usuario, el correo o el DNI ya existe',
			});
		}
		const query = await this.authService.register(body);
		return res.json(query);
	}

	logout(req: Request, res: Response) {
		req.session.destroy((err) => {
			if (err) {
				console.error(err);
			}
			res.redirect('/login');
		});
	}
}
