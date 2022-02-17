/* eslint-disable max-len */
import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import InteractiveMapApp from '@aerisweather/javascript-sdk/dist/apps/InteractiveMapApp';
import InteractiveMap from '@aerisweather/javascript-sdk/dist/maps/interactive/InteractiveMap';
import Account from '@aerisweather/javascript-sdk/dist/account/Account';
import ApiRequest from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import { formatDate, get, isset } from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';
import StormCells from './stormcells/StormCells';
import StormReports from './stormreports/StormReports';
import LightningThreats from './lightningthreats/LightningThreats';
import StormThreats from './stormthreats/StormThreats';
import Warnings from './warnings/Warnings';
import { indexForHail, indexForIntensity, round5, getPercent, getIndexString, rotationIntensity } from './utils';

class Severe extends ModuleGroup {
    private _showThreats: boolean = false;
    private _request: ApiRequest;

    constructor(args: {showThreats: boolean}) {
        super();

        if (args) this._showThreats = args.showThreats;
    }

    get id(): string {
        return 'severe';
    }

    async load(): Promise<IMapSourceModule[]> {
        return new Promise<IMapSourceModule[]>((resolve) => {
            this._modules = [
                new Warnings(),
                new StormCells(),
                new StormReports(),
                new StormThreats(),
                new LightningThreats()
            ];
            resolve(this._modules);
        });
    }

    controls(): any {
        const buttons = this.modules ? this.modules.map((m) => m.controls()) : [];
        // insert raster lightning strikes control in third position
        buttons.splice(2, 0, {
            value: 'lightning-strikes-15m-icons',
            title: 'Lightning Strikes',
            controls: {
                settings: [{
                    type: 'opacity'
                }]
            }
        });

        return {
            title: 'Severe Weather',
            buttons
        };
    }

    initialize(account: Account, app: InteractiveMapApp, map?: InteractiveMap) {
        super.initialize(account, app, map);

        if (!this._showThreats) return;

        // do custom info panel stuff...
        const localWeatherConfig: any = {
            request: () => {
                const request = this.account.api()
                    .endpoint('threats');
                this._request = request;

                return request;
            },
            views: [{
                requresData: true,
                // Location info and threat phrase
                data: (data: any) => data,
                renderer: (data: any) => {
                    if (!data[0]) return;
                    const { place } = data[0];

                    return `
                        <div class="awxjs__app__ui-panel-info__place">
                            <div class="awxjs__app__ui-panel-info__place-name">
                                ${toName(place.name)}, ${place.state.toUpperCase()}
                            </div>
                            <div class="awxjs__app__ui-panel-info__obs-timestamp" style="font-size:14px">
                                ${formatDate(new Date(data[0].periods[0].timestamp * 1000), 'h:mm a, MMM d, yyyy')}
                            </div>
                        </div>
                    `;
                }
            }, {
                title: 'Active Threats',
                renderer: (data: any) => {
                    if (!data[0]) return;
                    const threatPhrase = (data[0].periods[0].storms)
                        ? data[0].periods[0].storms.phrase.long
                        : 'No Immediate Threats';

                    return `
                        <div class="awxjs__app__ui-panel-info__threats">
                            <div class="awxjs__app__ui-panel-info__threats-row">${threatPhrase}</div>
                        </div>
                    `;
                }
            }, {
                requiresData: true,
                data: (data: any) => get(data, '[0].periods[0].storms'),
                renderer: (data: any) => {
                    const intensity = indexForIntensity(data.dbz.max);
                    let hailSize: any = {};
                    let rotationScale: any = {};

                    rotationScale = isset(data.mda)
                        ? rotationIntensity(data.mda.max)
                        : { index: 0, label: 'None' };

                    hailSize = isset(data.hail)
                        ? indexForHail(data.hail.maxSizeIN)
                        : { index: 0, label: 'None' };

                    const rows: any[] = [{
                        type: 'Precip Intensity',
                        indexString: getIndexString(intensity.index),
                        percent: getPercent(intensity.index),
                        label: intensity.label
                    }, {
                        type: 'Max Hail Size',
                        indexString: getIndexString(hailSize.index),
                        percent: getPercent(hailSize.index),
                        label: hailSize.label
                    }, {
                        type: 'Rotation',
                        indexString: getIndexString(rotationScale.index),
                        percent: getPercent(rotationScale.index),
                        label: rotationScale.label
                    }];

                    return rows.reduce((result, row) => {
                        result.push(`<div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
                            <div class="awxjs__app__ui-panel-info__hazard-label">
                                ${row.type}
                            </div>
                            <div class="awxjs__app__ui-panel-info__hazard-bar">
                                <div class="awxjs__app__ui-panel-info__hazard-bar-inner">
                                    <div
                                        class="awxjs__app__ui-panel-info__hazard-bar-progress
                                            awxjs__app__ui-panel-info__hazard-indice-fill-${row.indexString}"
                                        style="width:${row.percent}%;"
                                    ></div>
                                </div>
                            </div>
                            <div
                                class="awxjs__app__ui-panel-info__hazard-value
                                    awxjs__app__ui-panel-info__hazard-value-${row.indexString}"
                                >${row.label}</div>
                            </div>`);

                        return result;
                    }, []).join('\n');
                }
            }, {
                requiresData: true,
                data: (data: any) => get(data, '[0].periods[0].storms'),
                renderer: (data: any) => {
                    const rows: any[] = [{
                        label: 'Approaching',
                        value: data.approaching ? 'Yes' : 'No'
                    }, {
                        label: 'Tornadoes',
                        value: data.tornadic ? 'Possible' : 'No'
                    }];

                    const content = rows.reduce((result, row) => {
                        result.push(`
                                <div class="awxjs__ui-row">
                                    <div class="awxjs__ui-expand label">${row.label}</div>
                                    <div class="awxjs__ui-expand value">${row.value}</div>
                                </div>
                            `);

                        return result;
                    }, []).join('\n');

                    return `
                            <div class="awxjs__app__ui-panel-info__table">
                                ${content}
                            </div>
                        `;
                }
            }, {
                title: 'Affecting Storms',
                requiresData: true,
                data: (data: any) => get(data, '[0].periods[0].storms'),
                renderer: (data: any) => `
                    <div class="awxjs__app__ui-panel-info__table">
                        <div class="awxjs__ui-row">
                            <div class="awxjs__ui-expand label">Location</div>
                            <div class="awxjs__ui-expand value">
                                ${data.distance.avgMI} mi
                                ${data.direction.from} (${data.direction.fromDEG}&deg;)
                            </div>
                        </div>
                        <div class="awxjs__ui-row">
                            <div class="awxjs__ui-expand label">Movement</div>
                            <div class="awxjs__ui-expand value">
                                ${data.direction.to}
                                at ${round5(data.speed.avgMPH)} mph
                            </div>
                        </div>
                    </div>
                `
            }]
        };

        this.app.panels.info.setContentView('threats', localWeatherConfig);
        this.app.map.on('click', (e: any) => {
            this.app.showInfoAtCoord(e.data.coord, 'threats', 'Storm Threats');
        });
    }
}

export default Severe;
