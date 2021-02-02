import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import * as utils from '@aerisweather/javascript-sdk/dist/utils/index';

class Warnings extends MapSourceModule {
	private _request: ApiRequest;
 
    get id() {
        return 'warnings';
    }

    constructor(opts:any = null) {
        super(opts);
    }
    source(): any {
        
        const properties: any = {
            root: 'features',
            id: 'properties.details.loc',
            category: 'properties.details.cat',
            path: 'geometry'
        };
    

        return {
            type: 'vector',
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
                            color: '#' + utils.get(item, 'properties.details.color'),
                            opacity: 0.4,
                            weight: 3
                        },
                        stroke: {
                            color: '#' + utils.get(item, 'properties.details.color'),
                            width: 2,
                            weight: 3
                        }
                    };
                }
            }
        };
    }
    controls(): any {
		return {
			value: this.id,
			title: 'Warnings'
		};
    }
    onInit() {
		
		const request = this.account.api()
            .endpoint('advisories')
            .action(ApiAction.SEARCH)
            .filter('usa')
            .query('type:TO.W;type:SV.W;type:FF.W;')
            .fields('details.type,details.name,details.body,details,geoPoly')
            .limit(100)
            .format('geojson');
		this._request = request;
    }
}
export default Warnings;