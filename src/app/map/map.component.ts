import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { Subscription } from 'rxjs/Subscription';
import { UserSelectionService } from '../services/user-selection.service';
import { StarsAPIService } from '../services/stars-api.service';

declare const ol: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  /**
   Properties
   */

  map: any;
  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string[] = [];

  /**
   * Component Life-cycle Methods
   */
  constructor(private userSelectionService: UserSelectionService, private starsAPIService: StarsAPIService) {

    // subscribe to the study area selection by the user
    this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
      studyArea => {
        this.studyArea = studyArea;
        this.addStudyAreaAsMapLayer(this.studyArea);
      }
    );

    // subscribe to the start year selection by the user
    this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
      startYear => {
        this.startYear = startYear;
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {
        this.endYear = endYear;
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {
        this.cropTypes = cropTypes;

        // add farm fields to map
        starsAPIService.fetchFarmFields(this.studyArea['properties']['id'], this.startYear, this.endYear).then((response) => {
          return response;
        }).then((data) => {
          const results = data['results'];
          this.addFarmFieldsAsMapLayer(results);
        });
      }
    );
  }

  ngOnInit() {
    this.initializeMap();
    this.addTopoMapLayer();
    this.addAerialMapLayer();
    this.initializeLayerVisibility(this.map);
    // this.initializeFeatureClick(this.map);
  }

  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
  }

  /**
   * For initializing the map
   */
  initializeMap() {

    // create map
    this.map = new ol.Map({
      target: 'map',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
      ]),
      view: new ol.View({
        center: ol.proj.fromLonLat([AppConfiguration.mapCenterLng, AppConfiguration.mapCenterLat]),
        zoom: AppConfiguration.mapZoom
      }),
      interactions: ol.interaction.defaults({mouseWheelZoom: false})
    });
  }

  /**
   * Utility for adding the topo layer to the map
   */
  addTopoMapLayer() {
    const topoSource = new ol.source.XYZ({
      url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
    });

    const topoLayer = new ol.layer.Tile({
      source: topoSource
    });

    const mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(0, topoLayer);
  }

  /**
   * Utility for adding the aerial layer to the map
   */
  addAerialMapLayer() {
    const bingSource = new ol.source.BingMaps({
      key: AppConfiguration.bingKey,
      imagerySet: 'AerialWithLabels'
    });

    const bingLayer = new ol.layer.Tile({
      source: bingSource
    });

    const mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(1, bingLayer);
  }

  /**
   * Utility for handling layer visibility based on map zoom level
   * @param map
   */
  initializeLayerVisibility(map: any) {
    this.map.on('moveend', function(){
      const zoomLevel = map.getView().getZoom();
      const mapLayersCollection = map.getLayers();
      const topoLayer = mapLayersCollection.item(0);
      const aerialLayer = mapLayersCollection.item(1);

      if (zoomLevel >= 9) {

        // zoomed in, show aerial
        topoLayer.setVisible(false);
        aerialLayer.setVisible(true);
      } else {

        // zoomed out, show topo
        topoLayer.setVisible(true);
        aerialLayer.setVisible(false);
      }
    });
  }

  /**
   * Utility for handling when user clicks on a map feature
   */
  initializeFeatureClick(map: any) {

    // style for selected feature
    const polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 255, 1.0)',
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    });

    // for the select feature interaction
    const selectClick = new ol.interaction.Select({
      condition: ol.events.condition.click,
      style: polygonStyle
    });

    // click the feature, highlight on selection, and showing a popup
    map.addInteraction(selectClick);
    selectClick.on('select', function(evt) {
      const features = evt.target.getFeatures();
      const feature = features.item(0);
      const cropType = feature.get('croptype');
      if(cropType !== undefined) {
        console.log('Show popup that says ... ' + cropType);
        // TODO ENDED HERE
        // TODO ZOOM TO FARM FIELD
        // TODO SHOW POPUP WITH CROP TYPE NAME
      }
    });
  }

  /**
   * Utility for creating the study area GeoJSON object for the input study area name
   * @param studyAreaJSON - the JSON representation of the Study Area
   * @returns {{}} - the geojson for the study area name
   */
  createStudyAreaGeoJSON(studyAreaJSON: JSON) {

    // re-project STARS API coordinates from EPSG: 4326 to 3857
    const projectedCoordinates: any[] = [];
    const originalCoordinates = studyAreaJSON['geometry']['coordinates'][0];
    originalCoordinates.forEach(function(item) {
      const projected = ol.proj.transform([item[0], item[1]], 'EPSG:4326', 'EPSG:3857');
      projectedCoordinates.push(projected);
    });

    // geojson object template
    return {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              projectedCoordinates
            ]
          },
          'properties': {
            'id': 1000
          }
        }
      ]
    };
  }

  /**
   * Utility for adding a study area's geojson as a map layer
   * @param studyAreaJSON
   */
  addStudyAreaAsMapLayer(studyAreaJSON: JSON) {
    const studyAreaGeoJSON = this.createStudyAreaGeoJSON(studyAreaJSON);
    const geoJSON = new ol.format.GeoJSON({
      projection: 'EPSG:3857'
    });

    const vectorSource = new ol.source.Vector({
      features: (geoJSON).readFeatures(studyAreaGeoJSON)
    });

    const polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(102, 153, 67, 1.0)',
        lineDash: [4],
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(102, 153, 67, 0.0)'
      })
    });

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: polygonStyle
    });

    const mapLayersCollection = this.map.getLayers();
    mapLayersCollection.insertAt(2, vectorLayer);

    this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
  }

  /**
   * Utility for creating the farmfields GeoJSON
   */
  createFarmFieldsGeoJson(farmFieldFeatures) {
    const geoJSONFeatures: any[] = [];
    for (const item of farmFieldFeatures) {

      // re-project STARS API coordinates from EPSG: 4326 to 3857
      const projectedCoordinates: any[] = [];
      const originalCoordinates = item['geometry']['coordinates'][0];
      originalCoordinates.forEach(function(item) {
        const projected = ol.proj.transform([item[0], item[1]], 'EPSG:4326', 'EPSG:3857');
        projectedCoordinates.push(projected);
      });

      // create feature with re-projected coordinates
      const feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            projectedCoordinates
          ]
        },
        'properties': {
          'study_area_oid': item['properties'].oid,
          'oid': item['properties'].oid,
          'croptype': item['properties'].croptype,
          'fieldwork': item['properties'].fieldwork,
          'year_start': item['properties'].year_start
        }
      };
      geoJSONFeatures.push(feature);
    }

    // geojson object template
    const geoJSON =  {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': geoJSONFeatures
    };

    return geoJSON;
  }

  /**
   * Utility for adding the farm field's geojson as a map layer
   * @param farmFieldFeatures
   */
  addFarmFieldsAsMapLayer(farmFieldFeatures: any) {

    // remove any previously added farm fields on the map (as user changes the selected crops)
    const mapLayersCollection = this.map.getLayers();
    const farmFieldsLayer  = mapLayersCollection.item(3);
    if(farmFieldsLayer !== undefined) {
      this.map.removeLayer(farmFieldsLayer);
    }

    // because the API returns ALL farm fields, filter for the crops chosen by the user
    const cropTypes = this.cropTypes;
    const targetCropFeatures = [];
    farmFieldFeatures.forEach(function(item){
      if (cropTypes.includes(item['properties']['croptype'])) {
        targetCropFeatures.push(item);
      }
    });

    // add the farm fields to the map
    if (targetCropFeatures.length > 0) {
      const farmFieldsGeoJSON = this.createFarmFieldsGeoJson(targetCropFeatures);
      const geoJSON = new ol.format.GeoJSON({
        projection: 'EPSG:3857'
      });

      const vectorSource = new ol.source.Vector({
        features: (geoJSON).readFeatures(farmFieldsGeoJSON)
      });

      const polygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(102, 153, 67, 1.0)',
          lineDash: [4],
          width: 4
        }),
        fill: new ol.style.Fill({
          color: 'rgba(102, 153, 67, 0.1)'
        })
      });

      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: polygonStyle
      });

      mapLayersCollection.insertAt(3, vectorLayer);
      this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
    }
  }
}
