import express, { urlencoded, json } from 'express';
import authRouter from './auth.router';
import router from './router';
import { isAuthenticated } from './Middleware/Auth';
import { engine } from 'express-handlebars';
import { cwd } from 'process';
import { join } from 'path';
import session from 'express-session';

const helpers = {
	eq: function (a, b, options) {
		return a === b ? options.fn(this) : options.inverse(this);
	},
	neq: function (a, b, options) {
		return a !== b ? options.fn(this) : options.inverse(this);
	},
	includes: function (texto: string, cadena: string, options) {
		if (texto.includes(cadena)) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	},
};

export default function createWebServer() {
	const app = express();

	//***** MIDDLEWARES *****/
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use(express.static(join(cwd(), 'public')));
	app.use(
		session({
			secret: 'mi secreto XD',
			resave: false,
			saveUninitialized: true,
		})
	);
	app.engine(
		'.hbs',
		engine({
			extname: '.hbs',
			layoutsDir: join(cwd(), 'views', 'layouts'),
			defaultLayout: join(cwd(), 'views', 'layouts', 'login_layout'),
			partialsDir: join(cwd(), 'views', 'partials'),
			helpers,
		})
	);
	app.set('view engine', '.hbs');
	app.set('views', join(cwd(), 'views'));

	//***** AUTH *****/
	app.use(authRouter);

	//***** RUTAS *****/
	app.use(isAuthenticated, router);
	return app;
}
