export async function loader(): Promise<any> {
    const module = await import(
        /* webpackChunkName: "aerisweather.modules.severe.StormCells" */ './StormCells'
    );

    return new Promise<any>((resolve) => {
        resolve(module);
    }).catch((error) => {
        console.error('AerisWeather.Module - ERROR', error);
    });
}
