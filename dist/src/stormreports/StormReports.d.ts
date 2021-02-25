import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class StormReports extends MapSourceModule {
    private _request;
    get id(): string;
    source(): any;
    infopanel(): any;
    onMarkerClick(marker: any, data: any): void;
    controls(): any;
    onInit(): void;
}
export default StormReports;
