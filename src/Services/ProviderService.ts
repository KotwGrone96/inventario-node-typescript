import { ProviderDB } from '../db/db';
import { Provider } from '../models/Provider.model';
import { createReadStream, PathLike } from 'fs';
import csv from 'csv-parser';

interface providerCSV {
	nombre: string;
	direccion: string;
	telefono: string;
	fecha: string;
	correo: string;
}

export default class ProviderService {
	create(provider: Provider): Promise<Provider | null> {
		const { name, address, email, phone, created_at, owner_id } = provider;
		return new Promise((resolve, reject) => {
			ProviderDB.insert(
				{
					name,
					address,
					email,
					phone,
					owner_id,
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

	findOne(provider: Provider): Promise<Provider | boolean | null> {
		const { name, owner_id } = provider;
		return new Promise((resolve, reject) => {
			ProviderDB.findOne({ $and: [{ name }, { owner_id }, { deleted_at: null }] }, (err, doc) => {
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

	findOneById(_id: string): Promise<Provider | boolean | null> {
		return new Promise((resolve, reject) => {
			ProviderDB.findOne({ _id, deleted_at: null }, (err, doc) => {
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

	findAll(owner_id: string, skip: number, s: string): Promise<null | Provider[]> {
		const regExp = new RegExp(s, 'i');
		return new Promise((resolve, reject) => {
			ProviderDB.find({
				owner_id,
				deleted_at: null,
				name: s === '' ? { $regex: /./ } : { $regex: regExp },
			})
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(20)
				.exec((err: Error | null, docs: Provider[]) => {
					if (err) {
						return reject(null);
					}
					return resolve(docs);
				});
		});
	}

	countAll(owner_id: string, s: string): Promise<null | number> {
		const regExp = new RegExp(s, 'i');
		return new Promise((resolve, reject) => {
			ProviderDB.count(
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

	delete(_id: string): Promise<number | null> {
		return new Promise((resolve, reject) => {
			ProviderDB.update(
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

	update(provider: Provider): Promise<number | null> {
		const { _id, name, owner_id, address, phone, email } = provider;
		return new Promise((resolve, reject) => {
			ProviderDB.update(
				{
					_id,
					deleted_at: null,
					owner_id,
				},
				{
					$set: {
						name,
						address,
						phone,
						email,
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

	convertCSVinObject(buffer_file: PathLike): Promise<null | providerCSV[]> {
		return new Promise((resolve, reject) => {
			const result: providerCSV[] = [];
			createReadStream(buffer_file)
				.pipe(csv())
				.on('data', (chuck: providerCSV) => {
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
