import { spawn } from 'child_process';

export const openBrowser = (url: string) => {
	// Comando para abrir el navegador en sistemas Unix (Linux, macOS)
	const openCommandUnix = `open ${url}`;

	// Comando para abrir el navegador en sistemas Windows
	const openCommandWindows = `start ${url}`;

	// Usa el comando adecuado según el sistema operativo
	const openCommand = process.platform === 'win32' ? openCommandWindows : openCommandUnix;

	// Ejecuta el comando para abrir el navegador
	const childProcess = spawn(openCommand, { shell: true });

	childProcess.on('error', (error) => {
		console.error(`Error al abrir el navegador: ${error.message}`);
	});

	childProcess.on('exit', (code) => {
		if (code !== 0) {
			console.error(`El comando de apertura del navegador salió con código de error ${code}`);
		}
	});
};
