import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';

// reference to leaflet
//declare let L: any;
declare let ol: any;

@Component({
  selector: 'app-study-area',
  templateUrl: './study-area.component.html',
  styleUrls: ['./study-area.component.css']
})
export class StudyAreaComponent implements OnInit {

  /**
    Properties
   */

  // represents the study area options a user can choose
  studyAreas: any[] = [];
  selectedStudyAreaName: string;
  selectedStudyAreaId: number;

  // represents the start year options a user can choose
  selectedStartYear: number;
  startYears: number[] = [];

  // represents the end year options a user can choose
  selectedEndYear: number = null;
  endYears: number[] = [];

  // represents the crop options a user can choose
  selectedCrop: string;
  cropNames = [];

  // the Leaflet map
  map: any;

  /**
   * Component Life-cycle Methods
   */
  constructor(private starsAPIService: StarsAPIService) {

    // fetch study areas from the API
    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {

      // use the study areas response as the data for the study area options and associated start/end year options
      let results = data.results;
      this.initializeStudyAreaOptions(results, this.studyAreas);
      this.initializeStartYearOptions(results, this.startYears);
      this.initializeEndYearOptions(results, this.endYears);

    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.initializeMap();
    this.addTopoMapLayer();
    this.addAerialMapLayer();
    this.initializeLayerVisibility(this.map);
  }

  /**
   * For initializing the study area options
   * @param results - the results from the async call to the API for study areas
   * @param studyAreas - the instance property that represents a collection of study areas
   */
  initializeStudyAreaOptions(results: JSON[], studyAreas: JSON[]) {
    results.forEach(function(item) {
      studyAreas.push(item);
    })
  }

  /**
   * For initializing the start year options a user can choose from
   * @param results - the results from the async call to the API for study areas
   * @param startYears - the collection of all start years
   */
  initializeStartYearOptions(results: any, startYears: any) {
    results.forEach(function(item) {
      startYears.push(item.properties.year_start);
    })
  }

  /**
   * For initializing the end year options a user can choose from
   * @param results - the results from the async call to the API for study areas
   * @param endYears - the collection of all end years
   */
  initializeEndYearOptions(results: any, endYears: any) {
    results.forEach(function(item) {
      endYears.push(item.properties.year_end);
    })
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
   * Handles when a user selects a study area option
   */
  onStudyAreaChange() {

    // get selected study area name
    let targetStudyAreaName = this.selectedStudyAreaName;

    // get strudy area Id
    this.selectedStudyAreaId = this.fetchStudyAreaId(targetStudyAreaName);

    // get study area geoJSON
    let geoJSONObject = this.createStudyAreaGeoJSON(targetStudyAreaName);

    // add the study area as a map layer
    this.addStudyAreaMapLayer(geoJSONObject);
  }

  /**
   * Utility for fetching the study area Id for the input study area name
   * @param targetStudyAreaName
   */
  fetchStudyAreaId(targetStudyAreaName: string) {
    let result: number = null;
    this.studyAreas.forEach(function(item){
      if(item.properties.name == targetStudyAreaName) {
        result = item.properties.id;
      }
    });
    return result;
  }

  /**
   * Utility for creating the study area GeoJSON object for the input study area name
   * @param targetStudyAreaName - the name of the study area we want the associated geojson for
   * @returns {{}} - the geojson for the study area name
   */
  createStudyAreaGeoJSON(targetStudyAreaName: string) {

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
   * Handle when a user selects a start year option
   */
  onStartYearChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaId;
    let startYear = this.selectedStartYear;

    // fetch farm fields
    this.starsAPIService.fetchFarmFields(studyAreaId, startYear).then((response) => {
      return response;
    }).then((data) => {

      // add farm fields geojson to map
      if (data.results.length > 0) {
        let farmFieldsFeatureArray = data.results;
        let farmFieldGeoJSON = this.createFarmFieldsGeoJson(farmFieldsFeatureArray);
        this.addFarmFieldsMapLayer(farmFieldGeoJSON);
      }
    }).catch((error) => {
      console.log(error);
    });

    // fetch crops
    let cropNames = this.cropNames;
    this.starsAPIService.fetchCropTypes(studyAreaId, startYear, null).then((response) => {
      return response;
    }).then((data) => {
      let results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          let cropName = item.name;
          cropNames.push(cropName);
        })
      }
    }).catch((error) => {
      console.log(error);
    })
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

  /**
   * Handles when a user selects an end year option
   */
  onEndYearChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaId;
    let startYear = this.selectedStartYear;
    let endYear = this.selectedEndYear;
    let cropNames = this.cropNames = [];

    this.starsAPIService.fetchCropTypes(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      let results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          let cropName = item.name;
          cropNames.push(cropName);
        })
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   * Handles when a user selects a crop type option
   */
  onCropTypeChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaId;
    let startYear = this.selectedStartYear;
    let endYear = this.selectedEndYear;
    let crop = this.selectedCrop;

    console.log('study area: ' + studyAreaId + ' startYear: ' + startYear + ' endYear: ' + endYear + ' crop: ' + crop);

    this.starsAPIService.fetchImageCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    })
  }
}
