import { postRequest } from '/js/helpers/request.js';

const handleFormView = () => {
	const btns_change = document.querySelectorAll('.change_auth_form');
	btns_change.forEach((btn) => {
		btn.addEventListener('click', () => {
			if (btn.id == 'register_button') {
				const none_view = document.querySelector('.login-main-content');
				none_view.style.display = 'none';
				const view = document.querySelector('.register-main-content');
				view.style.display = 'block';
			}
			if (btn.id == 'login_button') {
				const none_view = document.querySelector('.register-main-content');
				none_view.style.display = 'none';
				const view = document.querySelector('.login-main-content');
				view.style.display = 'block';
			}
		});
	});
};

const handleSubmit = async (evt) => {
	evt.preventDefault();
	const form = evt.target;
	const formData = new FormData(form);
	const { type } = form.dataset;
	let body = {};
	if (type == 'login') {
		const username = formData.get('username');
		const password = formData.get('password');
		body = { ...body, username, password };
	}
	if (type == 'register') {
		const name = formData.get('name');
		const lastname = formData.get('lastname');
		const username = formData.get('register_username');
		const email = formData.get('email');
		const phone = formData.get('phone');
		const password = formData.get('register_password');
		const repeat_pass = formData.get('repeat_pass');
		const id_num = formData.get('id_num');

		if (password != repeat_pass) {
			return window.alert('Las contraseñas no son iguales');
		}
		body = { ...body, name, lastname, username, email, phone, password, repeat_pass, id_num };
	}
	console.log(body);
	const data = await postRequest(`/${type}`, body);
	if (!data.ok) {
		return window.alert(data.message);
	}
	const url_target = window.location.origin;
	if (type == 'register') {
		return (window.location.href = `${url_target}/login`);
	}
	if (type == 'login') {
		return (window.location.href = url_target);
	}
};

window.addEventListener('DOMContentLoaded', () => {
	handleFormView();
	const forms = document.querySelectorAll('form');
	forms.forEach((form) => {
		form.addEventListener('submit', handleSubmit);
	});
});
