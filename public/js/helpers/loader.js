export const loading = (containerID) => {
	const container = document.getElementById(containerID);
	let html =
		'<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
	container.innerHTML = html;
};
