import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import {getStormReportMarkerContent} from '../utils';
class StormReports extends MapSourceModule {
    private _request: ApiRequest;

    get id() {
        return 'stormreports';
    }

    source(): any {


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
                // properties: properties
            }

            // style: {
            //     polygon: (item: any) => {
            //         return {
            //             fill: {
            //                 color: '#e5e5e5',
            //                 opacity: 0.5
            //             },
            //             stroke: {
            //                 color: '#030303',
            //                 width: 1,
            //                 opacity: 0.8
            //             }
            //         };
            //     }
            // }
        }
    }
    controls(): any {
		return {
			value: this.id,
			title: 'Storm Reports'
		};
    }
    onInit() {	
		const request = this.account.api()
        .endpoint('stormreports');
		this._request = request;
    }
    
}
export default StormReports;