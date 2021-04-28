import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import Warnings from './warnings/Warnings';
import StormThreats from './stormthreats/StormThreats';
import LightningThreats from './lightningthreats/LightningThreats';
import StormReports from './stormreports/StormReports';
import StormCells from './stormcells/StormCells';
import InteractiveMapApp from '@aerisweather/javascript-sdk/dist/apps/InteractiveMapApp';
import InteractiveMap from '@aerisweather/javascript-sdk/dist/maps/interactive/InteractiveMap';
import Account from '@aerisweather/javascript-sdk/dist/account/Account';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import { formatDate, get, isset } from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';
import {indexForHail, indexForIntensity, round5, getPercent, getIndexString, rotationIntensity} from './utils';

class Severe extends ModuleGroup {
    private _showThreats: boolean = false;
    private _request: ApiRequest;
    constructor(args: {showThreats: boolean}) {
        super();
        if (args) this._showThreats = args.showThreats;
        console.log(this._showThreats);
        
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
            value: 'lightning-strikes-5m-icons',
            title: 'Lightning Strikes'
        });

        return {
            title: 'Severe Weather',
            buttons
        };
    }

    initialize(account: Account, app: InteractiveMapApp, map: InteractiveMap = null) {
        if(!this._showThreats) return;
        super.initialize(account, app, map);
        // do custom info panel stuff...
        const localWeatherConfig: any = {
            request: (data: any) => {
                const request = this.account.api()
                .endpoint('threats')
                this._request = request;
                return request;
            },
            views: [{
                requresData: true,
                //Location info and threat phrase
                data: (data: any) => {
                    if (!data) return null;
                    return data;
                },
                renderer: (data: any) => {
                    if (!data[0]) return;
                   // console.log('renderer',data);
                    const place = data[0].place;
                    let threatPhrase = 'No Immediate Threats';
                    let returnValue = `
                    <div class="awxjs__app__ui-panel-info__place">
                        <div class="awxjs__app__ui-panel-info__place-name">${toName(place.name)}, ${place.state.toUpperCase()}</div>
                        <div class="awxjs__app__ui-panel-info__obs-timestamp" style="font-size:14px"> ${formatDate(
                            new Date(data[0].periods[0].timestamp * 1000),
                            'h:mm a, MMM d, yyyy'
                        )}</div>
                    `;
                    return returnValue;
                }   
            },{
                title: 'Active Threats',
                renderer: (data: any) => {
                    if (!data[0]) return;
                    let threatPhrase = (data[0].periods[0].storms) ? data[0].periods[0].storms.phrase.long :'No Immediate Threats';
                    const snippet = `
                    <div class="awxjs__app__ui-panel-info__threats">
                        <div class="awxjs__app__ui-panel-info__threats-row">${threatPhrase}</div>
                    </div>`;

                    return snippet;
                }
            },           { 
                data: (data: any) => {
                    if (!data) return null;
                    return data;
                },
                renderer: (data: any) => {
                    if (!data[0]) return;
                    let returnValue = '';
                  
                    if (data[0].periods[0].storms) {
                        console.log(data[0].periods[0].storms);
                        const intensity = indexForIntensity(data[0].periods[0].storms.dbz.max);
                        let hailSize: any = {};
                        let rotationScale: any = {};
                        if (isset(data[0].periods[0].storms.mda)) {
                            rotationScale = rotationIntensity(data[0].periods[0].storms.mda.max);
                            console.log ('mda',rotationScale);
                        } else {
                            rotationScale = {index: 0, label: 'None'};
                        }
                        if (isset(data[0].periods[0].storms.hail)) {
                            hailSize = indexForHail(data[0].periods[0].storms.hail.maxSizeIN);
                        } else {
                            hailSize = {index: 0, label: 'None'};
                        }
                        //console.log(`Intensity ${intensity.index} ${intensity.label}, Hail: ${hailIndex.index} ${hailIndex.label}`);
                        const rows: any[] = [{
                            label: 'Approaching',
                            value: data[0].periods[0].storms.approaching ? 'Yes' : 'No'
                        }, {
                            label: 'Tornadoes',
                            value: data[0].periods[0].storms.tornadic ? 'Possible' : 'No'
                        }, 
                        ];
                    
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
                            <div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
                                <div class="awxjs__app__ui-panel-info__hazard-label">
                                    Precip Intensity
                                </div>
                                <div class="awxjs__app__ui-panel-info__hazard-bar">
                                    <div class="awxjs__app__ui-panel-info__hazard-bar-inner">
                                        <div
                                            class="awxjs__app__ui-panel-info__hazard-bar-progress
                                                awxjs__app__ui-panel-info__hazard-indice-fill-${getIndexString(intensity.index)}"
                                            style="width:${getPercent(intensity.index)}%;"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="awxjs__app__ui-panel-info__hazard-value
                                        awxjs__app__ui-panel-info__hazard-value-${getIndexString(intensity.index)}"
                                    >${intensity.label}</div>
                            </div>
                            <div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
                                <div class="awxjs__app__ui-panel-info__hazard-label">
                                    Max Hail Size
                                </div>
                                <div class="awxjs__app__ui-panel-info__hazard-bar">
                                    <div class="awxjs__app__ui-panel-info__hazard-bar-inner">
                                        <div
                                            class="awxjs__app__ui-panel-info__hazard-bar-progress
                                                awxjs__app__ui-panel-info__hazard-indice-fill-${getIndexString(hailSize.index)}"
                                            style="width:${getPercent(hailSize.index)}%;"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="awxjs__app__ui-panel-info__hazard-value
                                        awxjs__app__ui-panel-info__hazard-value-${getIndexString(hailSize.index)}"
                                    >${hailSize.label}</div>
                            </div>
                            <div class="awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center">
                                <div class="awxjs__app__ui-panel-info__hazard-label">
                                    Rotation
                                </div>
                                <div class="awxjs__app__ui-panel-info__hazard-bar">
                                    <div class="awxjs__app__ui-panel-info__hazard-bar-inner">
                                        <div
                                            class="awxjs__app__ui-panel-info__hazard-bar-progress
                                                awxjs__app__ui-panel-info__hazard-indice-fill-${getIndexString(rotationScale.index)}"
                                            style="width:${getPercent(rotationScale.index)}%;"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="awxjs__app__ui-panel-info__hazard-value
                                        awxjs__app__ui-panel-info__hazard-value-${getIndexString(rotationScale.index)}"
                                    >${rotationScale.label}</div>
                            </div>
                        `;
                    } else {
                        return '';
                    }
                }   
            },
            { 
                data: (data: any) => {
                    if (!data) return null;
                    return data;
                },
                renderer: (data: any) => {
                    if (!data[0]) return;
                    let returnValue = '';
                  
                    if (data[0].periods[0].storms) {
                        //console.log(`Intensity ${intensity.index} ${intensity.label}, Hail: ${hailIndex.index} ${hailIndex.label}`);
                        const rows: any[] = [{
                            label: 'Approaching',
                            value: data[0].periods[0].storms.approaching ? 'Yes' : 'No'
                        }, {
                            label: 'Tornadoes',
                            value: data[0].periods[0].storms.tornadic ? 'Possible' : 'No'
                        }, 
                        // {
                        //     label: 'Rotation',
                        //     value: data[0].periods[0].storms.rotation ? 'Yes' : 'No'
                        // }, 
                        // {
                        //     label: 'Hail',
                        //     value: data[0].periods[0].storms.hail ? 'Possible' : 'No'
                        // }
                    ];
                    
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
                    } else {
                        return '';
                    }
                }   
            },{
                title: 'Affecting Storms',
                data: (data: any) => {
                    if (!data) return;
                    return data;
                },
                renderer: (data: any) => {
                    if (!data[0]) return;
                    if(data[0].periods[0].storms == undefined) return;
                    //if(Object.keys(data[0].periods[0].storms).length === 0) return null;
                    let returnValue = '';
                    if (data[0].periods[0].storms) {
                        const minSpeed = round5(data[0].periods[0].storms.speed.minMPH);
                        const maxSpeed = round5(data[0].periods[0].storms.speed.maxMPH);
                        const speedString = (minSpeed != maxSpeed) ? `${minSpeed}-${maxSpeed}` : maxSpeed;
                       // console.log(minSpeed, maxSpeed);
                        const threat = data[0].periods[0].storms;
                        returnValue += `
                        <div class="awxjs__app__ui-panel-info__table">
                        <div class="awxjs__ui-row">
                            <div class="awxjs__ui-expand label">Location</div>
                            <div class="awxjs__ui-expand value">${data[0].periods[0].storms.distance.avgMI} mi ${data[0].periods[0].storms.direction.from} (${data[0].periods[0].storms.direction.fromDEG}&deg;)</div>
                        </div>
                        <div class="awxjs__ui-row">
                            <div class="awxjs__ui-expand label">Movement</div>
                            <div class="awxjs__ui-expand value">${data[0].periods[0].storms.direction.to} at ${round5(data[0].periods[0].storms.speed.avgMPH)} mph</div>
                        </div></div>`;
                    }
                    return returnValue;
                }
            }]
        }
        this.app.panels.info.setContentView('threats', localWeatherConfig);
        this.app.map.on('click', (e: any) => {
            this.app.showInfoAtCoord(e.data.coord, 'threats', 'Storm Threats');
        });
    }
}

export default Severe;
