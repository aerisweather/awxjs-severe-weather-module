import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import InteractiveMapApp from '@aerisweather/javascript-sdk/dist/apps/InteractiveMapApp';
import InteractiveMap from '@aerisweather/javascript-sdk/dist/maps/interactive/InteractiveMap';
import Account from '@aerisweather/javascript-sdk/dist/account/Account';
declare class Severe extends ModuleGroup {
    private _showThreats;
    private _request;
    constructor(args: {
        showThreats: boolean;
    });
    get id(): string;
    load(): Promise<IMapSourceModule[]>;
    controls(): any;
    initialize(account: Account, app: InteractiveMapApp, map?: InteractiveMap): void;
}
export default Severe;
