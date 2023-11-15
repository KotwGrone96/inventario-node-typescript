export interface Product {
	_id?: string;
	name: string;
	description: string;
	providers: string[];
	categories: string[];
	sku: string;
	product_code: string;
	public_price: string;
	unit_price: string;
	profit: string;
	quantity: string;
	image?: string;
	owner_id?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}
