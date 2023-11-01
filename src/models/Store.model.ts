export interface Store {
	_id?: string;
	name: string;
	address?: string;
	owner_id: string;
	phone?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}
