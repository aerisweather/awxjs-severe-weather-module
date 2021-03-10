import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import { ucwords } from '@aerisweather/javascript-sdk/dist/utils/strings';
import { formatDate, get } from '@aerisweather/javascript-sdk/dist/utils/index';
import { getMagnitude } from '../utils';

const color = (code: string): string => {
    code = code.toLowerCase();

    switch (code) {
        case 'avalanche':
            return '#639fec';
        case 'blizzard':
            return '#4100e2';
        case 'flood':
            return '#117d00';
        case 'fog':
            return '#767676';
        case 'ice':
            return '#e100e2';
        case 'hail':
            return '#62def7';
        case 'lightning':
            return '#8c8c8c';
        case 'rain':
            return '#38e600';
        case 'snow':
            return '#175cef';
        case 'tides':
            return '#40db83';
        case 'tornado':
            return '#c50000';
        case 'wind':
            return '#d8cc00';
        default:
            return '#000000';
    }
};

class StormReports extends MapSourceModule {
    private request: ApiRequest;

    get id(): string {
        return 'stormreports';
    }

    source(): any {
        return {
            type: 'vector',
            requreBounds: true,
            data: {
                service: () => this.request
            },
            style: {
                marker: (data: any) => {
                    const type: string = get(data, 'report.cat');

                    return {
                        className: 'marker-stormreport',
                        svg: {
                            shape: {
                                type: 'circle',
                                fill: {
                                    color: color(type)
                                },
                                stroke: {
                                    color: '#ffffff',
                                    width: 2
                                }
                            }
                        },
                        size: [14, 14]
                    };
                }
            }
        };
    }

    controls(): any {
        return {
            value: this.id,
            title: 'Storm Reports'
        };
    }

    infopanel(): any {
        return {
            views: [{
                data: (data: any): any => {
                    const payload = get(data, 'stormreports');

                    if (!payload) {
                        return;
                    }

                    return payload;
                },
                renderer: (data: any) => {
                    if (!data) return;

                    const rows: any[] = [{
                        label: 'Location',
                        value: data.report.name
                    }, {
                        label: 'Description',
                        value: ucwords(data.report.type)
                    }, {
                        label: 'Magnitude',
                        value: getMagnitude(data.report)
                    }, {
                        label: 'Report Time',
                        value: formatDate(
                            new Date(data.report.timestamp * 1000),
                            'h:mm a, MMM d, yyyy'
                        )
                    }, {
                        label: 'Remarks',
                        value: data.report.comments || ''
                    }];

                    const content = rows
                        .reduce((result, row) => {
                            result.push(`
                                <div class="awxjs__ui-row">
                                    <div class="awxjs__ui-expand label">${row.label}</div>
                                    <div class="awxjs__ui-expand value">${row.value}</div>
                                </div>
                            `);

                            return result;
                        }, [])
                        .join('\n');

                    return `
                        <div class="awxjs__app__ui-panel-info__table">
                            ${content}
                        </div>
                    `;
                }
            }]
        };
    }

    onMarkerClick(marker: any, data: any) {
        if (!data) return;
        const { id, report } = data;
        const type = ucwords(report.type);
        this.showInfoPanel(`${type}`).load({ p: id }, { stormreports: data });
    }

    onInit() {
        const request = this.account.api().endpoint('stormreports');
        this.request = request;
    }
}

export default StormReports;
