import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class StormThreats extends MapSourceModule {
    private request;
    get id(): string;
    source(): any;
    controls(): any;
    onInit(): void;
}
export default StormThreats;
