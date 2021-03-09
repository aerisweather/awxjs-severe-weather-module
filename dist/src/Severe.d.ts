import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
declare class Severe extends ModuleGroup {
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
