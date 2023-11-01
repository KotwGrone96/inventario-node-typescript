import { User } from '../models/User.model';
import { UserDB } from '../db/db';

export default class UserService {
	findOne(user: User): Promise<null | boolean | User> {
		const { username, email, id_num } = user;
		return new Promise((resolve, reject) => {
			try {
				UserDB.findOne({ $or: [{ username }, { email }, { id_num }] }, (err, doc) => {
					if (err) {
						return reject(null);
					}
					if (doc) {
						return resolve(doc);
					}
					return resolve(false);
				});
			} catch (error) {
				return reject(null);
			}
		});
	}
}
