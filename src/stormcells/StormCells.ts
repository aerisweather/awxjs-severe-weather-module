import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import account from '@aerisweather/javascript-sdk';
import {formatStormCells, getStormCellMarker} from '../utils';
import {isEmpty, formatDate, isArray, get, isset} from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';
import { formatDataValue } from '@aerisweather/javascript-sdk/dist/utils/units';

const colors: any = {
	general: '#2ed300',
	hail: '#ebe100',
	rotating: '#f17200',
	tornado: '#ff2600'
};

const indexForIntensity = (value: number): any => {
	if (value >= 60) {
		return { index: 5, label: 'Extreme' };
	} else if (value >= 55) {
		return { index: 4, label: 'Very Heavy' };
	} else if (value >= 50) {
		return { index: 3, label: 'Heavy' };
	} else if (value >= 35) {
		return { index: 2, label: 'Moderate' };
	} else if (value >= 20) {
		return { index: 1, label: 'Light' };
	}
	return { index: 0, label: 'Very Light' };
};

const indexForSeverity = (value: number): any => {
	// `value` is in the range 0..10 and needs to be converted to an index value in
	// the range 0..5
	const index = Math.floor(value / 2);
	const labels = ['None', 'Minimal', 'Low', 'Moderate', 'High', 'Extreme'];

	return { index, label: labels[index] };
};

const getSeverity = (cell: any = {}): number => {
	const { hail, mda, tvs, traits } = cell;
	let severity = 0;

	if (isset(hail) && hail.probSevere > 0) {
		severity = hail.probSevere / 10;
	}

	if (isset(traits) && severity < 10) {
		const { rotating, tornado } = traits;
		if (rotating) {
			severity = 7;
		}
		if (tornado) {
			severity = 10;
		}
	}

	if (severity < 8) {
		if (tvs === 1) {
			severity = 8;
		}
	}

	return severity;
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
            requiresBounds: true,
            data: {
                service: () => {
                    return this._request;
                },
                properties: properties,
                formatter: (data: any) => formatStormCells(data)
            },
            style: {
                marker: (data: any) => getStormCellMarker(data),
                polyline: (data: any) => {
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
						.radius('10mi')
						.fields('place.name,place.state');
					request.addRequest(req);
				});

				return request;
			},
			views: [{
				// place info
				requiresData: true,
				data: (data: any): any => {
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
				// severity levels
				requiresData: true,
				data: (data: any) => {
					if (!data || !data.stormcells) return null;

					const { dbzm } = data.stormcells || {};
					const result: any[] = [];

					if (isset(dbzm)) {
						result.push({
							type: 'intensity', name: 'Intensity', value: dbzm
						});
					}

					const severity = getSeverity(data.stormcells);
					result.push({
						type: 'severity', name: 'Severity', value: severity
					});

					return result;
				},
				renderer: (data: any): string => {
					const hazards = data.map((hazard: any) => {
						let index = 0;
						let level = '';

						if (hazard.type === 'intensity') {
							const { index: hazardIndex, label } = indexForIntensity(hazard.value);
							index = hazardIndex;
							level = label;
						} else if (hazard.type === 'severity') {
							const { index: hazardIndex, label } = indexForSeverity(hazard.value);
							index = hazardIndex;
							level = label;
						}

						const indexStr = `${index}`.replace(/\./g, 'p');
						const percent = Math.round((index / 5) * 1000) / 10;

						return (`
							<div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
								<div class="awxjs__app__ui-panel-info__hazard-label">${hazard.name}</div>
								<div class="awxjs__app__ui-panel-info__hazard-bar">
									<div class="awxjs__app__ui-panel-info__hazard-bar-inner">
										<div class="awxjs__app__ui-panel-info__hazard-bar-progress awxjs__app__ui-panel-info__hazard-indice-fill-${indexStr}" style="width:${percent}%;"></div>
									</div>
								</div>
								<div class="awxjs__app__ui-panel-info__hazard-value awxjs__app__ui-panel-info__hazard-value-${indexStr}">${level}</div>
							</div>
						`);
					});
					return `<div class="awxjs__app__ui-panel-info__hazards">${hazards.join('')}</div>`;
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
						//value: formatDataValue(data, 'htFT', 'htM', metric)
						value: `${data.htFT} ft`
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
						//value: formatDataValue(data, 'hail.maxSizeIN', 'hail.maxSizeCM', metric)
						value: `${data.hail.maxSizeIN} in`
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
        const cellId = `${data.radarID}_${data.cellID}`;
		this.showInfoPanel(`Cell ${cellId}`).load({ p: id }, { stormcells: data });
	}
}
export default StormCells;
