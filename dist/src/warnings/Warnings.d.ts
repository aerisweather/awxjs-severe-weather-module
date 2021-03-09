import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class Warnings extends MapSourceModule {
    private request;
    get id(): string;
    source(): any;
    controls(): any;
    infopanel(): any;
    onInit(): void;
    onShapeClick(shape: any, data: any): void;
}
export default Warnings;
