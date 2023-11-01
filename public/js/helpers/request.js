export const postRequest = async (url, body) => {
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const postRequestFormData = async (url, body) => {
	try {
		const res = await fetch(url, {
			method: 'POST',

			body,
		});
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const deleteRequest = async (url) => {
	try {
		const res = await fetch(url, {
			method: 'DELETE',
		});
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getRequest = async (url) => {
	try {
		const res = await fetch(url);
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const putRequest = async (url, body) => {
	try {
		const res = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const data = await res.json();
		return data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
