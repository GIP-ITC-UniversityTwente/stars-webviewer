import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { Subscription } from 'rxjs/Subscription';
import { UserSelectionService } from '../services/user-selection.service';

declare let ol: any;

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit, OnDestroy {

  /**
   Properties
   */

  // the Leaflet map
  map: any;
  subscriptionToSelectedStudyArea: Subscription;
  selectedStudyArea: any;

  /**
   * Component Life-cycle Methods
   */
  constructor(private userSelectionService: UserSelectionService) {

    // subscribe to changes to UserSelectionService.studyArea
    this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
      studyArea => {

        console.log("hello...");

        this.selectedStudyArea = studyArea;

        console.log("THE MAP COMPONENT KNOWS THAT THE STUDY AREA IS: " + this.selectedStudyArea);
      }
    );
  }

  ngOnInit() {

    this.initializeMap();
    this.addTopoMapLayer();
    this.addAerialMapLayer();
    this.initializeLayerVisibility(this.map);
  }

  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
  }

  /**
   * For initializing the map
   */
  initializeMap() {

    // create map
    this.map = new ol.Map({
      target: 'map',
      view: new ol.View({
        center: ol.proj.fromLonLat([AppConfiguration.mapCenterLng, AppConfiguration.mapCenterLat]),
        zoom: AppConfiguration.mapZoom
      }),
      interactions: ol.interaction.defaults({mouseWheelZoom:false})
    });
  }

  /**
   * Utility for adding the topo layer to the map
   */
  addTopoMapLayer() {

    let topoSource = new ol.source.XYZ({
      url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
    });

    let topoLayer = new ol.layer.Tile({
      source: topoSource
    });

    let mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(0, topoLayer);
  }

  /**
   * Utility for adding the aerial layer to the map
   */
  addAerialMapLayer() {

    let bingSource = new ol.source.BingMaps({
      key: AppConfiguration.bingKey,
      imagerySet: 'AerialWithLabels'
    });

    let bingLayer = new ol.layer.Tile({
      source: bingSource
    });

    let mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(1, bingLayer);
  }

  /**
   * Utility for handling layer visibility based on map zoom level
   * @param map
   */
  initializeLayerVisibility(map: any) {

    this.map.on("moveend", function(){

      let zoomLevel = map.getView().getZoom();
      let mapLayersCollection = map.getLayers();
      let topoLayer = mapLayersCollection.item(0);
      let aerialLayer = mapLayersCollection.item(1);

      if (zoomLevel >= 9) {

        // zoomed in, show aerial
        topoLayer.setVisible(false);
        aerialLayer.setVisible(true);
      }
      else {

        // zoomed out, show topo
        topoLayer.setVisible(true);
        aerialLayer.setVisible(false);
      }
    })
  }

  /**
   * Utility for creating the study area GeoJSON object for the input study area name
   * @param targetStudyAreaName - the name of the study area we want the associated geojson for
   * @returns {{}} - the geojson for the study area name
   */
  createStudyAreaGeoJSON(targetStudyAreaName: string) {

    /*
    let projectedCoordinates: any[] = [];
    this.studyAreas.forEach(function(item){
      if(item.properties.name == targetStudyAreaName) {

        // re-project STARS API coordinates from EPSG: 4326 to 3857
        let originalCoordinates = item.geometry.coordinates[0];
        originalCoordinates.forEach(function(item){
          let projected = ol.proj.transform([item[0], item[1]], 'EPSG:4326','EPSG:3857');
          projectedCoordinates.push(projected);
        });
      }
    });

    // geojson object template
    return {
      "type": "FeatureCollection",
      "crs": {
        "type": "name",
        "properties": {
          "name": "EPSG:3857"
        }
      },
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              projectedCoordinates
            ]
          },
          "properties": {
            "id": 1000
          }
        }
      ]
    };
    */
  }

  /**
   * Utility for adding a study area's geojson as a map layer
   * @param studyAreaGeoJSON
   */
  addStudyAreaMapLayer(studyAreaGeoJSON: any) {

    let geoJSON = new ol.format.GeoJSON({
      projection: 'EPSG:3857'
    });

    let vectorSource = new ol.source.Vector({
      features: (geoJSON).readFeatures(studyAreaGeoJSON)
    });

    let polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(43, 126, 177, 1)',
        lineDash: [4],
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(43, 126, 177, 0.1)'
      })
    });

    let vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: polygonStyle
    });

    let mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(3, vectorLayer);

    this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
  }

  /**
   * Utility for creating the farmfields GeoJSON
   * @param farmFieldFeatures
   * */
  createFarmFieldsGeoJson(farmFieldFeatures: any) {

    let geoJSONFeatures: any[] = [];
    farmFieldFeatures.forEach(function(item){

      // re-project STARS API coordinates from EPSG: 4326 to 3857
      let originalCoordinates = item.geometry.coordinates[0];
      let projectedCoordinates: any[] = [];
      originalCoordinates.forEach(function(item){
        let projected = ol.proj.transform([item[0], item[1]], 'EPSG:4326','EPSG:3857');
        projectedCoordinates.push(projected);
      });

      // create feature with re-projected coordinates
      let feature = {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            projectedCoordinates
          ]
        },
        "properties": {
          "study_area_oid": item.properties.oid,
          "oid": item.properties.oid,
          "croptype": item.properties.croptype,
          "fieldwork": item.properties.fieldwork,
          "year_start": item.properties.year_start
        }
      };
      geoJSONFeatures.push(feature);
    });

    // geojson object template
    let geoJSON =  {
      "type": "FeatureCollection",
      "crs": {
        "type": "name",
        "properties": {
          "name": "EPSG:3857"
        }
      },
      "features": geoJSONFeatures
    };

    console.log(geoJSON);

    return geoJSON;
  }

  /**
   * Utility for adding the farm field's geojson as a map layer
   * @param farmFieldsGeoJSON
   */
  addFarmFieldsMapLayer(farmFieldsGeoJSON: any) {

    let geoJSON = new ol.format.GeoJSON({
      projection: 'EPSG:3857'
    });

    let vectorSource = new ol.source.Vector({
      features: (geoJSON).readFeatures(farmFieldsGeoJSON)
    });

    let polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        lineDash: [4],
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.1)'
      })
    });

    let vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: polygonStyle
    });

    let mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(3, vectorLayer);

    this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
  }
}
