import { CategoryDB } from '../db/db';
import { Category } from '../models/Category.model';
import { createReadStream, PathLike } from 'fs';
import csv from 'csv-parser';
interface categoryCSV {
	nombre: string;
	fecha: string;
}

export default class CategoryService {
	create(category: Category): Promise<Category | null> {
		const { name, created_at, owner_id } = category;
		return new Promise((resolve, reject) => {
			CategoryDB.insert(
				{
					name,
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

	findOne(category: Category): Promise<Category | boolean | null> {
		const { name, owner_id } = category;
		return new Promise((resolve, reject) => {
			CategoryDB.findOne({ $and: [{ name }, { owner_id }, { deleted_at: null }] }, (err, doc) => {
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

	findOneById(_id: string): Promise<Category | boolean | null> {
		return new Promise((resolve, reject) => {
			CategoryDB.findOne({ _id, deleted_at: null }, (err, doc) => {
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

	findAll(owner_id: string, skip: number, s: string): Promise<null | Category[]> {
		const regExp = new RegExp(s, 'i');
		return new Promise((resolve, reject) => {
			CategoryDB.find({
				owner_id,
				deleted_at: null,
				name: s === '' ? { $regex: /./ } : { $regex: regExp },
			})
				.sort({ created_at: -1 })
				.skip(skip)
				.limit(20)
				.exec((err: Error | null, docs: Category[]) => {
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
			CategoryDB.count(
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
			CategoryDB.update(
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

	update(category: Category): Promise<number | null> {
		const { _id, name, owner_id } = category;
		return new Promise((resolve, reject) => {
			CategoryDB.update(
				{
					_id,
					deleted_at: null,
					owner_id,
				},
				{
					$set: {
						name,
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

	convertCSVinObject(buffer_file: PathLike): Promise<null | categoryCSV[]> {
		return new Promise((resolve, reject) => {
			const result: categoryCSV[] = [];
			createReadStream(buffer_file)
				.pipe(csv())
				.on('data', (chuck: categoryCSV) => {
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
