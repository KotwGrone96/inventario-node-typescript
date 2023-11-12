export interface Category {
	_id?: string;
	name: string;
	owner_id?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}
