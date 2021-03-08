import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import  IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import {loader as Warnings} from './warnings';
import {loader as StormThreats} from './stormthreats';
import {loader as LightningThreats} from './lightningthreats';
import {loader as StormReports} from './stormreports';
import {loader as StormCells} from './stormcells';

class Severe extends ModuleGroup {

    get id() {
        return 'severe';
    }

    async load(): Promise<IMapSourceModule[]> {
        const warnings = await Warnings();
        const stormthreats = await StormThreats();
        const lightningthreats = await LightningThreats();
        const stormreports = await StormReports();
        const stormcells = await StormCells();

        return new Promise<IMapSourceModule[]>((resolve, reject) => {
            this._modules = [
                warnings,
                stormthreats,
                lightningthreats,
                stormreports,
                stormcells
            ].map((Module) => new Module.default()); // eslint-disable-line new-cap
            resolve(this._modules);
        });
    }

    controls() {
        return {
            title: 'Severe Weather',
            buttons: [{
                value: 'warnings',
                title: 'Severe Warnings'
            },{
                value: 'stormcells',
                title: 'Storm Tracks',
                id: 'stormcells',
                filter: true,
                multiselect: true,
                segments: [{
                    value: 'all',
                    title: 'All'
                },{
                    value: 'hail',
                    title: 'Hail'
                },{
                    value: 'rotating',
                    title: 'Rotating'
                },{
                    value: 'tornado',
                    title: 'Tornadic'
                }]
            },{
                value: 'lightning-strikes-5m-icons',
                title: 'Lightning Strikes'
            },{
                value: 'stormreports',
                title: 'Severe Reports'
            },{
                value: 'stormthreats',
                title: 'Threat Areas'
            },{
                value: 'lightningthreats',
                title: 'Lightning Areas'
            }]
        };
    }
}

export default Severe;
