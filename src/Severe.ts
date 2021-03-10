import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import Warnings from './warnings/Warnings';
import StormThreats from './stormthreats/StormThreats';
import LightningThreats from './lightningthreats/LightningThreats';
import StormReports from './stormreports/StormReports';
import StormCells from './stormcells/StormCells';

class Severe extends ModuleGroup {
    get id(): string {
        return 'severe';
    }

    async load(): Promise<IMapSourceModule[]> {
        return new Promise<IMapSourceModule[]>((resolve) => {
            this._modules = [
                new Warnings(),
                new StormThreats(),
                new LightningThreats(),
                new StormReports(),
                new StormCells()
            ];
            resolve(this._modules);
        });
    }

    controls() {
        return {
            title: 'Severe Weather',
            buttons: [{
                value: 'warnings',
                title: 'Severe Warnings'
            }, {
                value: 'stormcells',
                title: 'Storm Tracks',
                id: 'stormcells',
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
            }, {
                value: 'lightning-strikes-5m-icons',
                title: 'Lightning Strikes'
            }, {
                value: 'stormreports',
                title: 'Severe Reports'
            }, {
                value: 'stormthreats',
                title: 'Threat Areas'
            }, {
                value: 'lightningthreats',
                title: 'Lightning Areas'
            }]
        };
    }
}

export default Severe;
