import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
class LightningThreats extends MapSourceModule {
    private _request: ApiRequest;

    get id() {
        return 'lightningthreats';
    }

    source(): any {
        const request = this.account
            .api()
            .endpoint('lightning/summary')
            .format('geojson')
            .filter('threat,geo')
            .from('-15minutes');

        const properties: any = { 
            root: 'features',
            path: 'geometry'
        };

        return {
            type: 'vector',
            requreBounds: true,
            data: {
                service: () => {
                    return this._request;
                },
                properties: properties
            },
            style: {
                polygon: (item: any) => {
                    return {
                        fill: {
                            color: '#FFDB00',
                            opacity: 0.6
                        },
                        // stroke: {
                        //     color: '#030303',
                        //     width: 1,
                        //     opacity: 0.8
                        // }
                    };
                }
            }
        }
    }
    controls(): any {
		return {
			value: this.id,
			title: 'Lightning Threats'
		};
    }
    onInit() {
		
		const request = this.account.api()
            .endpoint('lightning/summary')
            .format('geojson')
            .filter('threat,geo')
            .from('-15minutes');
		this._request = request;
    }
}
export default LightningThreats;