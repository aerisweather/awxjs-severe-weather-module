import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class StormCells extends MapSourceModule {
    private _request;
    get id(): string;
    source(): any;
    infopanel(): any;
    controls(): any;
    onInit(): void;
    onMarkerClick(marker: any, data: any): void;
}
export default StormCells;
