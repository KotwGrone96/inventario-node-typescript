const handleActiveNavButton = () => {
	const { pathname } = window.location;
	const navBtns = document.querySelectorAll('.sidebar a');
	navBtns.forEach((btn) => {
		const arr_path = btn.href.split('/');
		if (pathname === '/' && arr_path.pop() === '') {
			btn.style['background-color'] = '#007bff';
			btn.style['color'] = '#ffffff';
		}
		if (arr_path != '' && arr_path.pop() === pathname.split('/').pop()) {
			btn.style['background-color'] = '#007bff';
			btn.style['color'] = '#ffffff';
		}
	});
};

window.addEventListener('DOMContentLoaded', () => {
	handleActiveNavButton();
});
