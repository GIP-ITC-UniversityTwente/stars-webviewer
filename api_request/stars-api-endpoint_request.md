## STARS API Endpoint Brainstorm

The purpose of this document is to communicate what STARS API endpoints are needed to support features of the STARS Web Viewer.  This is simply a 'brainstorm' document and does not officially document the STARS API (see api repo for the actual documentation).  Thus, any details can change as needed.

#### REST Endpoints for Requirement 1a

To support Requirment 1a, we believe we need endpoints that will support the ability to request the following data with responses that resemble the following:

[/studyareas](#/studyareas_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all study areas that have farm field-specific data.

[/croptypes](#/croptypes_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all crop types for a specific (study area, year) combination or (study area, startyear, endyear) combination.

[/imagecharacteristics](#/imagecharacteristics_get)&nbsp;&nbsp;![icon](img/get.png)
&nbsp;&nbsp;&nbsp;&nbsp;Get all image characteristics (spectral and textural) associated with a given (study area, year) or (study area, startyear, endyear) combination.

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
				"id": 1345,
				"name": "mean reflectance",
				"datatype": "float",
			},
			{
				"id": 256,
				"name": "ndvi",
				"datatype": "float"
			},
			{
				"id": 378,
				"name": "ndvi-green",
				"datatype": "float"
			},
			{
				"id": 489,
				"name": "reflectance_first_moment",
				"datatype": "float",
				"parameter1": "bandNumber : 1..8"
			},
			{
				"id": 590,
				"name": "reflectance_covariance",
				"datatype": "float",
				"parameter1": "bandNumber : 1..8",
				"parameter2": "bandNumber : 1..8"
			}
		],
		"texturalCharacteristics": [
			{
				"id": 112,
				"name": "angular second moment"
			},
			{
				"id": 223,
				"name": "contrast"
			},
			{
				"id": 734,
				"name": "correlation"
			},
			{
				"id": 445,
				"name": "energy (uniformity)"
			},
			{
				"id": 556,
				"name": "entropy"
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
|cropTypeId|true|query|string|The name of the crop type.|
|imageCharacteristicId|true|query|integer|The GUID of the image characteristic.|
|sensorList|true|query|list of integer|A list of one or more sensor IDs to match with the image characteristic. This allows selectiveness for the image characteristic coming from a number of sensors.|
|firstParameter|false|query|integer|The first parameter for the statistic. If statistic is _textural_, then this parameter provides the lag distance (1-4 pixels) over which texture is computed. If statistic is _spectral_, and no secondParameter is provided, then this parameter is interpreted as the image band number.  In this case, the statistic is either reflectance_zeroth_moment (aka reflectance mean) or reflectance_third_moment (aka reflectance skew).|
|secondParameter|false|query|integer|The second parameter for the statistic. Only used for _spectral_ statistic of reflectance_covariance (aka reflectance_second_moment), and then this parameter is interpreted as second image band number.  When firstParameter=secondParameter, one is asking for the reflectance variance of that band.|

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
``` Simplest version:
http://stars/timeseries/<studyAreaId>/<startYear>/<cropTypeId>/<imageCharacteristicId>/<sensorList>

or

http://stars/timeseries?studyAreaId=1000&startYear=2014cropTypeId=Millet&imageCharacteristicId=17&sensorList=1050,1070
```

##### Sample Response:
````
{
	"message":"success",
	"results": "[
	            { "series": [
		                { "acquisition_date":"2014-05-22",
				  "avgvalue":0.121761924028397,
				  "n":10
				},
				{ "acquisition_date":"2014-05-30",
				  "avgvalue":0.120824810862541,
				  "n":10
				},
				{ "acquisition_date":"2014-06-26",
				  "avgvalue":0.162523852288723,
				  "n":10
				} ]
		      } ]"
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
