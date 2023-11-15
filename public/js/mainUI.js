// const handleActiveNavButton = () => {
// 	const { pathname } = window.location;
// 	const navBtns = document.querySelectorAll('#sidebar a');
// 	navBtns.forEach((btn) => {
// 		const arr_path = btn.href.split('/');
// 		if (pathname === '/' && arr_path.pop() === '') {
// 			btn.style['background-color'] = '#007bff';
// 			btn.style['color'] = '#ffffff';
// 		}
// 		const last_item = arr_path.pop();
// 		if (last_item != '' && pathname.split('/').includes(last_item)) {
// 			btn.style['background-color'] = '#007bff';
// 			btn.style['color'] = '#ffffff';
// 		}
// 	});
// };

// window.addEventListener('DOMContentLoaded', () => {
// 	handleActiveNavButton();
// });
