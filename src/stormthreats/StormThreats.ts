import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';

class StormThreats extends MapSourceModule {
    private request: ApiRequest;

    get id() {
        return 'stormthreats';
    }

    source(): any {
        const properties: any = {
            root: 'features',
            path: 'geometry'
        };

        return {
            type: 'vector',
            requiresBounds: true,
            data: {
                service: () => this.request,
                properties
            },
            style: {
                polygon: () => ({
                    fill: {
                        color: '#ffa500',
                        opacity: 0.65
                    }
                })
            }
        };
    }

    controls(): any {
        return {
            value: this.id,
            title: 'Storm Threats',
            controls: {
                settings: [{
                    type: 'opacity'
                }]
            }
        };
    }

    onInit() {
        const request = this.account
            .api()
            .endpoint('stormcells/summary')
            .format('geojson')
            .limit(1)
            .filter('threat,geo');
        this.request = request;
    }
}

export default StormThreats;
