import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

declare const ol: any;
declare const Popup: any;
declare const chroma: any;

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
  baseLayers:any;
  overlayLayers:any;
  topographyLayers:any;
  selectInteraction:any;
  mapPopup:any;
  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  studyAreaVectorSource: any;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string[] = [];
  layerSwitcher:any;
  subscriptionToClassifiedFmuIDs: Subscription;
  classifiedFmuIDs: any;
  classifiedFmuColors: any;

  /**
   * For dependency injecting needed Services.
   */
  constructor(private userSelectionService: UserSelectionService, private starsAPIService: StarsAPIService) {
    
    // subscribe to the study area selection by the user
    this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
      studyArea => {
        this.studyArea = studyArea;
        this.addStudyAreaAsMapLayer(this.studyArea);

        // clear previously chosen farm fields
        this.clearFarmFieldsFromMap();
        this.zoomToStudyAreaExtent();
      }
    );

    // subscribe to the start year selection by the user
    this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
      startYear => {

        // set start year
        this.startYear = startYear;

        // clear previously chosen farm fields
        this.clearFarmFieldsFromMap();
        this.zoomToStudyAreaExtent();
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {

        // set end year
        this.endYear = endYear;

        // clear previously chosen farm fields
        this.clearFarmFieldsFromMap();
        this.zoomToStudyAreaExtent();
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
    // subscribe to the groupedTimeSeriesData
    this.subscriptionToClassifiedFmuIDs = this.userSelectionService.classifiedFmuIDs$.subscribe(
      data => {
          this.applyFMUsColors(data);
          
      });
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {
    this.initializeMap();
    this.addTopoMapLayer();
    this.addAerialMapLayer();
    this.addTopographyLayers();
    this.initializeFeatureClick(this.map);
    
  }

  /**
   * Life-cycle hook after component is destroyed.
   */
  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
  }
  /**
   * For initializing the map.
   */
  
  applyFMUsColors(data:any) {
      let fmusLayer=null;
      this.map.getLayers().forEach(l=>{if(l.get('title')=='Layers'){
          l.getLayers().forEach(ll=>{
              if (ll.get('title')=='Farm fields'){
                  fmusLayer=ll;
              }
          });
      }});
      fmusLayer.setStyle(function(feature){
          let featureOid=feature.getProperties().oid;
          let i;
          for (i = 0; i < data.classifiedFmuIDs.length; i++) {
              let ii;
              for (ii = 0; ii < data.classifiedFmuIDs[i].length; ii++) {
                  if(featureOid==data.classifiedFmuIDs[i][ii]){
                      let featureColor=data.classifiedFmuColors[i];
                      return new ol.style.Style({
                          stroke: new ol.style.Stroke({
                              color: featureColor,
                              lineDash: [4],
                              width: 4
                            }),
                            fill: new ol.style.Fill({
                              color: 'rgba(102, 153, 67, 0.1)'
                            })
                          });
                  }
              }
          }
          const orange='#ff9933';
          const blue='#000099';
          const red='#ff0000';
          const green='#339933';
          const brown='#996633';
          const grey='#808080';
          const purple='#cc00cc';
          let color;
          if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Cotton'){
              color=orange;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Groundnut'){
              color=blue;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Maize'){
              color=red;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Millet'){
              color=green;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Other'){
              color=brown;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Sorgum'){
              color=grey;
          }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Uncultivated'){
              color=purple;
          }else{
              color='#808000';
          }
          const polygonStyle = new ol.style.Style({
              stroke: new ol.style.Stroke({
                //color: 'rgba(102, 153, 67, 1.0)',
                color: chroma(color).alpha(0.7).css(),
                width: 4
              }),
              fill: new ol.style.Fill({
                color: chroma(color).alpha(0.1).css()
              })
            });
          return polygonStyle
      });
      
      
  }
  /**
   * For initializing the map.
   */
  
  initializeMap() {
   // create basemap group
    this.baseLayers=new ol.layer.Group({
          title: 'Base',
          layers: []
        }
    );
 // create layers group
    this.overlayLayers=new ol.layer.Group({
        title: 'Layers',
        layers: []
      }
  );
    // create topography group
    this.topographyLayers=new ol.layer.Group({
        title: 'Topography',
        layers: []
      }
  );
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
      interactions: ol.interaction.defaults({mouseWheelZoom: false}),
      layers:[this.baseLayers,this.topographyLayers,this.overlayLayers]
    });

    this.layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Legend' // Optional label for button
    });
   this.map.addControl(this.layerSwitcher);
    // map goes global for debug purposes ONLY!!
   eval("map = this.map;");
    
  }

  /**
   * Utility for adding the topo layer to the map.
   */
  addTopoMapLayer() {
    const topoSource = new ol.source.XYZ({
      url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
    });

    const topoLayer = new ol.layer.Tile({
      source: topoSource,
      type: 'base',
      visible:false,
      title:'Open topo map'
    });

    let mapLayersCollection = this.baseLayers.getLayers();
    mapLayersCollection.insertAt(0, topoLayer);
  }
  
  /**
   * Utility for adding the Topography layers to the map.
   */
  addTopographyLayers() {
      const slopeLayer= new ol.layer.Tile({
          title:'Slope',
          visible:false,
          source: new ol.source.TileWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'slope', 'TILED': true},
            serverType: 'mapserver'
          })
        });
      
      const mapLayersCollection = this.topographyLayers.getLayers();
      mapLayersCollection.insertAt(0, slopeLayer);
      
      const aspectLayer= new ol.layer.Tile({
          title:'Aspect',
          visible:false,
          source: new ol.source.TileWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'aspect', 'TILED': true},
            serverType: 'mapserver'
          })
        });
      mapLayersCollection.insertAt(1, aspectLayer);
      const srtmLayer= new ol.layer.Image({
          title:'Elevation (SRTM)',
          visible:false,
          source: new ol.source.ImageWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'srtm', 'TILED': false},
            serverType: 'mapserver'
          })
        });
      mapLayersCollection.insertAt(2, srtmLayer);
      const tpi30Layer= new ol.layer.Tile({
          title:'TPI 30 meters',
          visible:false,
          source: new ol.source.TileWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'tpi30', 'TILED': true},
            serverType: 'mapserver'
          })
        });
      mapLayersCollection.insertAt(3, tpi30Layer);
      
      const tpi300Layer= new ol.layer.Tile({
          title:'TPI 300 meters',
          visible:false,
          source: new ol.source.TileWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'tpi300', 'TILED': true},
            serverType: 'mapserver'
          })
        });
      mapLayersCollection.insertAt(4, tpi300Layer);
      
      const tpi1000Layer= new ol.layer.Tile({
          title:'TPI 1000 meters',
          visible:false,
          source: new ol.source.TileWMS({
            url: 'https://stars.itc.nl/mapservices/topography',
            params: {'LAYERS': 'tpi1000', 'TILED': true},
            serverType: 'mapserver'
          })
        });
      mapLayersCollection.insertAt(5, tpi1000Layer);
      
//      const tpi2000Layer= new ol.layer.Tile({
//          title:'TPI 2000 meters',
//          visible:false,
//          source: new ol.source.TileWMS({
//            url: 'https://stars.itc.nl/mapservices/topography',
//            params: {'LAYERS': 'tpi2000', 'TILED': true},
//            serverType: 'mapserver'
//          })
//        });
//      mapLayersCollection.insertAt(5, tpi2000Layer);
  }

  /**
   * Utility for adding the aerial layer to the map.
   */
  addAerialMapLayer() {
    const bingSource = new ol.source.BingMaps({
      key: AppConfiguration.bingKey,
      imagerySet: 'AerialWithLabels'
    });

    const bingLayer = new ol.layer.Tile({
      source: bingSource,
      type: 'base',
      title:'Bing maps'
    });

    let mapLayersCollection = this.baseLayers.getLayers();
    mapLayersCollection.insertAt(1, bingLayer);
  }

  /**
   * Utility for handling layer visibility based on map zoom level.
   * @param map
   */
  initializeLayerVisibility(map: any) {
    const baseLayers=this.baseLayers
    this.map.on('moveend', function(){
      const zoomLevel = map.getView().getZoom();
      const baseLayersCollection = baseLayers.getLayers();
      const topoLayer = baseLayersCollection.item(0);
      const aerialLayer = baseLayersCollection.item(1);

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
   * Utility for handling when user clicks on a map feature.
   */
  initializeFeatureClick(layer:any) {
    const map=this.map;
    // style for selected feature
    const polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 0, 1.0)',
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 0, 0.1)'
      })
    });
    // for the select feature interaction
    this.selectInteraction = new ol.interaction.Select({
      condition: ol.events.condition.click,
      layers:[layer],
      style: polygonStyle
    });

    // click the feature, highlight on selection, and showing a popup
    this.map.addInteraction(this.selectInteraction);

    if(typeof(this.mapPopup)=='undefined'){
        this.mapPopup = new Popup();
        map.addOverlay(this.mapPopup);
    }
    
    const mapPopup=this.mapPopup;
    
    this.selectInteraction.on('select', function(evt) {
      const features = evt.target.getFeatures();
      const feature = features.item(0);
      if(evt.selected.length===0){
          if(mapPopup.isOpened()){
              mapPopup.hide()
          }
          return null;
      }
      const cropType = feature.get('croptype');
      const fieldType=feature.get('fieldwork') ? 'Fieldwork' : 'Non fieldwork'
      const farmArea=(Math.round(feature.getGeometry().getArea())/10000).toFixed(3);
      //console.log(feature);
      if(cropType !== undefined) {
        let featureCenter=ol.extent.getCenter(feature.getGeometry().getExtent());
        if(mapPopup.isOpened()){
            mapPopup.hide()
        }
        mapPopup.show(featureCenter, '<div><p><b>'+fieldType+'</b></p><p> <b>Crop</b>: '+cropType+'</p><p> <b>Area</b>: '+farmArea+' ha</p></div>');
      }
    });
  }

  /**
   * Utility for creating the study area GeoJSON object for the input study area name.
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
   * Utility for adding a study area's geojson as a map layer.
   * @param studyAreaJSON
   */
  addStudyAreaAsMapLayer(studyAreaJSON: JSON) {
    const studyAreaGeoJSON = this.createStudyAreaGeoJSON(studyAreaJSON);
    const geoJSON = new ol.format.GeoJSON({
      projection: 'EPSG:3857'
    });

    this.studyAreaVectorSource = new ol.source.Vector({
      features: (geoJSON).readFeatures(studyAreaGeoJSON)
    });

    const polygonStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        //color: 'rgba(255, 117, 24, 1.0)',
        color: '#a7a7a5',
        lineDash: [4],
        width: 4
      }),
      fill: new ol.style.Fill({
        color: 'rgba(102, 153, 67, 0.0)'
      })
    });

    const vectorLayer = new ol.layer.Vector({
        title:'Study area',
      source: this.studyAreaVectorSource,
      style: polygonStyle
    });

    const mapLayersCollection = this.overlayLayers.getLayers();
    mapLayersCollection.insertAt(0, vectorLayer);

    this.zoomToStudyAreaExtent();
  }
  /**
   * Utility for zooming to the extent of the study area
   */
  zoomToStudyAreaExtent() {
    this.map.getView().fit(this.studyAreaVectorSource.getExtent(), this.map.getSize());
  }

  /**
   * Utility for creating the farmfields GeoJSON.
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
   * Utility for removing farmfields from the map
   */
  clearFarmFieldsFromMap() {
    const mapLayersCollection = this.overlayLayers.getLayers();
    const farmFieldsLayer  = mapLayersCollection.item(1);
    if (farmFieldsLayer !== undefined) {
       mapLayersCollection.remove(farmFieldsLayer);
       this.map.removeInteraction(this.selectInteraction)
    }
  }

  /**
   * Utility for adding the farm field's geojson as a map layer
   * @param farmFieldFeatures
   */
  addFarmFieldsAsMapLayer(farmFieldFeatures: any) {

    // remove any previously added farm fields on the map (as user changes the selected crops)
    this.clearFarmFieldsFromMap();

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



      const vectorLayer = new ol.layer.Vector({
        title:'Farm fields',
        source: vectorSource,
        style: function(feature:any){
            const orange='#ff9933';
            const blue='#000099';
            const red='#ff0000';
            const green='#339933';
            const brown='#996633';
            const grey='#808080';
            const purple='#cc00cc';
            let color;
            if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Cotton'){
                color=orange;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Groundnut'){
                color=blue;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Maize'){
                color=red;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Millet'){
                color=green;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Other'){
                color=brown;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Sorgum'){
                color=grey;
            }else if(typeof(feature.getProperties().croptype)!='undefined'&&feature.getProperties().croptype=='Uncultivated'){
                color=purple;
            }else{
                color='#808000';
            }
            const polygonStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                  //color: 'rgba(102, 153, 67, 1.0)',
                  color: chroma(color).alpha(0.7).css(),
                  width: 4
                }),
                fill: new ol.style.Fill({
                  color: chroma(color).alpha(0.1).css()
                })
              });
            return polygonStyle
        }
      });

      const mapLayersCollection = this.overlayLayers.getLayers();
      mapLayersCollection.insertAt(1, vectorLayer);
      this.initializeFeatureClick(vectorLayer);
      this.map.getView().fit(vectorSource.getExtent(), this.map.getSize());
    }
  }
  /**
   * Utility for adding the farm field's geojson as a map layer
   * @param farmFieldFeatures
   */
  showLayersControl() {
      console.log(this.layerSwitcher);
      //this.layerSwitcher.hidePanel();

  }
}
