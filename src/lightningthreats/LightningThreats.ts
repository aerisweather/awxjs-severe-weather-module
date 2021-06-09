import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';

class LightningThreats extends MapSourceModule {
    private request: ApiRequest;

    get id(): string {
        return 'lightningthreats';
    }

    source(): any {
        const properties: any = {
            root: 'features',
            path: 'geometry'
        };

        return {
            type: 'vector',
            requreBounds: true,
            data: {
                service: () => this.request,
                properties
            },
            style: {
                polygon: () => ({
                    fill: {
                        color: '#FFDB00',
                        opacity: 0.6
                    }
                })
            }
        };
    }

    controls(): any {
        return {
            value: this.id,
            title: 'Lightning Threats',
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
            .endpoint('lightning/summary')
            .format('geojson')
            .filter('threat,geo')
            .from('-15minutes');
        this.request = request;
    }
}

export default LightningThreats;
