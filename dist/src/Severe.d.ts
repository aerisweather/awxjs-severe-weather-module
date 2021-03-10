import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
declare class Severe extends ModuleGroup {
    get id(): string;
    load(): Promise<IMapSourceModule[]>;
    controls(): any;
}
export default Severe;
