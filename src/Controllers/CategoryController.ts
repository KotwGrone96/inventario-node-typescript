import { Category } from '../models/Category.model';
import { Request, Response } from 'express';
import CategoryService from '../Services/CategoryService';

export default class CategoryController {
	categoryService: CategoryService;

	constructor() {
		this.categoryService = new CategoryService();
	}

	async create(req: Request, res: Response) {
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Debe proporcionar un nombre para la categoría',
			});
		}
		const owner_id = req.session['user']!._id;
		const category = { ...req.body, owner_id } as Category;
		if (category.name.trim().length === 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}
		try {
			const alreadyExist = await this.categoryService.findOne(category);
			if (alreadyExist) {
				return res.json({
					ok: false,
					message: 'Ya existe una categoría con este nombre',
				});
			}
			const new_category = await this.categoryService.create(category);
			if (new_category) {
				return res.json({
					ok: true,
					message: 'Categoría creada correctamente',
					new_category,
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
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Debe proporcionar un nombre para la categoría',
			});
		}
		const owner_id = req.session['user']!._id;
		const category = { ...req.body, owner_id } as Category;
		if (category.name.trim().length == 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}
		const updated_category = await this.categoryService.update(category);
		if (!updated_category || updated_category === 0) {
			return res.json({
				ok: false,
				message: 'La categoría no existe o ya fue eliminada',
			});
		}
		return res.json({
			ok: true,
			message: 'Categoría actualizada',
		});
	}

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const category_deleted = await this.categoryService.delete(id);
			if (!category_deleted) {
				return res.json({
					ok: false,
					message: 'La categoría no existe o ya fue eliminada',
				});
			}
			return res.json({
				ok: true,
				message: 'Categoría eliminada',
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
		const categories = await this.categoryService.findAll(
			req.session['user']!._id,
			Number(page),
			String(s)
		);
		const count = await this.categoryService.countAll(req.session['user']!._id, String(s));
		if (!categories) {
			return res.json({
				ok: false,
				message: 'Error en la consulta a base de datos',
			});
		}
		let noCategories = false;
		if (categories.length === 0) {
			noCategories = true;
		}
		res.render('categoryTable', { layout: false, categories, noCategories, count }, (err, html) => {
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

	async findAll(req: Request, res: Response) {
		const categories = await this.categoryService.findAllNoLimit(req.session['user']!._id);
		if (!categories) {
			return res.json({
				ok: false,
				message: 'Error en la consulta a base de datos',
			});
		}
		let noCategories = false;
		if (categories.length === 0) {
			noCategories = true;
		}
		return res.json({
			ok: true,
			message: 'Lista de categorías',
			categories,
			noCategories,
		});
	}

	async findOneById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const category = await this.categoryService.findOneById(id);
			if (!category) {
				return res.json({
					ok: false,
					message: 'No se ha encontrado la categoría',
				});
			}
			return res.json({
				ok: true,
				message: 'Categoría encontrada',
				category,
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
		const caategoryCSV = await this.categoryService.convertCSVinObject(buffer_file);
		if (!caategoryCSV) {
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (caategoryCSV.length == 0) {
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(caategoryCSV[0]);
		if (columns.includes('nombre') && columns.includes('fecha')) {
			caategoryCSV.forEach(async (category) => {
				const { nombre, fecha } = category;
				const newCategory = {
					name: nombre,
					created_at: fecha === '' ? new Date() : fecha,
					updated_at: fecha === '' ? new Date() : fecha,
					deleted_at: null,
					owner_id: req.session['user']!._id,
				} as Category;
				await this.categoryService.create(newCategory);
			});
			return res.json({
				ok: true,
				message: 'Categorías creadas',
			});
		}
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
