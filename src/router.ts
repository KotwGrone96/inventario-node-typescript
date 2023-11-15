import { Router } from 'express';
import multer from 'multer';
import { cwd } from 'process';
import { join } from 'path';

import StoreController from './Controllers/StoreController';
import ProviderController from './Controllers/ProviderController';
import CategoryController from './Controllers/CategoryController';
import ProducController from './Controllers/ProductController';

const router = Router();
const upload = multer({ dest: join(cwd(), 'storage') });

const storeController = new StoreController();
const providerController = new ProviderController();
const categoryController = new CategoryController();
const productController = new ProducController();

// RUTA DE VISTAS
router.get('/', (req, res) => {
	console.log(req.session['user']);
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
		session: req.session,
	});
});

router.get('/proveedores', (req, res) => {
	res.render('providers', {
		layout: 'app_layout',
		title: 'Proveedores',
		path: req.path,
		session: req.session,
	});
});

router.get('/categorias', (req, res) => {
	res.render('categories', {
		layout: 'app_layout',
		title: 'Categorías',
		path: req.path,
		session: req.session,
	});
});

router.get('/productos', (req, res) => {
	res.render('products', {
		layout: 'app_layout',
		title: 'Productos',
		path: req.path,
		session: req.session,
	});
});

router.get('/productos/nuevo', (req, res) => {
	res.render('addProduct', {
		layout: 'app_layout',
		title: 'Nuevo producto',
		path: req.path,
		session: req.session,
	});
});

//***** TABLAS *****/
router.get('/store/table', (req, res) => storeController.listTable(req, res));
router.get('/provider/table', (req, res) => providerController.listTable(req, res));
router.get('/category/table', (req, res) => categoryController.listTable(req, res));
router.get('/product/table', (req, res) => productController.listTable(req, res));

//***** TIENDAS *****/
router.get('/store/:id', (req, res) => storeController.findOneById(req, res));
router.post('/store/create', (req, res) => storeController.create(req, res));
router.post('/store/create/csv', upload.single('csvFile'), (req, res) =>
	storeController.createCSV(req, res)
);
router.put('/store/update', (req, res) => storeController.update(req, res));
router.delete('/store/:id', (req, res) => storeController.delete(req, res));

//***** PROVEEDORES *****/
router.get('/provider/:id', (req, res) => providerController.findOneById(req, res));
router.post('/provider/create', (req, res) => providerController.create(req, res));
router.post('/provider/create/csv', upload.single('csvFile'), (req, res) =>
	providerController.createCSV(req, res)
);
router.put('/provider/update', (req, res) => providerController.update(req, res));
router.delete('/provider/:id', (req, res) => providerController.delete(req, res));

//***** CATEGORÍAS *****/
router.get('/category/:id', (req, res) => categoryController.findOneById(req, res));
router.post('/category/create', (req, res) => categoryController.create(req, res));
router.post('/category/create/csv', upload.single('csvFile'), (req, res) =>
	categoryController.createCSV(req, res)
);
router.put('/category/update', (req, res) => categoryController.update(req, res));
router.delete('/category/:id', (req, res) => categoryController.delete(req, res));

//***** CATEGORÍAS *****/
router.get('/product/:id', (req, res) => productController.findOneById(req, res));
router.post('/product/create', (req, res) => productController.create(req, res));
router.post('/product/create/csv', upload.single('csvFile'), (req, res) =>
	productController.createCSV(req, res)
);
router.put('/product/update', (req, res) => productController.update(req, res));
router.delete('/product/:id', (req, res) => productController.delete(req, res));

export default router;
