import { config } from 'dotenv';
import createWebServer from './server';
import { AddressInfo } from 'net';
import './db/db';
import { openBrowser } from './helpers/openBrowser';
config({ path: './../.env' });

const webServer = createWebServer();
const port = Number(process.env.PORT) || 81;
const host = '0.0.0.0';

const sv = webServer.listen(port, host, async () => {
	const info = sv.address() as AddressInfo;
	console.log(`Servidor web abierto en ${info.address}:${info.port}`);
	//openBrowser(`http://${info.address}:${info.port}`);
});
