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
}

export default Severe;
