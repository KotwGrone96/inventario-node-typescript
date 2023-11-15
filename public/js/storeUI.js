import {
	postRequest,
	deleteRequest,
	getRequest,
	putRequest,
	postRequestFormData,
} from '/js/helpers/request.js';

import { loading } from '/js/helpers/loader.js';

const add_ites = async (target) => {
	const { type } = target.dataset;
	if (type === 'store') {
		const { value: formValues } = await Swal.fire({
			title: 'Crear tienda',
			confirmButtonText: 'Crear',
			confirmButtonColor: '#2c73d2',
			showCloseButton: true,
			html:
				'<input placeholder="Nombre *" id="swal-store_name" class="swal2-input">' +
				'<input placeholder="Dirección" id="swal-store_address" class="swal2-input">' +
				'<input placeholder="Teléfono" id="swal-store_phone" class="swal2-input">',
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById('swal-store_name').value,
					document.getElementById('swal-store_address').value,
					document.getElementById('swal-store_phone').value,
				];
			},
		});
		if (!formValues) return;
		const [name, address, phone] = formValues;
		const body = { name, address, phone };
		const res = await postRequest('/store/create', body);
		if (res.ok) {
			await getStoreTable();
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
	}
};

const handleActionBtns = async (btn) => {
	if (btn.classList.contains('delete')) {
		const { row_id } = btn.dataset;
		const choice = await Swal.fire({
			title: `¿Desea eliminar la tienda ${btn.dataset.name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#2c73d2',
			cancelButtonColor: '#d81515',
		});
		if (choice.isConfirmed) {
			const res = await deleteRequest(`/store/${row_id}`);
			if (res.ok) {
				await getStoreTable();
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
		const data = await getRequest(`/store/${row_id}`);
		if (!data.ok) {
			return Swal.fire({
				icon: 'error',
				text: data.message,
				confirmButtonColor: '#2c73d2',
			});
		}
		const { store } = data;
		const { value: formValues } = await Swal.fire({
			title: 'Editar tienda',
			confirmButtonText: 'Guardar',
			confirmButtonColor: '#2c73d2',
			showCloseButton: true,
			html:
				`<input placeholder="Nombre *" id="swal-store_name" class="swal2-input" value="${store.name}">` +
				`<input placeholder="Dirección" id="swal-store_address" class="swal2-input" value="${store.address}">` +
				`<input placeholder="Teléfono" id="swal-store_phone" class="swal2-input" value="${store.phone}">`,
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById('swal-store_name').value,
					document.getElementById('swal-store_address').value,
					document.getElementById('swal-store_phone').value,
				];
			},
		});
		if (!formValues) return;
		const [name, address, phone] = formValues;
		const body = { name, address, phone, _id: row_id };
		const res = await putRequest('/store/update', body);
		if (res.ok) {
			await getStoreTable();
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

const addEventToBtns = () => {
	const action_btns = document.querySelectorAll('.action-buttons button');
	action_btns.forEach((btn) => {
		btn.addEventListener('click', () => handleActionBtns(btn));
	});
};

let total_stores = 0;
const handlePaginationButtons = () => {
	const pagination_btns = document.querySelectorAll('#pagination button');
	pagination_btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			getStoreTable(Number(btn.dataset.skip));
		});
	});
};
const getStoreTable = async (page = 0) => {
	const input = document.getElementById('store_name');
	loading('store-table-container');
	const { value } = input;
	try {
		const res = await fetch(`/store/table?type=stores&page=${page}&s=${value}`);
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
		total_stores = data.count;
		table_container.innerHTML = data.html;
		let pagination_btns = '';
		for (let index = 0; index < total_stores / 20; index++) {
			pagination_btns += `<li>
									<button
										data-skip="${index * 20}"
										class='flex items-center justify-center px-4 h-10 leading-tight border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
										${
											page == index * 20
												? 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
												: 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'
										}'>
										${index + 1}
									</button>
								</li>`;
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
		html: `Para cargar varias tiendas utilice un <b>archivo CSV</b>.<br/>
				El mismo debe tener las siguiente columnas "<b>nombre</b>", "<b>direccion</b>", "<b>telefono</b>", "<b>fecha</b>".<br/>
				La columna "<b>nombre</b>" es el único valor obligatorio, el resto de columnas son opcionales.`,
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
		const data = await postRequestFormData('/store/create/csv', formData);
		if (data.ok) {
			await getStoreTable();
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

const searchStores = (evt) => {
	evt.preventDefault();
	getStoreTable();
};

window.addEventListener('DOMContentLoaded', () => {
	const btn_add_store = document.getElementById('add_btn');
	const btn_add_csv_btn = document.getElementById('add_csv_btn');
	const search_form = document.getElementById('search_store');
	btn_add_store.addEventListener('click', () => add_ites(btn_add_store));
	btn_add_csv_btn.addEventListener('click', () => handleCSVfile());
	search_form.addEventListener('submit', (evt) => searchStores(evt));
	getStoreTable();
});
