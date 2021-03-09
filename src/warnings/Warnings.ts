import MapSourceModule from '@aerisweather/javascript-sdk/dist/modules/MapSourceModule';
import ApiRequest, { ApiAction } from '@aerisweather/javascript-sdk/dist/network/api/ApiRequest';
import * as utils from '@aerisweather/javascript-sdk/dist/utils/index';
import { toName } from '@aerisweather/javascript-sdk/dist/utils/strings';

class Warnings extends MapSourceModule {
    private request: ApiRequest;

    get id(): string {
        return 'warnings';
    }

    source(): any {
        const properties: any = {
            root: 'features',
            id: 'properties.details.loc',
            category: 'properties.details.cat',
            path: 'geometry'
        };

        return {
            type: 'vector',
            data: {
                service: () => this.request,
                properties
            },
            style: {
                polygon: (item: any) => ({
                    fill: {
                        color: `#${utils.get(item, 'properties.details.color')}`,
                        opacity: 0.4,
                        weight: 3
                    },
                    stroke: {
                        color: `#${utils.get(item, 'properties.details.color')}`,
                        width: 2,
                        weight: 3
                    }
                })
            }
        };
    }

    controls(): any {
        return {
            value: this.id,
            title: 'Warnings'
        };
    }

    infopanel(): any {
        return {
            views: [{
                data: (data: any) => data.alert.details,
                renderer: (data: any) => {
                    if (!data) {
                        return;
                    }

                    return `<div class="alert">${(data.body || '').replace(/\n/g, '<br>')}</div>`;
                }
            }]
        };
    }

    onInit() {
        const request = this.account.api()
            .endpoint('advisories')
            .action(ApiAction.SEARCH)
            .filter('usa')
            .query('type:TO.W;type:SV.W;type:FF.W;')
            .fields('details.type,details.name,details.body,details,geoPoly')
            .limit(100)
            .format('geojson');

        this.request = request;
    }

    onShapeClick(shape: any, data: any) {
        const source = data.awxjs_source;
        const props = data.properties || {};

        if (source === 'warnings') {
            this.showInfoPanel(props.details.name).load(`${toName(props.details.name)}`, {
                alert: props
            });
        }
    }
}

export default Warnings;
