export interface Provider {
	_id?: string;
	name: string;
	address?: string;
	phone?: string;
	email?: string;
	owner_id?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date | null;
}
