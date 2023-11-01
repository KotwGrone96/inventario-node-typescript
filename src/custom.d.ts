// custom.d.ts
import { User } from './models/User.model';
import { UserSession } from './models/User.model';

declare namespace Express {
	export interface Request {
		user?: any; // Puedes cambiar "any" por el tipo de datos que almacena el usuario
	}
}

declare module 'express-session' {
	interface SessionData {
		user: {
			_id: string;
			username: string;
			name: string;
			lastname: string;
			email: string;
			created_at?: Date;
		}; // Puedes ajustar "any" al tipo de usuario que esperas
		// Otras propiedades personalizadas de la sesión si las tienes
	}
}
