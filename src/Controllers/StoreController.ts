import { Store } from '../models/Store.model';
import { Request, Response } from 'express';
import StoreService from '../Services/StoreService';

export default class StoreController {
	storeService: StoreService;
	constructor() {
		this.storeService = new StoreService();
	}

	async create(req: Request, res: Response) {
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Debe proporcionar un nombre para la tienda',
			});
		}
		const owner_id = req.session['user']!._id;
		const store = { ...req.body, owner_id } as Store;
		if (store.name.trim().length == 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}

		try {
			const alreadyExist = await this.storeService.findOne(store);
			if (alreadyExist) {
				return res.json({
					ok: false,
					message: 'Ya existe una tienda con este nombre',
				});
			}
			const new_store = await this.storeService.create(store);
			if (new_store) {
				return res.json({
					ok: true,
					message: 'Tienda creada correctamente',
					store,
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

	async listTable(req: Request, res: Response) {
		if ('type' in req.query == false) {
			return res.json({
				ok: false,
				message: 'Debe especificar el tipo de tabla',
			});
		}
		const { type, page } = req.query;
		if (type == 'stores') {
			const stores = await this.storeService.findAll(req.session['user']!._id, Number(page));
			const count = await this.storeService.countAll(req.session['user']!._id);
			if (!stores) {
				return res.json({
					ok: false,
					message: 'Error en la consulta a base de datos',
				});
			}
			let noStores = false;
			if (stores.length === 0) {
				noStores = true;
			}
			res.render('table', { layout: false, stores, noStores, count }, (err, html) => {
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
	}
	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const store_deleted = await this.storeService.delete(id);
			if (!store_deleted) {
				return res.json({
					ok: false,
					message: 'La tienda no existe o ya fue eliminada',
				});
			}
			return res.json({
				ok: true,
				message: 'Tienda eliminada',
			});
		} catch (error) {
			return res.json({
				ok: false,
				message: 'Ha ocurrido un error en el servidor',
				error,
			});
		}
	}

	async findOneById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const store = await this.storeService.findOneById(id);
			if (!store) {
				return res.json({
					ok: false,
					message: 'No se ha encontrado la tienda',
				});
			}
			return res.json({
				ok: true,
				message: 'Tienda encontrada',
				store,
			});
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
				message: 'Debe proporcionar un nombre para la tienda',
			});
		}
		const owner_id = req.session['user']!._id;
		const store = { ...req.body, owner_id } as Store;
		if (store.name.trim().length == 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}
		const updated_store = await this.storeService.update(store);
		if (!updated_store || updated_store === 0) {
			return res.json({
				ok: false,
				message: 'La tienda no existe o ya fue eliminada',
			});
		}
		return res.json({
			ok: true,
			message: 'Tienda actualizada',
		});
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
		const storeCSV = await this.storeService.convertCSVinObject(buffer_file);
		if (!storeCSV) {
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (storeCSV.length == 0) {
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(storeCSV[0]);
		if (
			columns.includes('nombre') &&
			columns.includes('direccion') &&
			columns.includes('telefono') &&
			columns.includes('fecha')
		) {
			storeCSV.forEach(async (store) => {
				const { nombre, direccion, telefono, fecha } = store;
				const newStore = {
					name: nombre,
					address: direccion,
					phone: telefono,
					created_at: fecha === '' ? new Date() : fecha,
					updated_at: fecha === '' ? new Date() : fecha,
					deleted_at: null,
					owner_id: req.session['user']!._id,
				} as Store;
				await this.storeService.create(newStore);
			});
			return res.json({
				ok: true,
				message: 'Tiendas creadas',
			});
		}
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
