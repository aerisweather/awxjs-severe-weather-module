import {isEmpty, formatDate, isArray, get} from '@aerisweather/javascript-sdk/dist/utils/index';
import * as strings from '@aerisweather/javascript-sdk/dist/utils/strings';

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
    
    const isCurrent = data.isCurrent;
    const isLast = data.isLast;
    const type: string = get(data, 'traits.type');
    if (isLast) {
        // console.log(data);
        // console.log(data.movement);
        // const bearing = data.movement ? data.movement.dirToDEG : 0;
        const bearing = data.bearing ? data.bearing: 0;
      
        return {
            className: 'marker-stormcell',
            svg: {
                hidden: true,
                shape: {
                    type: 'path',
                    // path: "M0,-5L10,0L0,5Z",
                     //path: "M 20 300 L 140 20 L 260 300 z",
                     path: "M 255 0 L 12 503 L 498 503 z",
                    //path: "M497.25,357v-51l-204-127.5V38.25C293.25,17.85,275.4,0,255,0c-20.4,0-38.25,17.85-38.25,38.25V178.5L12.75,306v51 l204-63.75V433.5l-51,38.25V510L255,484.5l89.25,25.5v-38.25l-51-38.25V293.25L497.25,357z",
                    fill: {
                        color: '#ffffff'
                    },
                   transform: `rotate(${bearing},255,255)`
                },
                viewBox: "0 0 520 520"
            },
            size: [15,15]
        }
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
            size: isCurrent ? [15,15] : [10, 10]
        };
}
export const formatStormCells = (data: any): any => {
    //console.log('formatcells',data);
    if (isArray(data)) {
        data.forEach((cell: any) => { 
            const { id, ob, loc, forecast, place, traits } = cell;
            const startLat = loc.lat;
            const startLng = loc.long;
			cell.points = [{
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
				(forecast.locs || []).forEach((loc: any) => {
                    const endLat = loc.lat;
                    const endLng = loc.long;
                    const trueBearing = bearing(startLat,startLng,endLat,endLng);
                    let isLast = false;
                    if (forecast.locs[forecast.locs.length -1] === loc) {
                        isLast = true;
					cell.points.push({
						...ob,
						timestamp: loc.timestamp,
                        dateTimeISO: loc.dateTimeISO,
                        bearing: trueBearing,
                        place,
                        forecast,
                        traits,
						loc: {
							lat: loc.lat,
							lon: loc.long
						},
                        isCurrent: false,
                        isLast: isLast
                    });
                }
				});
			}
        });
    }
   // console.log(data);
    return data;
}
export const getStormCellForecast = (aeris: any, forecast: any) => {
    const utils = aeris.utils;
    const request = aeris.api();

    let final: any = [];
    for(let i = 0; i < forecast.locs.length; i++) {
         request.addRequest(aeris.api().endpoint('places').place(`${forecast.locs[i].lat},${forecast.locs[i].long}`).fields('place.name,place.state'));
    }
    
    request.get().then((result: any) => {
        const locations = {...result.data.responses};
        for(let i = 0; i < forecast.locs.length; i++) {
            let obj: any = { };
            
            let place = `${result.data.responses[i].response.place.name}, ${result.data.responses[i].response.place.state}`;
            let time = utils.dates.format(new Date(forecast.locs[i].timestamp * 1000), 'h:mm a, MMM d, yyyy');
            obj['place'] = place;
            obj['time'] = time;
            final.push(obj);
        }
    });
    return final;
}

export const getStormReportMarkerContent = (data: any) => {
    
    const latPos = Math.abs(data.loc.lat) + ((data.loc.lat < 0) ? 'S' : 'N');
    const lonPos = Math.abs(data.loc.long) + ((data.loc.long < 0) ? 'W' : 'E');
    let details = '';
    if (data.report.cat === 'hail') {
        if (!isEmpty(data.report.detail.hailIN)) {
            details = `
            <div class="row">
                <div class="label">Hail Diameter:</div>
                <div class="value">${(data.report.detail.hailIN).toFixed(2)} in</div>
            </div>`;
        }
    }
    if (data.report.cat === 'wind') {
        if (!isEmpty(data.report.detail.windSpeedMPH)) {
            details = `
            <div class="row">
                <div class="label">Wind Speed:</div>
                <div class="value">${data.report.detail.windSpeedMPH} mph</div>
            </div>`;
        }
    }
    if (data.report.cat === 'rain') {
        if (!isEmpty(data.report.detail.rainIN)) {
            details = `
            <div class="row">
                <div class="label">Rainfall:</div>
                <div class="value">${(data.report.detail.rainIN).toFixed(2)} in</div>
            </div>`;
        }
    }
    return (`<div class="content">
                <div class="title">${strings.toName(data.report.type)}</div>
                <div class="row">
                    <div class="label">Location:</div>
                    <div class="value">${data.report.name}</div>
                </div>
                <div class="row">
                    <div class="label">Date:</div>
                    <div class="value">${formatDate(new Date(data.report.timestamp * 1000), 'h:mm a, MMM d, yyyy')}</div>
                </div>
                ${details}
                <div class="row">
                    <div class="label">Reporter:</div>
                    <div class="value">${data.report.reporter}</div>
                </div>
                <div class="row">
                    <div class="label">WFO:</div>
                    <div class="value">${(data.report.wfo).toUpperCase()}</div>
                </div>
                ${!isEmpty(data.report.comments) ? `
                <div class="row">
                    <div class="label">Comments</div>
                    <div class="value">${data.report.comments}</div>
                </div>` : ''}
            </div>`);

};

const toRadians = (degrees: any) => {
    return degrees * Math.PI/180;

}

const toDegrees = (radians: any) => {
    return radians * 180/Math.PI;
}
const bearing = (startLat: any, startLng: any, endLat: any, endLng: any) => {

    startLat = toRadians(startLat);
    startLng = toRadians(startLng);
    endLat = toRadians(endLat);
    endLng = toRadians(endLng);

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = Math.atan2(y, x);
    bearing = toDegrees(bearing);
    return (bearing + 360) % 360;

}