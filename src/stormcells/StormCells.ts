import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import account from '@aerisweather/javascript-sdk';
import {getStormCellForecast, getStormCellContent, formatStormCells, getStormCellMarker} from '../utils';
import {isEmpty, formatDate, isArray, get, isset} from '@aerisweather/javascript-sdk/dist/utils/index';
import * as strings from '@aerisweather/javascript-sdk/dist/utils/strings';
class StormCells extends MapSourceModule {
    private _request: ApiRequest;
   
    color = (code: string): string => {
        code = code.toLowerCase();
    
        switch (code) {
            case 'general':
                return '#2ED300';
            case 'hail':
                return '#EBE100';
            case 'rotating':
                return '#F17200';
            case 'tornado':
                return '#FF2600';
            default:
                return '#000000';
        }
    };

    get id() {
        return 'stormcells';
    }

    source(): any {

        const properties: any = { 
            id: 'id',
            path: 'points',
			category: 'traits.type',
            timestamp: 'ob.timestamp',
            points: 'points'
        };

        return {
            type: 'vector',
            requreBounds: true,
            data: {
                service: () => {
                    return this._request;
                },
                properties: properties,
                formatter: (data: any) => formatStormCells(data)
            },
            style: {
                marker: (data: any) => getStormCellMarker(data),
                // marker: (data: any) => {
                //     //console.log(data);
                //     const arrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 100"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" /></marker></defs><line x1="0" y1="50" x2="250" y2="50" stroke="#000" stroke-width="8" marker-end="url(#arrowhead)" /></svg>`;
                  
                //    //console.log(data.id,data.loc,data.dateTimeISO);
                //     const type: string = get(data, 'traits.type');
                //     const isCurrent = data.isCurrent;
                   
                //     return {
                //         className: 'marker-stormcell',
                //         svg: {
                //             shape: {
                //                 type: 'circle',
                //                 fill: {
                //                     color: this.color(type)
                //                 },
                //                 stroke: {
                //                     color: '#ffffff',
                //                     width: 2
                //                 }
                //             }
                //         },
                //         size: isCurrent ? [15,15] : [10, 10]
                //     };
                // },
                polyline: (data: any) => {
				//	const type: string = get(data, 'traits.type');
					return {
						stroke: {
							color: ('#FDFEFE'),
							width: 4
						}
					};
				}
            }
        }
    }
    infopanel(): any {
        return {
                request: (data: any) => {
                  //  if (isEmpty(data.stormcells.forecast.locs))return null;
                    const forecast = {...data.stormcells.forecast};
                    const request = this.account.api();
                    if (!forecast.locs) {
                        return null;
                    }
                    if (forecast.locs) {
                        for(let i = 0; i < forecast.locs.length; i++) {
                            request.addRequest(this.account.api().endpoint('places').place(`${forecast.locs[i].lat},${forecast.locs[i].long}`).fields('place.name,place.state'));
                        }
                    }

                    return request;
                },
                views: [{
                    data: (data: any) => {
                        //console.log("inside", data);
                        return data;
                    },
                    renderer: (data: any) => {
                        // if (isEmpty(data.stormcells.forecast.locs))return null;
                        console.log("renderer", data);
                        const place = {...data.place};
                        
                        let contentString = '';
                        let check: {[index: string]:any} = { };
                        
                        let infoString = '';
                        const near = `${strings.toName(data.stormcells.place.name)}, ${data.stormcells.place.state.toUpperCase()}`;
                        let movementInfo = '';
                        let maxdBZ = '';
                        if (!isEmpty(data.stormcells.movement)) {
                            movementInfo = (`<div class="awxjs__ui-row">
									            <div class="awxjs__ui-expand label">Movement</div>
									            <div class="awxjs__ui-expand value">${data.stormcells.movement.dirTo} at ${data.stormcells.movement.speedMPH} mph</div>
								            </div>`);
                        }
                        if (!isEmpty(data.stormcells.dbzm)) {
                            maxdBZ = (`<div class="awxjs__ui-row">
									            <div class="awxjs__ui-expand label">Max Reflectivity</div>
									            <div class="awxjs__ui-expand value">${data.stormcells.dbzm} dBZ</div>
								            </div>`);
                        }
                        infoString = (`<div class="awxjs__tropical-system awxjs__tropical-system-profile">
                                        <div class="awxjs__tropical-system-profile__details">
                                            <div class="awxjs__ui-row">
									            <div class="awxjs__ui-expand label">Near</div>
									            <div class="awxjs__ui-expand value">${near}</div>
                                            </div>
                                            <div class="awxjs__ui-row">
									            <div class="awxjs__ui-expand label">Observed</div>
									            <div class="awxjs__ui-expand value">${formatDate(new Date(data.stormcells.timestamp * 1000), 'h:mm a, MMM d, yyyy')}</div>
                                            </div>
                                            ${movementInfo}
                                            ${maxdBZ}
                                            <div class="awxjs__ui-row">
									            <div class="awxjs__ui-expand label">Radar Site: </div>
									            <div class="awxjs__ui-expand value">${data.stormcells.radarID}</div>
                                            </div>
                                        </div>

                                    </div>`);
                        if (data.stormcells.forecast && isset(data.stormcells.forecast.locs)) {
                            console.log('asdfasdf');
                            const forecast = {...data.stormcells.forecast};
                            console.log(forecast);
                            for(let i = 0; i < forecast.locs.length; i++) {                              
                                const key: string = `places_${forecast.locs[i].lat},${forecast.locs[i].long}`;
                                            //Make sure we have a place returned from places endpoint
                                            //Will return Array(0) if not
                                if (!isArray(data[key])) {
                                                //Check to see if a forecast already has been added for town
                                                //Skip if duplicate. 
                                    if (check[data[key].place.name] === undefined) {
                                        let time = formatDate(new Date(forecast.locs[i].timestamp * 1000), 'h:mm a');
                                        const string = (`<div class="awxjs__ui-row">
                                                        <div class="awxjs__ui-expand label">${data[key].place.name}</div>
                                                            <div class="awxjs__ui-expand value">${time}</div>
                                                        </div>`);
                                        contentString += string;
                                        check[data[key].place.name] = 1;
                                    } 
                                }
                            }
                            infoString += `<div class="tropsystem"><h3>Storm Cell Forecast Track:</h3>${contentString}</div>`
                        }   
                                    //contentString += infoString;
                                    //return `<div class="tropsystem"><h3>Storm Cell Forecast Track:</h3>${contentString}</div>`;
                        return infoString;
            },
        }]
        }
    }
    controls(): any {
		return {
			value: this.id,
			title: 'Storm Cells'
		};
    }
    onInit() {
		
		const request = this.account.api()
            .endpoint('stormcells');
            // .format('geojson')
            // .filter('threat,geo')
            // .from('-15minutes');
		this._request = request;
    }

    // onMarkerClick(marker: any, data: any) {
    //     //console.log(data);
    //     if (data) {
    //         const source = data.awxjs_source;
    //         if (source == 'stormcells') {
    //             console.log(data);
    //             const popupContent = getStormCellContent(data);
               
    //             marker.unbindPopup().bindPopup(popupContent, {
    //                 className: 'tropical-popup',
    //                 maxWidth : 500,
    //             }).openPopup();
    //            this.app.map.showCallout(data.marker, popupContent);
    //            const newData = {stormcells: data};
    //            this.app.showInfo('stormcells', `Cell ID ${newData.stormcells.id}`).load(null, newData);
    //         }
    //     }
    //     // Called when a marker associated with the module's map data source
    //     // is clicked on the map.
    // }
}
export default StormCells;