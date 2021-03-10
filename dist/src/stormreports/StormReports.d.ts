import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class StormReports extends MapSourceModule {
    private request;
    get id(): string;
    source(): any;
    controls(): any;
    infopanel(): any;
    onMarkerClick(marker: any, data: any): void;
    onInit(): void;
}
export default StormReports;
