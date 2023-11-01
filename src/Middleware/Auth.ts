import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
	// Verifica si el usuario está autenticado
	if ('session' in req && 'user' in req.session) {
		// Puedes personalizar esta condición según tu método de autenticación
		return next(); // El usuario está autenticado, continúa con la solicitud
	} else {
		// El usuario no está autenticado, redirige a la página de inicio de sesión
		return res.redirect('/login');
	}
}
