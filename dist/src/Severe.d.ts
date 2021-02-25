import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import InteractiveMapApp from '@aerisweather/javascript-sdk/dist/apps/InteractiveMapApp';
import InteractiveMap from '@aerisweather/javascript-sdk/dist/maps/interactive/InteractiveMap';
declare class NewModuleGroup extends ModuleGroup {
    private _account;
    private _app;
    private _map;
    initialize(account: Account, app: InteractiveMapApp, map?: InteractiveMap): void;
    get account(): Account;
    get app(): InteractiveMapApp;
    get map(): InteractiveMap;
}
declare class Severe extends NewModuleGroup {
    get id(): string;
    load(): Promise<IMapSourceModule[]>;
    controls(): {
        title: string;
        buttons: ({
            value: string;
            title: string;
            id?: undefined;
            filter?: undefined;
            multiselect?: undefined;
            segments?: undefined;
        } | {
            value: string;
            title: string;
            id: string;
            filter: boolean;
            multiselect: boolean;
            segments: {
                value: string;
                title: string;
            }[];
        })[];
    };
}
export default Severe;
