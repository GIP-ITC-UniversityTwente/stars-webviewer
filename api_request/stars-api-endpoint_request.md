## STARS API Endpoint Brainstorm

The purpose of this document is to communicate what STARS API endpoints are needed to support features of the STARS Web Viewer.  This is simply a 'brainstorm' document and does not officially document the STARS API (see api repo for the actual documentation).  Thus, any details can change as needed.

#### REST Endpoints for Requirement 1a

To support Requirement 1a, we believe we need endpoints that will support the ability to request the following data with responses that resemble the following:

[/studyareas](#/studyareas_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all study areas that have farm field-specific data.

[/farmfields](#/farmfields_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all farm fields for a specific (study area, year) combination.

[/croptypes](#/croptypes_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all crop types for a specific (study area, year) combination or (study area, startyear, endyear) combination.

[/imagecharacteristics](#/imagecharacteristics_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all image characteristics (spectral and textural) associated with a given (study area, year) or (study area, startyear, endyear) combination.

[/fieldcharacteristics](#/fieldcharacteristics_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all constant field characteristics associated with a given (study area, year) or (study area, startyear, endyear) combination. Would it not be logical to have this one too?

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
|results|object||
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
			"type": "Feature",
			"properties": {
				"id": 1000,
				"name": "Mali, Sikasso, around Sougoumba",
				"year_start": 2014,
				"year_end": 2014
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-5.143373, 12.13132],
						[-5.235212, 12.130594],
						[-5.235968, 12.220957],
						[-5.144098, 12.221689],
						[-5.143373, 12.13132]
					]
				]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"id": 1001,
				"name": "Other Mali, test 2",
				"year_start": 2015,
				"year_end": 2015
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-5.143373, 12.13132],
						[-5.235212, 12.130594],
						[-5.235968, 12.220957],
						[-5.144098, 12.221689],
						[-5.143373, 12.13132]
					]
				]
			}
		}
	]
}
```
<br/>

#### <a id="/farmfields_get">/farmfields</a>&nbsp;&nbsp;![icon](img/get.png)

Get all farm fields for a specific (study area, year) combination.

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|integer|The GUID for the study area you are requesting crops types for.|
|startYear|true|query|integer|The (starting) year for which crop types are requested in the area.|
|endYear|false|query|integer|The (optional) ending year for which type are requested in the area.|


##### Success 200 (object)
|Name|Optional|Type|Description|
|---|---|---|---|
|message|false|string|Success message.|
|results|false|object||
|-&nbsp;type|false|string|JSON object type; ='Feature'|
|-&nbsp;properties|false|Object|Properties of the feature|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;oid|false|integer|GUID of farm field (fmu).|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;crop|true|string|Name of the crop.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;fieldwork|false|boolean|Whether fueldwork was conducted in this field.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;year|false|integer|Year when the field was under study.|
|-&nbsp;geometry|false|GeoJSON Object|Spatial geometry of the field in given year.|

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
http://stars/farmfields/<studyAreaId>/<startYear>
http://stars/farmfields/<studyAreaId>/<startYear>/<endYear>

or

http://stars/farmfields?studyAreaId=234567?startYear=2014
http://stars/farmfields?studyAreaId=234567?startYear=2014?endYear=2015
```

##### Sample Response:
```json
{
	"message":"success",
	"results":[
		{
			"type": "Feature",
			"properties": {
				"id": 1000,
				"crop": "Cotton",
				"fieldwork": true,
				"year": 2014
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-5.143373, 12.13132],
						[-5.235212, 12.130594],
						[-5.235968, 12.220957],
						[-5.144098, 12.221689],
						[-5.143373, 12.13132]
					]
				]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"id": 1001,
				"crop": "Groundnut",
				"fieldwork": true,
				"year": 2015
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-5.143373, 12.13132],
						[-5.235212, 12.130594],
						[-5.235968, 12.220957],
						[-5.144098, 12.221689],
						[-5.143373, 12.13132]
					]
				]
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
http://stars/croptypes/<studyAreaId>/<startYear>
http://stars/croptypes/<studyAreaId>/<startYear>/<endYear>

or

http://stars/croptypes?studyAreaId=234567?startYear=2014
http://stars/croptypes?studyAreaId=234567?startYear=2014?endYear=2015
```

##### Sample Response:
```json
{
	"message":"success",
	"results": [
		{
			"id":12389,
			"name":"Maize"
		},
		{
			"id":223,
			"name":"Groundnut"
		}
	]
}
```

<br/>

#### <a id="/imagecharacteristics_get">/imagecharacteristics</a>&nbsp;&nbsp;![icon](img/get.png)

Get all image characteristics (spectral and textural) associated with a given study area and given year(s).

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|integer|The GUID for the study area.|
|startYear|true|query|integer|The (starting) year for which crop types are requested in the area.|
|endYear|false|query|integer|The (optional) ending year for which type are requested in the area.|

##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|results|object||
|-&nbsp;spectralCharacteristics|array|Collection of spectral characteristics.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;id|string|The GUID for the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;name|string|Name of the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;alias|string|Friendlier name of the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;description|string|Description of the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;sensor|string|Name of the sensor from which image obtained.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;datatype|string|The data type of its values.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;parameter1|string|Description of (optional) first parameter.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;parameter2|string|Description of (optional) second parameter.|
|-&nbsp;texturalCharacteristics|array|Collection of textural characteristics.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;id|string|The GUID for the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;name|string|Name of the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;quantization_level|integer|Either 64 or 256.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;description|string|Description of the characteristic.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;sensor|string|Name of the sensor from which image obtained.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;datatype|string|The data type of its values.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;parameter1|string|Description of (optional) first parameter.|
|&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;parameter2|string|Description of (optional) second parameter.|

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
http://stars/imagecharacteristics/<studyAreaId>/<startYear>
http://stars/imagecharacteristics/<studyAreaId>/<startYear>/<endYear>

or

http://stars/imagecharacteristics?studyAreaId=234567&startYear=2014
http://stars/imagecharacteristics?studyAreaId=234567&startYear=2014&endYear=2015
```

##### Sample Response:
```json
{
	"message":"success",
	"results": {
		"spectralCharacteristics": [
			{
				"id":	1,
				"name":	"reflectance_zeroth_moment",
				"alias": "Reflectance Zeroth Moment",
				"interpretation": "The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels",
				"sensor": "GeoEye-1_MS",
				"variabletype":	"s",
				"datatype": "integer"
			},
			{
				"id": 1,
				"name": "reflectance_zeroth_moment",
				"alias": "Reflectance Zeroth Moment",
				"interpretation": "The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels",
				"sensor": "WorldView-2_MS",
				"variabletype": "s",
				"datatype": "integer"
			},
			{
				"id": 21,
				"name": "reflectance_first_moment",
				"alias": "Reflectance First Moment",
				"interpretation": "The mean reflectance value for band $1 on the sensor platform",
				"sensor": "WorldView-2_MS",
				"variabletype": "s",
				"datatype": "float",
				"parameter1": "bandNumber : 1..8"
			},
			{
				"id": 29,
				"name": "reflectance_covariance",
				"alias": "Reflectance Covariance",
				"interpretation": "The (co)variance of reflectance values between band $1 and band $2",
				"sensor": "QuickBird_MS",
				"variabletype": "s",
				"datatype": "float",
				"parameter1": "bandNumber : 1..4",
				"parameter2": "bandNumber : 1..4"
			}
		],
		"texturalCharacteristics": [
			{
				"id": 30,
				"name": "reflectance_zeroth_moment_texture",
				"alias": "Reflectance zeroth moment texture",
				"interpretation": "The number of relevant textural pixels spatially within the field, excluding cloud and tree-masked pixels",
				"sensor": "WorldView-3_PAN",
				"variabletype": "t",
				"datatype": "integer"
			},
			{
				"id": 51,
				"name": "homogeneity_q64",
				"alias": "Homogeneity 64",
				"interpretation": "Local homogeneity (aka inverse difference moment) averaged over all eight angles, for 64 quantization levels",
				"sensor": "QuickBird_PAN",
				"variabletype": "t",
				"datatype": "float",
				"parameter1": "lagDistance : 1..4"
			}
		]
	}
}
```

<br/>

#### <a id="/timeseries_get">/timeseries</a>&nbsp;&nbsp;![icon](img/get.png)

Get time series data for a specific image characteristics (spectral or textural) associated with a given study area, given year(s) and crop type.

##### Parameters
|Name|Required|In|Type|Description|
|---|---|---|---|---|
|studyAreaId|true|query|integer|The GUID for the study area.|
|startYear|true|query|integer|The (starting) year for which crop types are requested in the area.|
|endYear|false|query|integer|The (optional) ending year for which type are requested in the area.|
|cropNames|true|query|list of string|The names of the crop types.|
|imageCharacteristicId|true|query|integer|The GUID of the image characteristic.|
|sensorList|true|query|list of string|A list of one or more sensor names to match with the image characteristic. This allows selectiveness for the image characteristic coming from a number of sensors.|
|firstParameter|false|query|integer|The first parameter for the statistic. If statistic is _textural_, then this parameter provides the lag distance (1-4 pixels) over which texture is computed. If statistic is _spectral_, and no secondParameter is provided, then this parameter is interpreted as the image band number.  In this case, the statistic is either reflectance_zeroth_moment (aka reflectance mean) or reflectance_third_moment (aka reflectance skew).|
|secondParameter|false|query|integer|The second parameter for the statistic. Only used for _spectral_ statistic of reflectance_covariance (aka reflectance_second_moment), and then this parameter is interpreted as second image band number.  When firstParameter=secondParameter, one is asking for the reflectance variance of that band.|

##### Discussion
Spectral and textural characteristics are separately listed, in sequence of the characteristic's _id_.  This _id_ and image characteristic _name_ map one-to-one, yet a characteristic is only uniquely identified by providing one more tag.  At least also the _sensor_ should be identified, and the reason behind this is that any variable (say, NDVI) is slightly differently measured by different sensors.  
For instance, NDVI is a function of reflectance measured in the red and the near-infrared bands. GeoEye-1's red band is measured between the 655 and 690 nm wavelengths, while near-infrared is between 780 and 920 nm.  WorldView-2's ranges are, respectively, 630 to 690 nm and 770 to 895 nm for these two bands. With the same NDVI formula in place, these facts will render measurements between these two sensors somewhat differently.  Likewise, WorldView-2 and -3 differ in pixel resolution, with multispectral pixel size 184 cm in the first, and 121 cm in the second.  Again, this is reason for slight differences.
All this means that one should mention with the variable chosen also specifically the sensor.  When requesting a time series for a characteristic, we actually allow listing multiple sensors, to allow studies and charts that combine measurements for a single variable from multiple sensors.
For textural characteristics, we have computed these for two different quantization levels, nanmely levels 64 and 256. By default, we use 256. If one requires a textural characteristic determined on basis of 64 levels, one should use the characteristic that has postfix "_q64" in its name.  Generally, characteristics such as _asm_  and _asm_q64_ should not be combined in a chart, as they are different (though correlated) measurements.

##### Consequences for the visualizations
Given that measurements may come from different sensors, we propose that charts visualize that difference with a fixed different data point layout, to allow understanding the sensor origin of the data point.  It is in principle possible that for a single date multiple sensors have provided data, leading to two (or even more) data points for the same _x_ (time) value. In such case, we propose that all such data points are displayed, however that the chartline runs through their average _y_ value.

##### Success 200 (object)
|Name|Type|Description|
|---|---|---|
|message|string|Success message.|
|results|array|A collection of objects.|
|-&nbsp;crop|string|Crop name.|
|&nbsp;&nbsp;&nbsp;-&nbsp;sensor|string|Name of the sensor.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;acquisition_date|string|Acquisition date.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;avgvalue|float|Average value.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;n|integer|N value, Number of fields used to calculate the average.|

##### Error 500 (Object)
|Name|Type|Description|
|---|---|---|
|message|string||
|error|object||
|-&nbsp;name|string||
|-&nbsp;message|string||
|-&nbsp;status|integer||


##### Example Request:
``` Simplest version:
http://stars/timeseries/<studyAreaId>/<startYear>/<cropTypeId>/<imageCharacteristicId>/<sensorList>

or

http://stars/timeseries?studyAreaId=1000&startYear=2014cropTypeId=Millet&imageCharacteristicId=17&sensorList=1050,1070
```

##### Sample Response:
````json
{
	"message": "success",
	"results": [{
		"Millet": [{
			"GeoEye-1_MS": [{
					"acquisition_date": "2014-05-22",
					"avgvalue": 0.1218,
					"n": 10
				},
				{
					"acquisition_date": "2014-05-30",
					"avgvalue": 0.1208,
					"n": 10
				},
				{
					"acquisition_date": "2014-06-26",
					"avgvalue": 0.1625,
					"n": 10
				}
			]
		}, {
			"QuickBird_MS": [{
					"acquisition_date": "2014-05-22",
					"avgvalue": 0.1218,
					"n": 10
				},
				{
					"acquisition_date": "2014-05-30",
					"avgvalue": 0.1208,
					"n": 10
				},
				{
					"acquisition_date": "2014-06-26",
					"avgvalue": 0.1625,
					"n": 10
				}
			]

		}]
	}, {
		"Maize": [{
			"GeoEye-1_MS": [{
					"acquisition_date": "2014-05-22",
					"avgvalue": 0.1218,
					"n": 10
				},
				{
					"acquisition_date": "2014-05-30",
					"avgvalue": 0.1208,
					"n": 10
				},
				{
					"acquisition_date": "2014-06-26",
					"avgvalue": 0.1625,
					"n": 10
				}
			]
		}, {
			"WorldView-2_MS": [{
					"acquisition_date": "2014-05-22",
					"avgvalue": 0.1218,
					"n": 10
				},
				{
					"acquisition_date": "2014-05-30",
					"avgvalue": 0.1208,
					"n": 10
				},
				{
					"acquisition_date": "2014-06-26",
					"avgvalue": 0.1625,
					"n": 10
				}
			]

		}]
	}]
}

````

#### Todo list in API for @Luis and @Rolf 
(@Rolf just tick the points when you finish your part, I will remove them after I deploy them in the API)

- [X] Provide an alias property in the /imagecharacteristics endpoint with a friendly name.
- [X] Create a new endpoint /farmfields. Please check the above document
- [X] In the /timeseries endpoint, change the functions to allow to pass an array of crop ids instead of only one crop.  REMARK: the old option of passing just a single cropname has now disappeared.  You always pass an array of names.
- [ ] In the /timeseries endpoint, add to the response x, y-min, y, y-max for the chartline-envelope.
- [X] Four decimals will be good enough precision on the /timeseries values.
