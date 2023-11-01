import express from 'express';
import { openBrowser } from './helpers/openBrowser';
import http from 'http';

const app = express();
const puerto = 3000;

app.get('/', (req, res) => {
	res.send('¡Hola, mundo!');
});

// Intenta crear un servidor en el puerto 3000
const servidor = http.createServer(app);

// Verifica si el servidor ya está en ejecución en el puerto
servidor.listen(puerto, () => {
	if (servidor.address() && (servidor.address() as any).port === puerto) {
		console.log(`Servidor en ejecución en http://localhost:${puerto}`);
		// Abre el navegador si el servidor no estaba en ejecución previamente
		openBrowser('http://localhost:' + puerto);
	} else {
		console.log('El servidor ya está en ejecución. Abre un navegador manualmente.');
	}
});
