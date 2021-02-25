import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
declare class Warnings extends MapSourceModule {
    private _request;
    get id(): string;
    constructor(opts?: any);
    source(): any;
    controls(): any;
    infopanel(): any;
    onInit(): void;
    onShapeClick(shape: any, data: any): void;
}
export default Warnings;
