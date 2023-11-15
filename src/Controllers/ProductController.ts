import { Request, Response } from 'express';
import { Product } from '../models/Product.model';
import ProductService from '../Services/ProductService';

export default class ProducController {
	productService: ProductService;

	constructor() {
		this.productService = new ProductService();
	}

	async create(req: Request, res: Response) {
		if (
			'name' in req.body == false ||
			'description' in req.body == false ||
			'providers' in req.body == false ||
			'categories' in req.body == false ||
			'sku' in req.body == false ||
			'product_code' in req.body == false ||
			'public_price' in req.body == false ||
			'unit_price' in req.body == false ||
			'profit' in req.body == false ||
			'quantity' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'No se han proporcionado todos los campos',
			});
		}
		const owner_id = req.session['user']!._id;
		const product = { ...req.body, owner_id } as Product;
		if (
			product.name.trim().length === 0 ||
			product.description.trim().length === 0 ||
			product.providers.length === 0 ||
			product.categories.length === 0 ||
			product.sku.trim().length === 0 ||
			product.product_code.trim().length === 0 ||
			product.public_price.trim().length === 0 ||
			product.unit_price.trim().length === 0 ||
			product.profit.trim().length === 0 ||
			product.quantity.trim().length === 0
		) {
			return res.json({
				ok: false,
				message: 'Hay campos sin completar',
			});
		}
		try {
			const alreadyExist = await this.productService.findOne(product);
			if (alreadyExist) {
				return res.json({
					ok: false,
					message: 'Ya existe un producto con este nombre',
				});
			}
			const new_product = await this.productService.create(product);
			if (new_product) {
				return res.json({
					ok: true,
					message: 'Producto creado correctamente',
					new_product,
				});
			}
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async update(req: Request, res: Response) {
		if (
			'name' in req.body == false ||
			'description' in req.body == false ||
			'providers' in req.body == false ||
			'categories' in req.body == false ||
			'sku' in req.body == false ||
			'product_code' in req.body == false ||
			'public_price' in req.body == false ||
			'unit_price' in req.body == false ||
			'profit' in req.body == false ||
			'quantity' in req.body == false
		) {
			return res.json({
				ok: false,
				message: 'No se han proporcionado todos los campos',
			});
		}
		const owner_id = req.session['user']!._id;
		const product = { ...req.body, owner_id } as Product;
		if (
			product.name.trim().length === 0 ||
			product.description.trim().length === 0 ||
			product.providers.length === 0 ||
			product.categories.length === 0 ||
			product.sku.trim().length === 0 ||
			product.product_code.trim().length === 0 ||
			product.public_price.trim().length === 0 ||
			product.unit_price.trim().length === 0 ||
			product.profit.trim().length === 0 ||
			product.quantity.trim().length === 0
		) {
			return res.json({
				ok: false,
				message: 'Hay campos sin completar',
			});
		}
		try {
			const updated_product = await this.productService.update(product);
			if (!updated_product || updated_product === 0) {
				return res.json({
					ok: false,
					message: 'El producto no existe o ya fue eliminado',
				});
			}
			return res.json({
				ok: true,
				message: 'Producto actualizado',
			});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const product_deleted = await this.productService.delete(id);
			if (!product_deleted) {
				return res.json({
					ok: false,
					message: 'El producto no existe o ya fue eliminado',
				});
			}
			return res.json({
				ok: true,
				message: 'Producto eliminado',
			});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async listTable(req: Request, res: Response) {
		const { page, s } = req.query;
		const products = await this.productService.findAll(
			req.session['user']!._id,
			Number(page),
			String(s)
		);
		const count = await this.productService.countAll(req.session['user']!._id, String(s));
		if (!products) {
			return res.json({
				ok: false,
				message: 'Error en la consulta a base de datos',
			});
		}
		let noProducts = false;
		if (products.length === 0) {
			noProducts = true;
		}
		res.render('productTable', { layout: false, products, noProducts, count }, (err, html) => {
			if (err) {
				return res.json({
					ok: false,
					error: err.message,
					message: 'Ha ocurrido un error al obtener la vista',
				});
			}
			return res.json({
				ok: true,
				message: 'Vista cargada',
				html,
				count,
			});
		});
	}

	async findOneById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const provider = await this.productService.findOneById(id);
			if (!provider) {
				return res.json({
					ok: false,
					message: 'No se ha encontrado el producto',
				});
			}
			return res.json({
				ok: true,
				message: 'Producto encontrado',
				provider,
			});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async createCSV(req: Request, res: Response) {
		if ('file' in req == false) {
			return res.json({
				ok: false,
				message: 'No se ha proporcionado archivo CSV',
			});
		}
		if (req['file']!.mimetype.includes('csv') == false) {
			return res.json({
				ok: false,
				message: 'El formato de archivo no es CSV',
			});
		}
		const buffer_file = req['file']!.path;
		const productCSV = await this.productService.convertCSVinObject(buffer_file);
		if (!productCSV) {
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (productCSV.length == 0) {
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(productCSV[0]);
		if (
			columns.includes('nombre') &&
			columns.includes('descripcion') &&
			columns.includes('sku') &&
			columns.includes('codigo') &&
			columns.includes('precio_publico') &&
			columns.includes('precio_unidad') &&
			columns.includes('ganancia') &&
			columns.includes('cantidad') &&
			columns.includes('fecha') &&
			columns.includes('proveedores') &&
			columns.includes('categorias')
		) {
			productCSV.forEach(async (product) => {
				const {
					nombre,
					descripcion,
					precio_publico,
					precio_unidad,
					sku,
					codigo,
					cantidad,
					categorias,
					proveedores,
					ganancia,
					fecha,
				} = product;

				const categories = categorias.split(',');
				const providers = proveedores.split(',');

				if (categories.length === 0 || providers.length === 0) {
					return res.json({
						ok: false,
						message: 'Las columnas "proveedores" y "categorias" no pueden estar vacías',
					});
				}

				const newProduct = {
					name: nombre,
					description: descripcion,
					public_price: precio_publico,
					unit_price: precio_unidad,
					sku,
					product_code: codigo,
					quantity: cantidad,
					profit: ganancia,
					categories,
					providers,
					created_at: fecha === '' ? new Date() : fecha,
					updated_at: fecha === '' ? new Date() : fecha,
					deleted_at: null,
					owner_id: req.session['user']!._id,
				} as Product;
				await this.productService.create(newProduct);
			});
			return res.json({
				ok: true,
				message: 'Productos creados',
			});
		}
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
