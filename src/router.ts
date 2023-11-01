import { Router } from 'express';
import StoreController from './Controllers/StoreController';
import multer from 'multer';
import { cwd } from 'process';
import { join } from 'path';

const router = Router();
const upload = multer({ dest: join(cwd(), 'storage') });

const storeController = new StoreController();

router.get('/', (req, res) => {
	res.render('home', {
		layout: 'app_layout',
		title: 'Dashboard',
		session: req.session,
		path: req.path,
	});
});

router.get('/tiendas', (req, res) => {
	res.render('stores', {
		layout: 'app_layout',
		title: 'Tiendas',
		path: req.path,
	});
});
router.get('/store/:id', (req, res) => storeController.findOneById(req, res));
router.post('/store/create', (req, res) => storeController.create(req, res));
router.post('/store/create/csv', upload.single('csvFile'), (req, res) =>
	storeController.createCSV(req, res)
);
router.put('/store/update', (req, res) => storeController.update(req, res));
router.delete('/store/:id', (req, res) => storeController.delete(req, res));

router.get('/proveedores', (req, res) => {
	res.render('providers', {
		layout: 'app_layout',
		title: 'Proveedores',
		path: req.path,
	});
});

router.get('/categorias', (req, res) => {
	res.render('categories', {
		layout: 'app_layout',
		title: 'Categorías',
		path: req.path,
	});
});

router.get('/productos', (req, res) => {
	res.render('products', {
		layout: 'app_layout',
		title: 'Productos',
		path: req.path,
	});
});

router.get('/table', (req, res) => storeController.listTable(req, res));

export default router;
