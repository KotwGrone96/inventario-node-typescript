import { Store } from '../models/Store.model';
import { StoreDB } from '../db/db';
import { createReadStream, PathLike } from 'fs';
import csv from 'csv-parser';

interface storeCSV {
	nombre: string;
	direccion: string;
	telefono: string;
	fecha: string;
}

export default class StoreService {
	create(store: Store): Promise<Store | null> {
		const { name, owner_id, address, phone, created_at } = store;
		return new Promise((resolve, reject) => {
			StoreDB.insert(
				{
					name,
					owner_id,
					address,
					phone,
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

	findOne(store: Store): Promise<Store | boolean | null> {
		const { name, owner_id } = store;
		return new Promise((resolve, reject) => {
			StoreDB.findOne({ $and: [{ name }, { owner_id }, { deleted_at: null }] }, (err, doc) => {
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

	findOneById(_id: string): Promise<Store | boolean | null> {
		return new Promise((resolve, reject) => {
			StoreDB.findOne({ _id, deleted_at: null }, (err, doc) => {
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

	findAll(owner_id: string, skip: number): Promise<null | Store[]> {
		return new Promise((resolve, reject) => {
			StoreDB.find({ owner_id, deleted_at: null })
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(20)
				.exec((err: Error | null, docs: Store[]) => {
					if (err) {
						return reject(null);
					}
					return resolve(docs);
				});
		});
	}

	countAll(owner_id: string): Promise<null | number> {
		return new Promise((resolve, reject) => {
			StoreDB.count({ owner_id, deleted_at: null }, (err, docs) => {
				if (err) {
					return reject(null);
				}
				return resolve(docs);
			});
		});
	}

	delete(_id: string): Promise<number | null> {
		return new Promise((resolve, reject) => {
			StoreDB.update(
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

	update(store: Store): Promise<number | null> {
		const { _id, name, owner_id, address, phone } = store;
		return new Promise((resolve, reject) => {
			StoreDB.update(
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
	convertCSVinObject(buffer_file: PathLike): Promise<null | storeCSV[]> {
		return new Promise((resolve, reject) => {
			const result: storeCSV[] = [];
			createReadStream(buffer_file)
				.pipe(csv())
				.on('data', (chuck: storeCSV) => {
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
