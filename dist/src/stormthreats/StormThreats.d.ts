import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class StormThreats extends MapSourceModule {
    private _request;
    get id(): string;
    constructor(opts?: any);
    source(): any;
    controls(): any;
    onInit(): void;
}
export default StormThreats;
