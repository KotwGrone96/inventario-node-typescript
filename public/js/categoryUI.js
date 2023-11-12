import { loading } from '/js/helpers/loader.js';
import {
	postRequest,
	deleteRequest,
	getRequest,
	putRequest,
	postRequestFormData,
} from '/js/helpers/request.js';

let total_categories = 0;
const handlePaginationButtons = () => {
	const pagination_btns = document.querySelectorAll('#pagination button');
	pagination_btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			getCategoryTable(Number(btn.dataset.skip));
		});
	});
};
const addEventToBtns = () => {
	const action_btns = document.querySelectorAll('.action-buttons button');
	action_btns.forEach((btn) => {
		btn.addEventListener('click', () => handleActionBtns(btn));
	});
};

const add_item = async () => {
	const { value: formValues } = await Swal.fire({
		title: 'Crear categoría',
		confirmButtonText: 'Crear',
		confirmButtonColor: '#2c73d2',
		showCloseButton: true,
		html: '<input placeholder="Nombre *" id="swal-category_name" class="swal2-input">',
		focusConfirm: false,
		preConfirm: () => {
			return [document.getElementById('swal-category_name').value];
		},
	});
	if (!formValues) return;
	const [name, address, phone, email] = formValues;
	const body = { name, address, phone, email };
	const res = await postRequest('/category/create', body);
	if (res.ok) {
		await getCategoryTable();
		return Swal.fire({
			icon: 'success',
			text: res.message,
			background: '#4caf50',
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true,
			color: '#ffffff',
		});
	}
	return Swal.fire({
		icon: 'error',
		text: res.message,
		confirmButtonColor: '#2c73d2',
	});
};

const handleActionBtns = async (btn) => {
	if (btn.classList.contains('delete')) {
		const { row_id } = btn.dataset;
		const choice = await Swal.fire({
			title: '¿Desea eliminar la categoría?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#2c73d2',
			cancelButtonColor: '#d81515',
		});
		if (choice.isConfirmed) {
			const res = await deleteRequest(`/category/${row_id}`);
			if (res.ok) {
				await getCategoryTable();
				return Swal.fire({
					icon: 'success',
					text: res.message,
					background: '#4caf50',
					toast: true,
					position: 'bottom-end',
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					color: '#ffffff',
				});
			}
		}
	}
	if (btn.classList.contains('edit')) {
		const { row_id } = btn.dataset;
		const data = await getRequest(`/category/${row_id}`);
		if (!data.ok) {
			return Swal.fire({
				icon: 'error',
				text: data.message,
				confirmButtonColor: '#2c73d2',
			});
		}
		const { category } = data;
		const { value: formValues } = await Swal.fire({
			title: 'Editar categoría',
			confirmButtonText: 'Guardar',
			confirmButtonColor: '#2c73d2',
			showCloseButton: true,
			html: `<input placeholder="Nombre *" id="swal-category_name" class="swal2-input" value="${category.name}">`,
			focusConfirm: false,
			preConfirm: () => {
				return [document.getElementById('swal-category_name').value];
			},
		});
		if (!formValues) return;
		const [name] = formValues;
		const body = { name, _id: row_id };
		const res = await putRequest('/category/update', body);
		if (res.ok) {
			await getCategoryTable();
			return Swal.fire({
				icon: 'success',
				text: res.message,
				background: '#4caf50',
				toast: true,
				position: 'bottom-end',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				color: '#ffffff',
			});
		}
	}
};

const getCategoryTable = async (page = 0) => {
	const input = document.getElementById('category_name');
	loading('category-table-container');
	const { value } = input;
	try {
		const res = await fetch(`/category/table?page=${page}&s=${value}`);
		const data = await res.json();
		if (!data.ok) {
			console.log(data);
			return Swal.fire({
				icon: 'error',
				text: res.message,
				confirmButtonColor: '#2c73d2',
			});
		}
		const table_container = document.querySelector('.main-table');
		const pagination_container = document.getElementById('pagination');
		total_categories = data.count;
		table_container.innerHTML = data.html;
		let pagination_btns = '';
		for (let index = 0; index < total_categories / 20; index++) {
			pagination_btns += `<button data-skip="${index * 20}" ${
				page == index * 20 ? 'class="active"' : ''
			}>${index + 1}</button>`;
		}
		pagination_container.innerHTML = pagination_btns;
		addEventToBtns();
		handlePaginationButtons();
	} catch (error) {
		console.log(error);
	}
};

const handleCSVfile = async () => {
	const choice = await Swal.fire({
		title: 'Carga masiva',
		icon: 'info',
		html: `Para cargar varias categorías utilice un <b>archivo CSV</b>.<br/>
				El mismo debe tener las siguiente columnas "<b>nombre</b>", "<b>fecha</b>".<br/>
				La columna "<b>nombre</b>" es un valor obligatorio.`,
		showCloseButton: true,
		showCancelButton: true,
		focusConfirm: true,
		confirmButtonText: 'Importar',
		cancelButtonText: 'Cancelar',
		confirmButtonColor: '#2c73d2',
		cancelButtonColor: '#d81515',
	});
	const { isConfirmed } = choice;
	if (!isConfirmed) return;
	const inputFile = document.createElement('input');
	inputFile.type = 'file';
	inputFile.accept = '.csv';
	inputFile.click();

	inputFile.addEventListener('change', async (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;
		if (selectedFile.type.includes('csv') == false) {
			return Swal.fire({
				icon: 'error',
				text: 'Debe seleccionar un archivo CSV',
				confirmButtonColor: '#2c73d2',
			});
		}
		const formData = new FormData();
		formData.append('csvFile', selectedFile);
		const data = await postRequestFormData('/category/create/csv', formData);
		if (data.ok) {
			await getCategoryTable();
			return Swal.fire({
				icon: 'success',
				text: data.message,
				background: '#4caf50',
				toast: true,
				position: 'bottom-end',
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				color: '#ffffff',
			});
		}
		return Swal.fire({
			icon: 'error',
			text: data.message,
			confirmButtonColor: '#2c73d2',
		});
	});
};

const searchCategories = (evt) => {
	evt.preventDefault();
	getCategoryTable();
};

window.addEventListener('DOMContentLoaded', () => {
	const btn_add_category = document.getElementById('add_btn');
	const btn_add_csv_btn = document.getElementById('add_csv_btn');
	const search_form = document.getElementById('search_category');
	btn_add_category.addEventListener('click', () => add_item());
	btn_add_csv_btn.addEventListener('click', () => handleCSVfile());
	search_form.addEventListener('submit', (evt) => searchCategories(evt));
	getCategoryTable();
});
