import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import * as utils from '@aerisweather/javascript-sdk/dist/utils/index';
class StormThreats extends MapSourceModule {
    private _request: ApiRequest;

    get id() {
        return 'stormthreats';
    }
    constructor(opts:any = null) {
        super(opts);
    }

    source(): any {
 
        const properties: any = {
            root: 'features',
            path: 'geometry'
        }

        return {
            type: 'vector',
            requiresBounds: true,
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
                            color: '#ffa500',
                            opacity: 0.65
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
			title: 'Storm Threats'
		};
    }
    onInit() {
		
		const request = this.account.api()
            .endpoint('stormcells/summary')
            .format('geojson')
            .limit(1)
            .filter('threat,geo');
		this._request = request;
    }
}
export default StormThreats;