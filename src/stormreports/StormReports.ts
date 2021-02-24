import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import { ucfirst, ucwords } from '@aerisweather/javascript-sdk/dist/utils/strings';
import {getStormReportMarkerContent,getMagnitude} from '../utils';
import {isEmpty, formatDate, isArray, get, isset} from '@aerisweather/javascript-sdk/dist/utils/index';
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
        }
    }
    infopanel(): any {
        return {
            views: [{
                data: (data: any) => {
                    if (!data) return null;
                    const payload = get(data, 'stormreports');
					if (!payload) return null;
					return payload;
                },
                renderer: (data: any) => {
                    if (!data) return;
                    const rows: any[] = [{
                        label: 'Location',
                        value: data.report.name
                    },{
                        label: 'Description',
                        value: ucwords(data.report.type)
                    },{
                        label: 'Magnitude',
                        value: getMagnitude(data.report)
                    },{
                        label: 'Report Time',
                        value: formatDate(new Date(data.report.timestamp * 1000), 'h:mm a, MMM d, yyyy')
                    },{
                        label: 'Remarks',
                        value: data.report.comments || ""
                    }

                    ];
                    return (`
                    <div class="awxjs__app__ui-panel-info__table">
                    ${rows.reduce((result, row) => {
                        result.push(`
                            <div class="awxjs__ui-row">
                                <div class="awxjs__ui-expand label">${row.label}</div>
                                <div class="awxjs__ui-expand value">${row.value}</div>
                            </div>
                        `);
                        return result;
                    }, []).join('\n')}
                </div>
                    `);
                }
            }]
        }
    }
    onMarkerClick(marker: any, data: any) {
		if (!data) return;
        const { id } = data;
        const type = ucwords(data.report.type);
		this.showInfoPanel(`${type}`).load({ p: id }, { stormreports: data });
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