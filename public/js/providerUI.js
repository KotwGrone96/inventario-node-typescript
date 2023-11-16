import { loading } from '/js/helpers/loader.js';
import {
	postRequest,
	deleteRequest,
	getRequest,
	putRequest,
	postRequestFormData,
} from '/js/helpers/request.js';

let total_providers = 0;
const handlePaginationButtons = () => {
	const pagination_btns = document.querySelectorAll('#pagination button');
	pagination_btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			getProviderTable(Number(btn.dataset.skip));
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
		title: 'Crear proveedor',
		confirmButtonText: 'Crear',
		confirmButtonColor: '#2c73d2',
		showCloseButton: true,
		html:
			'<input placeholder="Nombre *" id="swal-provider_name" class="swal2-input">' +
			'<input placeholder="Dirección" id="swal-provider_address" class="swal2-input">' +
			'<input placeholder="Teléfono" id="swal-provider_phone" class="swal2-input">' +
			'<input placeholder="Correo" id="swal-provider_email" class="swal2-input">',
		focusConfirm: false,
		preConfirm: () => {
			return [
				document.getElementById('swal-provider_name').value,
				document.getElementById('swal-provider_address').value,
				document.getElementById('swal-provider_phone').value,
				document.getElementById('swal-provider_email').value,
			];
		},
	});
	if (!formValues) return;
	const [name, address, phone, email] = formValues;
	const body = { name, address, phone, email };
	const res = await postRequest('/provider/create', body);
	if (res.ok) {
		await getProviderTable();
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
			title: `¿Desea eliminar el proveedor ${btn.dataset.name}?`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'Cancelar',
			confirmButtonColor: '#2c73d2',
			cancelButtonColor: '#d81515',
		});
		if (choice.isConfirmed) {
			const res = await deleteRequest(`/provider/${row_id}`);
			if (res.ok) {
				await getProviderTable();
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
		const data = await getRequest(`/provider/${row_id}`);
		if (!data.ok) {
			return Swal.fire({
				icon: 'error',
				text: data.message,
				confirmButtonColor: '#2c73d2',
			});
		}
		const { provider } = data;
		const { value: formValues } = await Swal.fire({
			title: 'Editar proveedor',
			confirmButtonText: 'Guardar',
			confirmButtonColor: '#2c73d2',
			showCloseButton: true,
			html:
				`<input placeholder="Nombre *" id="swal-provider_name" class="swal2-input" value="${provider.name}">` +
				`<input placeholder="Dirección" id="swal-provider_address" class="swal2-input" value="${provider.address}">` +
				`<input placeholder="Teléfono" id="swal-provider_phone" class="swal2-input" value="${provider.phone}">` +
				`<input placeholder="Correo" id="swal-provider_email" class="swal2-input" value="${provider.email}">`,
			focusConfirm: false,
			preConfirm: () => {
				return [
					document.getElementById('swal-provider_name').value,
					document.getElementById('swal-provider_address').value,
					document.getElementById('swal-provider_phone').value,
					document.getElementById('swal-provider_email').value,
				];
			},
		});
		if (!formValues) return;
		const [name, address, phone, email] = formValues;
		const body = { name, address, phone, _id: row_id, email };
		const res = await putRequest('/provider/update', body);
		if (res.ok) {
			await getProviderTable();
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

const getProviderTable = async (page = 0) => {
	const input = document.getElementById('provider_name');
	loading('provider-table-container');
	const { value } = input;
	try {
		const res = await fetch(`/provider/table?page=${page}&s=${value}`);
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
		total_providers = data.count;
		table_container.innerHTML = data.html;
		let pagination_btns = '';
		for (let index = 0; index < total_providers / 20; index++) {
			// pagination_btns += `<button data-skip="${index * 20}" ${
			// 	page == index * 20 ? 'class="active"' : ''
			// }>${index + 1}</button>`;
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
		html: `Para cargar varios proveedores utilice un <b>archivo CSV</b>.<br/>
				El mismo debe tener las siguiente columnas "<b>nombre</b>", "<b>direccion</b>", "<b>telefono</b>", "<b>fecha</b>" "<b>email</b>".<br/>
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
		const data = await postRequestFormData('/provider/create/csv', formData);
		if (data.ok) {
			await getProviderTable();
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

const searchProviders = (evt) => {
	evt.preventDefault();
	getProviderTable();
};

window.addEventListener('DOMContentLoaded', () => {
	const btn_add_provider = document.getElementById('add_btn');
	const btn_add_csv_btn = document.getElementById('add_csv_btn');
	const search_form = document.getElementById('search_provider');
	btn_add_provider.addEventListener('click', () => add_item());
	btn_add_csv_btn.addEventListener('click', () => handleCSVfile());
	search_form.addEventListener('submit', (evt) => searchProviders(evt));
	getProviderTable();
});
