import { ProductDB } from '../db/db';
import { Product } from '../models/Product.model';
import { createReadStream, PathLike } from 'fs';
import csv from 'csv-parser';

interface productCSV {
	nombre: string;
	descripcion: string;
	sku: string;
	codigo: string;
	precio_publico: string;
	precio_unidad: string;
	ganancia: string;
	cantidad: string;
	fecha: string;
	proveedores: string;
	categorias: string;
}

export default class ProductService {
	create(product: Product): Promise<Product | null> {
		const {
			name,
			created_at,
			owner_id,
			description,
			providers,
			categories,
			product_code,
			sku,
			profit,
			public_price,
			unit_price,
			quantity,
			image,
		} = product;
		return new Promise((resolve, reject) => {
			ProductDB.insert(
				{
					name,
					owner_id,
					description,
					product_code,
					sku,
					providers,
					categories,
					profit,
					public_price,
					unit_price,
					quantity,
					image,
					created_at: created_at || new Date(),
					updated_at: created_at || new Date(),
					deleted_at: null,
				},
				(err, doc) => {
					if (err) {
						return reject(null);
					}
					return resolve(doc);
				}
			);
		});
	}

	update(product: Product): Promise<number | null> {
		const {
			_id,
			name,
			owner_id,
			description,
			providers,
			categories,
			sku,
			product_code,
			profit,
			public_price,
			quantity,
			unit_price,
			image,
		} = product;
		return new Promise((resolve, reject) => {
			ProductDB.update(
				{
					_id,
					deleted_at: null,
					owner_id,
				},
				{
					$set: {
						name,
						description,
						providers,
						categories,
						sku,
						product_code,
						profit,
						public_price,
						quantity,
						unit_price,
						image,
						updated_at: new Date(),
					},
				},
				{ multi: true },
				(err, numberOfUpdated) => {
					if (err) {
						return reject(null);
					}
					return resolve(numberOfUpdated);
				}
			);
		});
	}

	delete(_id: string): Promise<number | null> {
		return new Promise((resolve, reject) => {
			ProductDB.update(
				{ _id, deleted_at: null },
				{ $set: { deleted_at: new Date() } },
				{ multi: true },
				(err, numberOfUpdated) => {
					if (err) {
						return reject(null);
					}
					return resolve(numberOfUpdated);
				}
			);
		});
	}

	countAll(owner_id: string, s: string): Promise<null | number> {
		const regExp = new RegExp(s, 'i');
		return new Promise((resolve, reject) => {
			ProductDB.count(
				{ owner_id, deleted_at: null, name: s === '' ? { $regex: /./ } : { $regex: regExp } },
				(err, docs) => {
					if (err) {
						return reject(null);
					}
					return resolve(docs);
				}
			);
		});
	}

	findAll(owner_id: string, skip: number, s: string): Promise<null | Product[]> {
		const regExp = new RegExp(s, 'i');
		return new Promise((resolve, reject) => {
			ProductDB.find({
				owner_id,
				deleted_at: null,
				name: s === '' ? { $regex: /./ } : { $regex: regExp },
			})
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(20)
				.exec((err: Error | null, docs: Product[]) => {
					if (err) {
						return reject(null);
					}
					return resolve(docs);
				});
		});
	}

	findOne(product: Product): Promise<Product | boolean | null> {
		const { name, owner_id } = product;
		return new Promise((resolve, reject) => {
			ProductDB.findOne({ $and: [{ name }, { owner_id }, { deleted_at: null }] }, (err, doc) => {
				if (err) {
					return reject(null);
				}
				if (!doc) {
					return resolve(false);
				}
				return resolve(doc);
			});
		});
	}

	findOneById(_id: string): Promise<Product | boolean | null> {
		return new Promise((resolve, reject) => {
			ProductDB.findOne({ _id, deleted_at: null }, (err, doc) => {
				if (err) {
					return reject(null);
				}
				if (!doc) {
					return resolve(false);
				}
				return resolve(doc);
			});
		});
	}

	convertCSVinObject(buffer_file: PathLike): Promise<null | productCSV[]> {
		return new Promise((resolve, reject) => {
			const result: productCSV[] = [];
			createReadStream(buffer_file)
				.pipe(csv())
				.on('data', (chuck: productCSV) => {
					result.push(chuck);
				})
				.on('end', () => {
					return resolve(result);
				})
				.on('error', () => {
					return reject(null);
				});
		});
	}
}
