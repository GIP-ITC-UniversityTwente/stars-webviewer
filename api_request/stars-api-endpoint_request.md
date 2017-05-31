## STARS API Endpoint Brainstorm

The purpose of this document is to communicate what STARS API endpoints are needed to support features of the STARS Web Viewer.  This is simply a 'brainstorm' document and does not officially document the STARS API (see api repo for the actual documentation).  Thus, any details can change as needed.

#### REST Endpoints for Requirement 1a

To support Requirment 1a, we believe we need endpoints that will support the ability to request the following data with responses that resemble the following:

[/studyareas](#/studyareas_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all study areas that have farm field-specific data.

[/croptypes](#/croptypes_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all crop types for a specific (study area, year) combination or (study area, startyear, endyear) combination.

[/imagecharacteristics](#/imagecharacteristics_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all image characteristics (spectral and textural) associated with a given (study area, year) or (sudy area, startyear, endyear) combination.

[/timeseries](#/timeseries_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get time series data for a specific image characteristics (spectral or textural) associated with a given study area and crop type.

***

#### <a id="/studyareas_get">/studyareas</a>&nbsp;&nbsp;![icon](img/get.png)

Get all study areas that have farm field-specific data.

##### Parameters
N/A


##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|data|object||
|-&nbsp;type|string|JSON object type; ='Feature'|
|-&nbsp;id|integer|GUID of study area.|
|-&nbsp;name|string|Name of study area.|
|-&nbsp;year_start|integer|Starting year of the study.|
|-&nbsp;year_end|integer|Ending year of the study.|
|-&nbsp;geometry|GeoJSON Object|Spatial geometry for the study area.|

##### Error 500 (Object)
|Name|Type|Description|
|---|---|---|
|message|string||
|error|object||
|-&nbsp;name|string||
|-&nbsp;message|string||
|-&nbsp;status|integer||


##### Example Requests:
```
http://stars/studyareas
```

##### Sample Response:
```json
{
	"message":"success",
	"results":[
		{
			"id":"1ABC2DEF3",
			"name":"Study Area 1",
			"geometry":{
				"type": "FeatureCollection",
				"crs": {
					"type": "name",
					"properties": {
						"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
					}
				},
				"features": [{
					"type": "Feature",
					"properties": { }
				}]
			}
		},
		{
			"id":"2BCD3EFG4",
			"name":"Study Area 2",
			"geometry":{
				"type": "FeatureCollection",
				"crs": {
					"type": "name",
					"properties": {
						"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
					}
				},
				"features": [{
					"type": "Feature",
					"properties": { }
				}]
			}
		}
	]
}
```
<br/>

#### <a id="/croptypes_get">/croptypes</a>&nbsp;&nbsp;![icon](img/get.png)

Get all crop types for a specific study area for the given year(s).  This is an overloaded endpoint.  
When a single year value is provided the crops provided are present in the area in that year, when
two year values are provided, these define a time range within which crop presence is tested.

When the two year values provided are identical, this is equivalent to a query with that value as single
year value.  When the first year value is higher than the second, the result is undefined.

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|integer|The GUID for the study area you are requesting crops types for.|
|startYear|true|query|integer|The (starting) year for which crop types are requested in the area.|
|endYear|false|query|integer|The (optional) ending year for which type are requested in the area.|

##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|results|array||
|-&nbsp;id|string|The GUID for the crop.|
|-&nbsp;name|string|Name of crop.|

##### Error 500 (Object)
|Name|Type|Description|
|---|---|---|
|message|string||
|error| object ||
|-&nbsp;name|string||
|-&nbsp;message|string||
|-&nbsp;status|integer||


##### Example Requests:
```
http://stars/croptypes?studyAreaId=234567?startYear=2014
http://stars/croptypes?studyAreaId=234567?startYear=2014?endYear=2015
```

##### Sample Response:
```json
{
	"message":"success",
	"results": [
		{
			"id":"1ABC2DEF3",
			"name":"Maize",
			"variety":"Blue Corn"
		},
		{
			"id":"2BC2DEF3",
			"name":"Maize",
			"variety":"Flour Corn"
		}
	]
}
```

<br/>

#### <a id="/imagecharacteristics_get">/imagecharacteristics</a>&nbsp;&nbsp;![icon](img/get.png)

Get all image characteristics (spectral and textural) associated with a given study area and crop type.

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|string|The GUID for the study area.|
|cropTypeId|true|query|string|The GUID for the crop type.

##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|results|object||
|-&nbsp;spectralCharacteristics|array|Collection of spectral characteristics.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;id|string|The GUID for the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type|string|Name of characteristic.|
|-&nbsp;texturalCharacteristics|array|Collection of textural characteristics.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;id|string|The GUID for the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;type|string|Name of characteristic.|

##### Error 500 (Object)
|Name|Type|Description|
|---|---|---|
|message|string||
|error|object||
|-&nbsp;name|string||
|-&nbsp;message|string||
|-&nbsp;status|integer||


##### Example Request:
```
http://stars/imagecharacteristics?studyAreaId=234BCD567&cropTypeId=2BC2DEF3
```

##### Sample Response:
```json
{
	"message":"success",
	"results": {
		"spectralCharacteristics": [
			{
				"id": "1ASD345",
				"type": "mean reflectance"
			},
			{
				"id": "2SDFG56",
				"type": "ndvi"
			},
			{
				"id": "3DFGH78",
				"type": "ndvi green"
			},
			{
				"id": "4FGHJ89",
				"type": "eve"
			},
			{
				"id": "5GHJK90",
				"type": "tcari"
			}
		],
		"texturalCharacteristics": [
			{
				"id": "1QWE12",
				"type": "angular second moment"
			},
			{
				"id": "2WER23",
				"type": "contrast"
			},
			{
				"id": "3ERT34",
				"type": "correlation"
			},
			{
				"id": "4RTY45",
				"type": "energy (uniformity)"
			},
			{
				"id": "5TYU56",
				"type": "entropy"
			}
		]
	}
}
```

<br/>

#### <a id="/timeseries_get">/timeseries</a>&nbsp;&nbsp;![icon](img/get.png)

Get time series data for a specific image characteristics (spectral or textural) associated with a given study area and crop type.

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|string|The GUID for the study area.|
|cropTypeId|true|query|string|The GUID for the crop type.|
|imageCharacteristicId|true|query|string|The GUID for the image characteristic.|

##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|results|array|A collection of objects.|
|-&nbsp;time|string|Date time stamp.|
|-&nbsp;characteristicName|string|Name of the characteristic.|

##### Error 500 (Object)
|Name|Type|Description|
|---|---|---|
|message|string||
|error|object||
|-&nbsp;name|string||
|-&nbsp;message|string||
|-&nbsp;status|integer||


##### Example Request:
```
http://stars/timeseries?studyAreaId=234BCD567&cropTypeId=2BC2DEF3&imageCharacteristicId=2SDFG56
```

##### Sample Response:
````
{
	"message":"success",
	"results": [
		{
			"time": "2013-08-01 22:23:00",
			"ndvi": 0.9
		},
		{
			"time": "2013-08-14 22:23:00",
			"ndvi": 0.8
		},
		{
			"time": "2013-09-01 22:23:00",
			"ndvi": 0.7
		},
		{
			"time": "2013-09-14 22:23:00",
			"ndvi": 0.6
		},
		{
			"time": "2013-10-01 22:23:00",
			"ndvi": 0.2
		},
		{
			"time": "2013-10-14 22:23:00",
			"ndvi": 0.1
		}
	]
}

````

##### Sample Response:

#### Requirement 1b

TBD

#### Requirement 2

TBD

#### Requirement 3

TBD

#### Requirement 4

TBD

#### Requirement 5

TBD

#### Requirement 6

TBD

#### Requirement 7

TBD

#### Requirement 8

TBD
