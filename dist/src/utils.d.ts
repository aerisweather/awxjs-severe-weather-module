/**
 * Storm Cells
 */
export declare const colorStormCell: (code: string) => string;
export declare const indexForSeverity: (value: number) => any;
export declare const getSeverity: (cell?: any) => number;
export declare const getStormCellMarker: (data: any) => any;
export declare const getIndexString: (index: any) => any;
export declare const getPercent: (index: any) => any;
export declare const round5: (x: any) => any;
export declare const rotationIntensity: (value: number) => any;
export declare const indexForHail: (value: number) => any;
export declare const indexForIntensity: (value: number) => any;
export declare const formatStormCells: (data: any) => any;
export declare const getStormCellForecast: (aeris: any, forecast: any) => any;
/**
 * Storm Reports
 */
export declare const getMagnitude: (data?: any) => string;
export declare const getStormReportMarkerContent: (data: any) => string;
