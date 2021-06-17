import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import { formatDate, get, isset } from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';
import { formatDataValue } from '@aerisweather/javascript-sdk/dist/utils/units';
import { colorStormCell,
    formatStormCells,
    getSeverity,
    getStormCellMarker,
    indexForIntensity,
    indexForSeverity } from '../utils';


class StormCells extends MapSourceModule {
    private request: ApiRequest;

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
                service: () => this.request,
                properties,
                formatter: (data: any) => formatStormCells(data)
            },
            style: {
                marker: (data: any) => getStormCellMarker(data),
                polyline: () => ({
                    stroke: {
                        color: '#ffffff',
                        width: 3
                    }
                })
            }
        };
    }

    infopanel(): any {
        return {
            request: (data: any) => {
                const locations = get(data, 'stormcells.forecast.locs') || [];

                if (!locations || locations.length === 0) {
                    return;
                }

                const request = this.account.api();
                locations.forEach(({ lat, long }: any) => {
                    const request_ = this.account
                        .api()
                        .endpoint('places')
                        .place(`${lat},${long}`)
                        .radius('10mi')
                        .fields('place.name,place.state');
                    request.addRequest(request_);
                });

                return request;
            },
            views: [{
                // place info
                requiresData: true,
                data: (data: any): any => {
                    if (!get(data, 'stormcells')) return;

                    return data;
                },
                renderer: (data: any): string => {
                    if (!data) return;

                    const {
                        stormcells: {
                            place, movement, traits = {}
                        },
                        metric
                    } = data;
                    const placeName = `${toName(place.name)}, ${place.state.toUpperCase()}`;

                    const movementBlock = isset(movement) ? `
                            <div class="awxjs__ui-row">
                                <div>
                                    Moving ${movement.dirTo}
                                    at ${formatDataValue(movement, 'speedMPH', 'speedKMH', metric)}
                                </div>
                            </div>
                        ` : '';

                    return `
                        <div class="stormtrack-loc awxjs__app__ui-panel-info__table">
                            <div class="awxjs__ui-row">
                                <div class="awxjs__ui-cols align-center">
                                    <div class="awxjs__ui-expand awxjs__text-lg value">
                                        <strong>Near ${placeName}</strong>
                                    </div>
                                    <div>
                                        <div class="indicator" style="background:${colorStormCell(traits.type)};"></div>
                                    </div>
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
                    const stormcells = get(data, 'stormcells');
                    if (!stormcells) return;

                    const { dbzm } = stormcells;
                    const result: any[] = [];

                    if (isset(dbzm)) {
                        result.push({
                            type: 'intensity',
                            name: 'Intensity',
                            value: dbzm
                        });
                    }

                    const severity = getSeverity(data.stormcells);
                    result.push({
                        type: 'severity',
                        name: 'Severity',
                        value: severity
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

                        const indexString = `${index}`.replace(/\./g, 'p');

                        const percent = Math.round((index / 5) * 1000) / 10;
                        return `
                            <div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
                                <div class="awxjs__app__ui-panel-info__hazard-label">
                                    ${hazard.name}
                                </div>
                                <div class="awxjs__app__ui-panel-info__hazard-bar
                                    awxjs__app__ui-panel-info__hazard-bar-sm"
                                >
                                    <div class="awxjs__app__ui-panel-info__hazard-bar-inner">
                                        <div
                                            class="awxjs__app__ui-panel-info__hazard-bar-progress
                                                awxjs__app__ui-panel-info__hazard-indice-fill-${indexString}"
                                            style="width:${percent}%;"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="awxjs__app__ui-panel-info__hazard-value
                                    awxjs__app__ui-panel-info__hazard-value-lg
                                        awxjs__app__ui-panel-info__hazard-value-${indexString}"
                                    >${level}</div>
                            </div>
                        `;
                    });

                    return `
                        <div class="awxjs__app__ui-panel-info__hazards">
                            ${hazards.join('')}
                        </div>
                    `;
                }
            }, {
                // forecast track
                title: 'Forecast Track',
                requiresData: true,
                data: (data: any) => {
                    const locations = get(data, 'stormcells.forecast.locs');

                    if (!locations) return;

                    // filter out invalid place results
                    const places = locations
                        .map((loc: any) => {
                            const key = `places_${loc.lat}_${loc.long}`;
                            const place: any = data[key];

                            if (place && isset(place.place)) {
                                return { timestamp: loc.timestamp, ...place };
                            }

                            return false;
                        })
                        .filter((v: any) => v);

                    if (places.length === 0) return;

                    data.locations = places;

                    return data;
                },
                renderer: (data: any): string => {
                    const locations = get(data, 'locations') || [];
                    const names: string[] = [];
                    const rows = locations.map((loc: any) => {
                        const { place, timestamp } = loc;

                        if (names.includes(place.name)) {
                            return;
                        }
                        names.push(place.name);

                        const time = formatDate(new Date(timestamp * 1000), 'h:mm a');

                        return `
                            <div class="awxjs__ui-row">
                                <div class="awxjs__ui-expand label">${place.name}</div>
                                <div class="awxjs__ui-expand value">${time}</div>
                            </div>
                        `;
                    });

                    return `
                        <div class="awxjs__app__ui-panel-info__table awxjs__table">
                            ${rows.filter((v: any) => typeof v !== 'undefined').join('\n')}
                        </div>
                    `;
                }
            }, {
                // details
                requiresData: true,
                data: (data: any) => {
                    const payload = get(data, 'stormcells');

                    if (!payload) {
                        return;
                    }

                    return payload;
                },
                renderer: (data: any) => {
                    const {
                        metric,
                        timestamp,
                        radarID,
                        dbzm,
                        tvs,
                        mda,
                        vil
                    } = data;

                    const rows: any[] = [{
                        label: 'Observed',
                        value: formatDate(
                            new Date(timestamp * 1000),
                            'h:mm a, MMM d, yyyy'
                        )
                    }, {
                        label: 'Radar Station',
                        value: radarID
                    }, {
                        label: 'Max Reflectivity',
                        value: `${dbzm} dbz`
                    }, {
                        label: 'Echo Top',
                        value: formatDataValue(data, 'topFT', 'topM', metric)
                    }, {
                        label: 'TVS',
                        value: tvs === 1 ? 'Yes' : 'No'
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
                        value: mda
                    }, {
                        label: 'VIL',
                        value: vil
                    }];

                    const content = rows.reduce((result, row) => {
                        result.push(`
                            <div class="awxjs__ui-row">
                                <div class="awxjs__ui-expand awxjs__text-sm label">${row.label}</div>
                                <div class="awxjs__ui-expand value">${row.value}</div>
                            </div>
                        `);

                        return result;
                    }, []).join('\n');

                    return `
                        <div class="awxjs__app__ui-panel-info__table awxjs__table awxjs__table-bordered">
                            ${content}
                        </div>
                    `;
                }
            }]
        };
    }

    controls(): any {
        return {
            value: this.id,
            title: 'Storm Tracks',
            filter: true,
            multiselect: true,
            segments: [{
                value: 'all',
                title: 'All'
            }, {
                value: 'hail',
                title: 'Hail'
            }, {
                value: 'rotating',
                title: 'Rotating'
            }, {
                value: 'tornado',
                title: 'Tornadic'
            }]
        };
    }

    onInit() {
        const request = this.account.api().endpoint('stormcells');
        this.request = request;
    }

    onMarkerClick(marker: any, data: any) {
        if (!data) return;

        const {
            id,
            radarID,
            cellID
        } = data;
        const cellId = `${radarID}_${cellID}`;
        this.showInfoPanel(`Cell ${cellId}`).load({ p: id }, { stormcells: data });
    }
}

export default StormCells;
