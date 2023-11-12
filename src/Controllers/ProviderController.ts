import { Request, Response } from 'express';
import { Provider } from '../models/Provider.model';
import ProviderService from '../Services/ProviderService';

export default class ProviderController {
	providerService: ProviderService;
	constructor() {
		this.providerService = new ProviderService();
	}

	async create(req: Request, res: Response) {
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Debe proporcionar un nombre para el proveedor',
			});
		}
		const owner_id = req.session['user']!._id;
		const provider = { ...req.body, owner_id } as Provider;
		if (provider.name.trim().length === 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}
		try {
			const alreadyExist = await this.providerService.findOne(provider);
			if (alreadyExist) {
				return res.json({
					ok: false,
					message: 'Ya existe una tienda con este nombre',
				});
			}
			const new_provider = await this.providerService.create(provider);
			if (new_provider) {
				return res.json({
					ok: true,
					message: 'Proveedor creado correctamente',
					new_provider,
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
		const { page, s } = req.query;
		const providers = await this.providerService.findAll(
			req.session['user']!._id,
			Number(page),
			String(s)
		);
		const count = await this.providerService.countAll(req.session['user']!._id, String(s));
		if (!providers) {
			return res.json({
				ok: false,
				message: 'Error en la consulta a base de datos',
			});
		}
		let noProviders = false;
		if (providers.length === 0) {
			noProviders = true;
		}
		res.render('providerTable', { layout: false, providers, noProviders, count }, (err, html) => {
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

	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const provider_deleted = await this.providerService.delete(id);
			if (!provider_deleted) {
				return res.json({
					ok: false,
					message: 'El proveedor no existe o ya fue eliminado',
				});
			}
			return res.json({
				ok: true,
				message: 'Proveedor eliminado',
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
			const provider = await this.providerService.findOneById(id);
			if (!provider) {
				return res.json({
					ok: false,
					message: 'No se ha encontrado el proveedor',
				});
			}
			return res.json({
				ok: true,
				message: 'Proveedor encontrado',
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

	async update(req: Request, res: Response) {
		if ('name' in req.body == false) {
			return res.json({
				ok: false,
				message: 'Debe proporcionar un nombre para el proveedor',
			});
		}
		const owner_id = req.session['user']!._id;
		const provider = { ...req.body, owner_id } as Provider;
		if (provider.name.trim().length == 0) {
			return res.json({
				ok: false,
				message: 'Debe completar el campo "Nombre"',
			});
		}
		const updated_provider = await this.providerService.update(provider);
		if (!updated_provider || updated_provider === 0) {
			return res.json({
				ok: false,
				message: 'El proveedor no existe o ya fue eliminado',
			});
		}
		return res.json({
			ok: true,
			message: 'Proveedor actualizado',
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
		const providerCSV = await this.providerService.convertCSVinObject(buffer_file);
		if (!providerCSV) {
			return res.json({
				ok: false,
				message: 'Error al cargar el archivo CSV',
			});
		}
		if (providerCSV.length == 0) {
			return res.json({
				ok: false,
				message: 'No hay registros para agregar',
			});
		}
		const columns = Object.keys(providerCSV[0]);
		if (
			columns.includes('nombre') &&
			columns.includes('direccion') &&
			columns.includes('telefono') &&
			columns.includes('fecha') &&
			columns.includes('correo')
		) {
			providerCSV.forEach(async (provider) => {
				const { nombre, direccion, telefono, fecha, correo } = provider;
				const newProvider = {
					name: nombre,
					address: direccion,
					phone: telefono,
					email: correo,
					created_at: fecha === '' ? new Date() : fecha,
					updated_at: fecha === '' ? new Date() : fecha,
					deleted_at: null,
					owner_id: req.session['user']!._id,
				} as Provider;
				await this.providerService.create(newProvider);
			});
			return res.json({
				ok: true,
				message: 'Proveedores creados',
			});
		}
		return res.json({
			ok: false,
			message: 'Faltan columnas en el CSV o no tienen el nombre correcto',
		});
	}
}
