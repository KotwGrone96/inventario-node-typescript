import { getRequest } from '/js/helpers/request.js';

const newListItem = (item) => {
	return `<div class='flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600'>
								<input
									id='${item._id}'
									type='checkbox'
									value=''
									class='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
								/>
								<label
									for='${item._id}'
									class='w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300'
								>${item.name}</label>
							</div>`;
};

const handleSubmit = (evt) => {
	evt.preventDefault();
};

const initialData = async () => {
	const providerData = await getRequest('/provider/findAll');
	const categoryData = await getRequest('/category/findAll');

	if (providerData.noProviders || categoryData.noCategories) {
		const addProductContainer = document.getElementById('addProductContainer');
		addProductContainer.innerHTML =
			'<p class="p-4 text-gray-500 font-semibold">Para crear un nuevo producto primero debe crear al menos un <a class="text-blue-600" href="/proveedores">proveedor</a> y una <a class="text-blue-600" href="/categorias">categoría</a></p>';
		return;
	}

	const providerDropDown = document.getElementById('dropDownProviderList');
	providerData.providers.forEach((provider) => {
		const item = newListItem(provider);
		const li = document.createElement('li');
		li.innerHTML = item;
		providerDropDown.append(li);
	});

	const categoryDropDown = document.getElementById('dropDownCategoryList');
	categoryData.categories.forEach((category) => {
		const item = newListItem(category);
		const li = document.createElement('li');
		li.innerHTML = item;
		categoryDropDown.append(li);
	});
};

const dinamicProfit = () => {
	const unit_price_input = document.getElementById('unit_price');
	const profit_input = document.getElementById('profit');
	const public_price_input = document.getElementById('public_price');
	const earning_input = document.getElementById('earning');

	unit_price_input.addEventListener('change', (evt) => {
		const unit_price = Number(evt.target.value);
		const profit_porcent = Number(profit_input.value);
		const profit = unit_price * (profit_porcent / 100);
		public_price_input.value = parseFloat(unit_price + profit).toFixed(2);
		earning_input.value = parseFloat(public_price_input.value - unit_price).toFixed(2);
	});
	unit_price_input.addEventListener('keyup', (evt) => {
		const unit_price = Number(evt.target.value);
		const profit_porcent = Number(profit_input.value);
		const profit = unit_price * (profit_porcent / 100);
		public_price_input.value = parseFloat(unit_price + profit).toFixed(2);
		earning_input.value = parseFloat(public_price_input.value - unit_price).toFixed(2);
	});

	profit_input.addEventListener('change', (evt) => {
		const unit_price = Number(unit_price_input.value);
		const profit_porcent = Number(evt.target.value);
		const profit = unit_price * (profit_porcent / 100);
		public_price_input.value = parseFloat(unit_price + profit).toFixed(2);
		earning_input.value = parseFloat(public_price_input.value - unit_price).toFixed(2);
	});
	profit_input.addEventListener('keyup', (evt) => {
		const unit_price = Number(unit_price_input.value);
		const profit_porcent = Number(evt.target.value);
		const profit = unit_price * (profit_porcent / 100);
		public_price_input.value = parseFloat(unit_price + profit).toFixed(2);
		earning_input.value = parseFloat(public_price_input.value - unit_price).toFixed(2);
	});

	public_price_input.addEventListener('change', (evt) => {
		const unit_price = Number(unit_price_input.value);
		const public_price = Number(evt.target.value);
		const profit = ((public_price - unit_price) / unit_price) * 100;
		profit_input.value = parseFloat(profit).toFixed(2);
		earning_input.value = parseFloat(public_price - unit_price).toFixed(2);
	});

	public_price_input.addEventListener('keyup', (evt) => {
		const unit_price = Number(unit_price_input.value);
		const public_price = Number(evt.target.value);
		const profit = ((public_price - unit_price) / unit_price) * 100;
		profit_input.value = parseFloat(profit).toFixed(2);
		earning_input.value = parseFloat(public_price - unit_price).toFixed(2);
	});
};

window.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('addProductForm');
	form.addEventListener('submit', handleSubmit);
	initialData();
	dinamicProfit();
});
