export interface User {
	_id?: string;
	name: string;
	lastname: string;
	email: string;
	second_email?: string;
	username: string;
	id_num: string;
	phone?: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
	password: string;
}

export interface UserSession {
	id: string;
	name: string;
	lastname: string;
	email: string;
	second_email?: string;
	username: string;
	id_num: string;
	phone?: string;
	created_at?: Date;
}
