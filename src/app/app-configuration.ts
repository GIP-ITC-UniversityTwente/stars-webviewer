export class AppConfiguration {

  // Configuration for the STARS API
  static apiBaseURL = "https://stars.itc.nl/api";

  // Configuration for the map
  static mapCenterLat: number = 16.878147;
  static mapCenterLng: number = 15.644531;
  static mapZoom: number = 3;
  static bingKey: string = 'AtBPLiCjWdjtGtkHLgJbyMGfXMNtpME9EOtVBiqP7fD8sQUMMDuDfTS1To5TKVJr';

  // Configuration for the Tool Tip Documentation
  static studyAreaToolTip: string = "Enter tooltip for Study Area in AppConfiguration";
  static cropTypeToolTip: string = "Enter tooltip for Crop Type in AppConfiguration";
  static timeSeriesTooltip: string = "Enter tooltip for Time Series in AppConfiguration";
  static fieldConstantsToolTip: string = "Enter tooltip for Field Constants in AppConfiguration";
  static classifiedTimeSeriesToolTip: string = "Enter tooltip for Classified Time Series section in AppConfiguration";
}
