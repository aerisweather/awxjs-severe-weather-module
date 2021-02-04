import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import account from '@aerisweather/javascript-sdk';
import {getStormCellForecast, getStormCellContent, formatStormCells, getStormCellMarker} from '../utils';
import {isEmpty, formatDate, isArray, get, isset} from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';
import { formatDataValue } from '@aerisweather/javascript-sdk/dist/utils/units';

const colors: any = {
	general: '#2ed300',
	hail: '#ebe100',
	rotating: '#f17200',
	tornado: '#ff2600'
};

const getColor = (code: string): string => {
	code = (code || 'none').toLowerCase();
	return colors[code] || '#999999';
};
class StormCells extends MapSourceModule {
    private _request: ApiRequest;

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
				const locations = get(data, 'stormcells.forecast.locs') || [];
				if (!locations || locations.length === 0) {
					return null;
				}

				const request = this.account.api();
				locations.forEach(({ lat, long }: any) => {
					const req = this.account.api()
						.endpoint('places')
						.place(`${lat},${long}`)
						.fields('place.name,place.state');
					request.addRequest(req);
				});

				return request;
			},
			views: [{
				// place info
				requiresData: true,
				data: (data: any): any => {
					console.log('DATA', data);
					if (!data || !data.stormcells) return null;
					return data;
				},
				renderer: (data: any): string => {
					if (!data) return;

					const { stormcells: { place, movement, traits = {} }, metric } = data;
					const placeName = `${toName(place.name)}, ${place.state.toUpperCase()}`;

					const movementBlock = isset(movement) ? `
						<div class="awxjs__ui-row">
							<div>Moving ${movement.dirTo} at ${formatDataValue(movement, 'speedMPH', 'speedKMH', metric)}</div>
						</div>
					` : '';

					return `
						<div class="stormtrack-loc awxjs__app__ui-panel-info__table">
							<div class="awxjs__ui-row">
								<div class="awxjs__ui-cols align-center">
									<div class="awxjs__ui-expand awxjs__text-lg value"><strong>Near ${placeName}</strong></div>
									<div><div class="indicator" style="background:${getColor(traits.type)};"></div></div>
								</div>
							</div>
							${movementBlock}
						</div>
					`;
				}
			}, {
				// forecast track
				title: 'Forecast Track',
				requiresData: true,
				data: (data: any) => {
					const locations = get(data, 'stormcells.forecast.locs');
					if (!locations) return null;

					// filter out invalid place results
					const places = locations.map((loc: any) => {
						const key = `places_${loc.lat}_${loc.long}`;
						const place: any = data[key];

						if (place && isset(place.place)) {
							return { timestamp: loc.timestamp, ...place };
						}
						return null;
					}).filter((v: any) => isset(v));

					if (places.length === 0) return null;

					data.locations = places;

					return data;
				},
				renderer: (data: any): string => {
					const locations = get(data, 'locations') || [];
					const names: string[] = [];
					const rows = locations.map((loc: any) => {
						const place = loc.place;
						if (names.indexOf(place.name) !== -1) {
							return null;
						}
						names.push(place.name);

						const time = formatDate(new Date(loc.timestamp * 1000), 'h:mm a');
						return (`
							<div class="awxjs__ui-row">
								<div class="awxjs__ui-expand label">${place.name}</div>
								<div class="awxjs__ui-expand value">${time}</div>
							</div>
						`);
					});

					return (`
						<div class="awxjs__app__ui-panel-info__table">
							${rows.filter((v: any) => typeof v !== 'undefined').join('\n')}
						</div>
					`);
				}
			}, {
				// details
				requiresData: true,
				data: (data: any) => {
					const payload = get(data, 'stormcells');
					if (!payload) return null;
					return payload;
				},
				renderer: (data: any) => {
					const { metric } = data;

					const rows: any[] = [{
						label: 'Observed',
						value: formatDate(new Date(data.timestamp * 1000), 'h:mm a, MMM d, yyyy')
					}, {
						label: 'Radar Station',
						value: data.radarID
					}, {
						label: 'Max Reflectivity',
						value: `${data.dbzm} dbz`
					}, {
						label: 'Echo Top',
						value: formatDataValue(data, 'htFT', 'htM', metric)
					}, {
						label: 'TVS',
						value: data.tvs === 1 ? 'Yes' : 'No'
					}, {
						label: 'Hail',
						value: `${get(data, 'hail.prob') || 0}% Probability`
					}, {
						label: 'Severe Hail',
						value: `${get(data, 'hail.probSevere') || 0}% Probability`
					}, {
						label: 'Max Hail Size',
						value: formatDataValue(data, 'hail.maxSizeIN', 'hail.maxSizeCM', metric)
					}, {
						label: 'MDA',
						value: data.mda
					}, {
						label: 'VIL',
						value: data.vil
					}];

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

	onMarkerClick(marker: any, data: any) {
		if (!data) return;

		const { id } = data;
		console.log('cell', id, {...data});
		this.showInfoPanel(`Cell ${id}`).load({ p: id }, { stormcells: data });
	}
}
export default StormCells;
