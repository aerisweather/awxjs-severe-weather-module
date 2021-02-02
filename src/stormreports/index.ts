/* eslint-disable import/prefer-default-export */
export async function loader(): Promise<any> {
	const module = await import(/* webpackChunkName: "aerisweather.modules.severe.StormReports" */ './StormReports');
	return new Promise<any>((resolve, reject) => {
		resolve(module);
	}).catch((error) => {
		console.error('AerisWeather.Module - ERROR', error);
	});
}