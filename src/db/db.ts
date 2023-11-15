import Datastore from 'nedb';
import { cwd } from 'process';
import { join } from 'path';
import { User } from '../models/User.model';
import { Store } from '../models/Store.model';
import { Provider } from '../models/Provider.model';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';

//Crear una instancia de la base de datos
const UserDB = new Datastore<User>({
	filename: join(cwd(), 'Database', 'User.db'),
	autoload: true,
});
const StoreDB = new Datastore<Store>({
	filename: join(cwd(), 'Database', 'Store.db'),
	autoload: true,
});
const ProductDB = new Datastore<Product>({
	filename: join(cwd(), 'Database', 'Product.db'),
	autoload: true,
});
const CategoryDB = new Datastore<Category>({
	filename: join(cwd(), 'Database', 'Category.db'),
	autoload: true,
});
const ProviderDB = new Datastore<Provider>({
	filename: join(cwd(), 'Database', 'Provider.db'),
	autoload: true,
});

export { UserDB, StoreDB, ProductDB, CategoryDB, ProviderDB };

// Insertar datos en la base de datos
// db.insert({ name: 'Ejemplo', age: 30 }, (err, newDoc) => {
// 	if (err) {
// 		console.error('Error al insertar datos:', err);
// 	} else {
// 		console.log('Nuevo documento insertado:', newDoc);
// 	}
// });

// Consultar datos en la base de datos
// db.find({ name: 'Ejemplo' }, (err: Error, docs: []) => {
// 	if (err) {
// 		console.error('Error al consultar datos:', err);
// 	} else {
// 		console.log('Documentos encontrados:', docs);
// 	}
// });
