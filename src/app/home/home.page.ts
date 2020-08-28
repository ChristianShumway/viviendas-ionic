import { Component } from '@angular/core';
import * as L from 'leaflet';
import { ViviendasService } from '../services/viviendas.service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

const leafletcached = require("./../../assets/librerias-externas/pouchdbcached");
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
  backgroundColor:  '#e85141'
});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: L.Map;
  listKeys: any;
  listaViviendas: any[];
  latLonViviendas: any[] = [];
  layer;
  polygon;
  livingPlaceCount: number = 0;

  constructor(
    private viviendasService: ViviendasService,
    private storage: Storage,
    private toastController: ToastController
  ) {}

  ionViewDidEnter() {
    // this.leafletMap();
    this.initMap();
    this.getViviendas();
  }

  leafletMap() {
    this.map = new L.Map('mapId2').setView([12.972442, 77.594563], 13);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'edupala.com'
    }).addTo(this.map);

    const markPoint = L.marker([12.972442, 77.594563]);
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    this.map.addLayer(markPoint);
  }

  async getViviendas() {

    this.listKeys = await this.storage.get('isKeysRegistered');
    
    await this.viviendasService.getViviendas(this.listKeys.cveEnt, this.listKeys.cveEnc)
      .then( response => {
        this.listaViviendas = response;
        let markerArray = [];
        console.log(this.listaViviendas);

        response.map(vivienda => {
          const color = vivienda.color.replace(/ /g, ",");
          const geoGeojson = JSON.parse(vivienda.geojson_geo);
          const lat = JSON.parse(geoGeojson.coordinates[0]);
          const lon = JSON.parse(geoGeojson.coordinates[1]);
          const circle = L.circleMarker([lon, lat], {
            radius: 20,
            color: `rgba(${color})`,
          });

          circle.bindPopup(this.viviendasService.makePopup(lat, lon));
          circle.addTo(this.map);
          this.latLonViviendas.push(circle._latlng);
          markerArray.push(L.marker([lon, lat]));
        });

        const group = L.featureGroup(markerArray);
        this.map.fitBounds(group.getBounds());
      })
      .catch(error => console.log(error))
  }

  private initMap(): void {
    this.map = L.map('map',{ crs: L.CRS.EPSG900913}).setView([40,-100], 4);

    this.layer = L.tileLayer.wms('geoserver/mnv/wms?', {
      layers: 'td_localidades',
      transparent:true,
      format: 'image/gif',
      //cql_filter:"ambito='U'",
      id: 'xpain.test-cach',
      useCache: true,
      crossOrigin: true
    });

    this.layer.on('tilecachehit',function(ev){
			console.log('Desde Cache: ', ev.url);
		});
		this.layer.on('tilecachemiss',function(ev){
			console.log('No Cacheado: ', ev.url);
		});
		this.layer.on('tilecacheerror',function(ev){
			console.log('Cache error: ', ev.tile, ev.error);
		});

    this.layer.addTo(this.map);
    this.layerWMS();
    this.displayProgress();
  }


  layerWMS(){
    var wmsLayer = L.tileLayer.wms("NLB_CE/balancer.do?map=/opt/map/viviendaproduc.map&", {
			layers: 'c100,c103t,c101,c108t,c109t,c113t,c500t,c530t,c102t,c114t,c110,c501t,c531t,c809,c502t,c532t,c503t,c536t,c533t,c537t,c112t,c119t,c111t,c539t,c116t,c504t,c529t,c534t,c535t,c505t',
			format: 'image/png',
			transparent: true,
			attribution: "INEGI 2020",

			EDO:'01',
			NIVEL:'PB',
			CONTORNO:'FALSE',
			EAR:'TRUE',
			EGR:'TRUE',
			EGU:'TRUE',

			useCache: true,
			//cacheMaxAge: 30 * 1000,	// 30 seconds
			crossOrigin: true
    });

		wmsLayer.addTo(this.map);

		wmsLayer.on('tilecachehit',function(ev){
			console.log('Desde Cache: ', ev.url);
		});
		wmsLayer.on('tilecachemiss',function(ev){
			console.log('no cacheado: ', ev.url);
		});
		wmsLayer.on('tilecacheerror',function(ev){
			console.log('Cache error: ', ev.tile, ev.error);
    });
  }

  // Seed the base layer, for the whole world, for zoom levels 0 through 4.
  seed() {
    var bbox = L.latLngBounds(L.latLng(-80,-180), L.latLng(85,180));
    this.layer.seed( bbox, 0, 4 );
  }

  displayProgress(){
     // Display seed progress on console
		this.layer.on('seedprogress', function(seedData){
			var percent = 100 - Math.floor(seedData.remainingLength / seedData.queueLength * 100);
			console.log('Seeding ' + percent + '% done');
		});
		this.layer.on('seedend', function(seedData){
			console.log('Cache seeding complete');
		});
  }

  levelZoom(e){
    console.log(e.latlng);
    this.map.setView(e.latlng, 13);
  }


  printMapViviendas(){
    this.livingPlaceCount = 0;
    let offset = 0;

    this.listaViviendas.map( vivienda => {
      setTimeout( () => {
        if(this.polygon){
          this.clearEntidad();
        }

        this.polygon = L.geoJSON(JSON.parse(vivienda.geojson_buffer_geo)).addTo(this.map);
        this.moveZoom();
        this.livingPlaceCount = this.livingPlaceCount + 1;
        if (this.livingPlaceCount === this.listaViviendas.length) {
          this.clearEntidad();
        }
        this.presentToast();
        // this.presentToastWithOptions();
        // console.log(vivienda);
      }, 4000 + offset );
      offset += 4000;
    });
  }

  clearEntidad(){
    this.map.removeLayer(this.polygon);
  };

  moveZoom(){
    this.map.fitBounds(this.polygon.getBounds());
  }

  ionViewWillLeave() {
    this.map.remove();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `Hay ${this.livingPlaceCount} vivienda(s) recorrida(s) de ${this.listaViviendas.length} existentes.`,
      duration: 2000,
      position:'top'
    });
    toast.present();
  }


}
