import { isEmpty, formatDate, isArray, get } from '@aerisweather/javascript-sdk/dist/utils/index';
import * as strings from '@aerisweather/javascript-sdk/dist/utils/strings';

const toRadians = (degrees: any) => (degrees * Math.PI) / 180;

const toDegrees = (radians: any) => (radians * 180) / Math.PI;

const getBearing = (startLat: any, startLng: any, endLat: any, endLng: any) => {
    const sy = toRadians(startLat);
    const sx = toRadians(startLng);
    const ey = toRadians(endLat);
    const ex = toRadians(endLng);

    const y = Math.sin(ex - sx) * Math.cos(ey);
    const x = Math.cos(sy) * Math.sin(ey) - Math.sin(sy) * Math.cos(ey) * Math.cos(ex - sx);

    let result = Math.atan2(y, x);
    result = toDegrees(result);

    return (result + 360) % 360;
};

const colorStormCell = (code: string): string => {
    code = code.toLowerCase();

    switch (code) {
        case 'general':
            return '#2ED300';
        case 'hail':
            return '#EBE100';
        case 'rotating':
            return '#F17200';
        case 'tornado':
            return '#FF2600';
        default:
            return '#000000';
    }
};

export const getStormCellMarker = (data: any): any => {
    const { isCurrent } = data;
    const { isLast } = data;
    const type: string = get(data, 'traits.type');

    if (isLast) {
        const bearing = data.bearing ? data.bearing : 0;

        return {
            className: 'marker-stormcell',
            svg: {
                hidden: true,
                shape: {
                    type: 'path',
                    path: 'M51.9,49.1L30.4,11.8L9,49.1C9,49.1,51.9,49.1,51.9,49.1z',
                    fill: {
                        color: '#ffffff'
                    },
                    transform: `rotate(${bearing},30,30)`
                },
                viewBox: '0 0 60 60'
            },
            size: [16, 16]
        };
    }

    return {
        className: 'marker-stormcell',
        svg: {
            shape: {
                type: 'circle',
                fill: {
                    color: colorStormCell(type)
                },
                stroke: {
                    color: '#ffffff',
                    width: 2
                }
            }
        },
        size: isCurrent ? [15, 15] : [10, 10]
    };
};

export const getIndexString = (index: any): any => {

    return `${index}`.replace(/\./g, 'p');
};

export const getPercent = (index: any): any => {
 return Math.round((index / 5) * 1000) / 10;
}
 export const round5 = (x: any): any => {
    return Math.ceil(x/5)*5;
}

export const rotationIntensity = (value: number): any => {
    if (value >= 20) {
        return {index: 5, label: 'Inense'}
    }
    if (value >= 15) {
        return {index: 4, label: 'Strong'}
    }
    if (value >= 10) {
        return {index: 3, label: 'Moderate'}
    }
    if (value >= 5) {
        return {index: 2, label: 'Weak'}
    }
    if (value < 5) {
        return {index: 0, label: 'None'}
    }
}
//pulled from https://www.weather.gov/lwx/skywarn_hail
export const indexForHail = (value: number): any => {
    if (value >= 4.5) {
        return {index: 5, label: 'Softball Size'}
    }
    if (value >= 4.0) {
        return {index: 5, label: 'Grapefruit Size'}
    }
    if (value >= 3.0) {
        return {index: 5, label: 'Teacup Size'}
    }
    if (value >= 2.75) {
        return {index: 5, label: 'Baseball Size'}
    }
    if (value >= 2.5) {
        return {index: 5, label: 'Tennis Ball Size'}
    }
    if (value >= 2.0) {
        return {index: 4, label: 'Hen Egg Size'}
    }
    if (value >= 1.75) {
        return {index: 4, label: 'Golf Ball Size'}
    }
    if (value >= 1.50) {
        return {index: 4, label: 'Ping Pong Size'}
    }
    if (value >= 1.25) {
        return {index: 3, label: 'Half Dollar Size'}
    }
    if (value >= 1.00) {
        return {index: 3, label: 'Quarter Size'}
    }
    if (value >= 0.75) {
        return {index: 2, label: 'Penny Size'}
    }
    if (value >= 0.5) {
        return {index: 1, label: 'Small Marble Size'}
    }
    if (value >= 0.25) {
        return {index: 1, label: 'Pea Size'}
    }

    return { index: 0, label: 'None'};
}
export const indexForIntensity = (value: number): any => {
    if (value >= 60) {
        return { index: 5, label: 'Extreme' };
    }

    if (value >= 55) {
        return { index: 4, label: 'Very Heavy' };
    }

    if (value >= 50) {
        return { index: 3, label: 'Heavy' };
    }

    if (value >= 35) {
        return { index: 2, label: 'Moderate' };
    }

    if (value >= 20) {
        return { index: 1, label: 'Light' };
    }

    return { index: 0, label: 'Very Light' };
};

export const formatStormCells = (data: any): any => {
    if (isArray(data)) {
        data.forEach((cell: any) => {
            const {
                id,
                ob,
                loc,
                forecast,
                place,
                traits
            } = cell;
            let { points } = cell;
            const startLat = loc.lat;
            const startLng = loc.long;

            points = [{
                id,
                ...ob,
                traits,
                forecast,
                place,
                loc: {
                    lat: loc.lat,
                    lon: loc.long
                },
                isCurrent: true
            }];

            if (forecast && forecast.locs) {
                (forecast.locs || []).forEach((forecastLoc: any) => {
                    const endLat = forecastLoc.lat;
                    const endLng = forecastLoc.long;
                    const trueBearing = getBearing(startLat, startLng, endLat, endLng);
                    let isLast = false;

                    if (forecast.locs[forecast.locs.length - 1] === forecastLoc) {
                        isLast = true;
                        points.push({
                            ...ob,
                            timestamp: forecastLoc.timestamp,
                            dateTimeISO: forecastLoc.dateTimeISO,
                            bearing: trueBearing,
                            place,
                            forecast,
                            traits,
                            loc: {
                                lat: forecastLoc.lat,
                                lon: forecastLoc.long
                            },
                            isCurrent: false,
                            isLast
                        });
                    }
                });
            }

            cell.points = points;
        });
    }

    return data;
};

export const getStormCellForecast = (aeris: any, forecast: any) => {
    const { utils } = aeris;
    const request = aeris.api();
    const final: any = [];

    for (let i = 0; i < forecast.locs.length; i += 1) {
        request.addRequest(
            aeris
                .api()
                .endpoint('places')
                .place(`${forecast.locs[i].lat},${forecast.locs[i].long}`)
                .fields('place.name,place.state')
        );
    }

    request.get().then((result: any) => {
        for (let i = 0; i < forecast.locs.length; i += 1) {
            const object: any = {};
            const place = `
                ${result.data.responses[i].response.place.name},
                ${result.data.responses[i].response.place.state}
            `;
            const time = utils.dates.format(
                new Date(forecast.locs[i].timestamp * 1000),
                'h:mm a, MMM d, yyyy'
            );

            object.place = place;
            object.time = time;
            final.push(object);
        }
    });

    return final;
};

export const getMagnitude = (data: any) => {
    let magnitude = '';

    if (data.cat === 'snow' && !isEmpty(data.detail.snowIN)) {
        magnitude = `${data.detail.snowIN} inches`;
    }

    if (data.cat === 'wind' && !isEmpty(data.detail.windSpeedMPH)) {
        magnitude = `${data.detail.windSpeedMPH} mph`;
    }

    if (data.cat === 'rain' && !isEmpty(data.detail.rainIN)) {
        magnitude = `${data.detail.rainIN} inches`;
    }

    if (data.cat === 'hail' && !isEmpty(data.detail.hailIN)) {
        magnitude = `${data.detail.hailIN} inches`;
    }

    return magnitude;
};

export const getStormReportMarkerContent = (data: any) => {
    let details = '';

    if (data.report.cat === 'hail' && !isEmpty(data.report.detail.hailIN)) {
        details = `
            <div class="row">
                <div class="label">Hail Diameter:</div>
                <div class="value">
                    ${data.report.detail.hailIN.toFixed(2)} in
                </div>
            </div>`;
    }

    if (data.report.cat === 'wind' && !isEmpty(data.report.detail.windSpeedMPH)) {
        details = `
            <div class="row">
                <div class="label">Wind Speed:</div>
                <div class="value">
                    ${data.report.detail.windSpeedMPH} mph
                </div>
            </div>`;
    }

    if (data.report.cat === 'rain' && !isEmpty(data.report.detail.rainIN)) {
        details = `
            <div class="row">
                <div class="label">Rainfall:</div>
                <div class="value">
                    ${data.report.detail.rainIN.toFixed(2)} in
                </div>
            </div>`;
    }

    return `
        <div class="content">
            <div class="title">
                ${strings.toName(data.report.type)}
            </div>
            <div class="row">
                <div class="label">Location:</div>
                <div class="value">
                    ${data.report.name}
                </div>
            </div>
            <div class="row">
                <div class="label">Date:</div>
                <div class="value">
                    ${formatDate(new Date(data.report.timestamp * 1000), 'h:mm a, MMM d, yyyy')}
                </div>
            </div>
            ${details}
            <div class="row">
                <div class="label">Reporter:</div>
                <div class="value">
                    ${data.report.reporter}
                </div>
            </div>
            <div class="row">
                <div class="label">WFO:</div>
                <div class="value">
                    ${data.report.wfo.toUpperCase()}
                </div>
            </div>
            ${!isEmpty(data.report.comments) ? `
            <div class="row">
                <div class="label">Comments</div>
                <div class="value">
                    ${data.report.comments}
                </div>
            </div>
            ` : ''}
        </div>
    `;
};
