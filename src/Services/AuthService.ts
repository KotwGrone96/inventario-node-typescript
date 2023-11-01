import { User } from '../models/User.model';
import { UserDB } from '../db/db';
import { compareSync, hashSync } from 'bcrypt';

interface QueryResolve {
	ok: boolean;
	message: string;
	err?: Error | unknown;
	user?: User;
}

export default class AuthService {
	login(user: User): Promise<QueryResolve> {
		const { username, password } = user;
		return new Promise((resolve, reject) => {
			try {
				return UserDB.findOne({ username }, (err, doc) => {
					if (err) {
						return resolve({
							ok: false,
							message: 'Ha ocurrido un error en la consulta a la base de datos',
							err,
						});
					}
					if (!doc) {
						return resolve({
							ok: false,
							message: 'El usuario no existe',
						});
					}

					const assertPass = compareSync(password, doc.password);
					if (!assertPass) {
						return resolve({
							ok: false,
							message: 'La contraseña es incorrecta',
						});
					}

					return resolve({
						ok: true,
						message: 'Usuario encontrado',
						user: doc,
					});
				});
			} catch (error) {
				return reject({
					ok: false,
					message: 'Ha ocurrido un error en el servidor',
					error,
				});
			}
		});
	}

	register(user: User): Promise<QueryResolve> {
		const { name, lastname, username, password, phone, email, id_num } = user;
		return new Promise((resolve, reject) => {
			try {
				const hashPass = hashSync(password, 10);
				return UserDB.insert(
					{
						name,
						lastname,
						username,
						phone,
						email,
						password: hashPass,
						id_num,
						created_at: new Date(),
					},
					(err, doc) => {
						if (err) {
							return resolve({
								ok: false,
								message: 'Ha ocurrido un error en a la base de datos',
								err,
							});
						}
						return resolve({
							ok: true,
							message: 'Usuario agregado',
							user: doc,
						});
					}
				);
			} catch (error) {
				return reject({
					ok: false,
					message: 'Ha ocurrido un error en el servidor',
					error,
				});
			}
		});
	}
}
