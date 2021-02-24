import ModuleGroup from '@aerisweather/javascript-sdk/dist/modules/ModuleGroup';
import  IMapSourceModule from '@aerisweather/javascript-sdk/dist/modules/interfaces/IMapSourceModule';
import {getStormReportMarkerContent} from './utils';
import {loader as Warnings} from './warnings';
import {loader as StormThreats} from './stormthreats';
import {loader as LightningThreats} from './lightningthreats';
import {loader as StormReports} from './stormreports';
import {loader as StormCells} from './stormcells';
import InteractiveMapApp from '@aerisweather/javascript-sdk/dist/apps/InteractiveMapApp';
import InteractiveMap from '@aerisweather/javascript-sdk/dist/maps/interactive/InteractiveMap';
import { isset } from '@aerisweather/javascript-sdk/dist/utils';

class NewModuleGroup extends ModuleGroup {
	private _account: Account;
	private _app: InteractiveMapApp;
	private _map: InteractiveMap;
	initialize(account: Account, app: InteractiveMapApp, map: InteractiveMap = null) {
		this._account = account;
		this._app = app;
		this._map = app ? app.map : map;
	}
	public get account(): Account {
		return this._account;
	}
	public get app(): InteractiveMapApp {
		return this._app;
	}
	public get map(): InteractiveMap {
		return isset(this._app) ? this._app.map : this._map;
	}
}

class SevereGroup extends NewModuleGroup {
     
     get id() {
          return 'severe';

     }

     async load(): Promise<IMapSourceModule[]> {
          const warnings = await Warnings();
          const stormthreats = await StormThreats();
          const lightningthreats = await LightningThreats();
          const stormreports = await StormReports();
          const stormcells = await StormCells();
          // return new Promise((resolve, reject) => {
               // this._modules = [new Severe()];
               // resolve(this._modules);

          //});
		return new Promise<IMapSourceModule[]>((resolve, reject) => {
			this._modules = [
                    warnings,
                    stormthreats,
                    lightningthreats,
                    stormreports,
                    stormcells
			].map((Module) => new Module.default()); // eslint-disable-line new-cap
			resolve(this._modules);
		});

     }

     controls() {
          //const moduleButtons = this.modules ? this.modules.map((m) => m.controls()) : [];
         // const moduleButtons: any = [];
          //console.log(moduleButtons);
          const moduleButtons = [

               {
                    value: 'warnings',
                    title: 'Severe Warnings'
               },{
                    value: 'stormcells',
                            title: 'Storm Tracks',
                            id: 'stormcells',
                            filter: true,
                            multiselect: true,
                            segments: [{
                                value: 'all',
                                title: 'All'
                            },{
                                value: 'hail',
                                title: 'Hail'
                            },{
                                value: 'rotating',
                                title: 'Rotating'
                            },{
                                value: 'tornado',
                                title: 'Tornadic'
                            }]
               },{
                    value: 'lightning-strikes-5m-icons',
                    title: 'Lightning Strikes'
               },
               {   
                    value: 'stormreports',
                    title: 'Severe Reports' 
               },
               {
                    value: 'stormthreats',
                    title: 'Threat Areas'
               },
               {
                    value: 'lightningthreats',
                    title: 'Lightning Areas'
               }
               ];

          return {
               title: 'Severe Weather',
               //buttons: this.modules ? this.modules.map((m) => m.controls()) : []
               buttons: moduleButtons
          };
     }

     onMarkerClick(marker: any, data: any) {
          if (data) {
              const source = data.awxjs_source;
          //     if (source == 'stormcells') {
          //         console.log(data);
          //         const popupContent = getStormCellContent(data);

          //      //    marker.unbindPopup().bindPopup(popupContent, {
          //      //        className: 'tropical-popup',
          //      //        maxWidth : 500,
          //      //    }).openPopup();
          //        this.app.map.showCallout(data.marker, popupContent);
          //        const cellId = `${data.radarID}_${data.cellID}`;
          //        const newData = {stormcells: data};

          //        this.app.showInfo('stormcells', `Cell ID ${cellId}`).load(null, newData);
          //     }
               // if (source == 'stormreports') {
               //      const source = data.awxjs_source;
               //      const popupContent =getStormReportMarkerContent(data);

               //      marker.unbindPopup().bindPopup(popupContent, {
               //           className: 'tropical-popup',
               //           maxWidth : 500,
               //      }).openPopup();
               //      this.app.map.showCallout(data.marker, popupContent);
               // }
          }

      }
}

export default SevereGroup;
