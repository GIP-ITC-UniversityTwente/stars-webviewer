export class AppConfiguration {

  // Configuration for the STARS API
  static apiBaseURL = 'https://stars.itc.nl/api';

  // Configuration for the map
  static mapCenterLat = 16.878147;
  static mapCenterLng = 15.644531;
  static mapZoom = 3;
  static bingKey = 'AtBPLiCjWdjtGtkHLgJbyMGfXMNtpME9EOtVBiqP7fD8sQUMMDuDfTS1To5TKVJr';

  // Configuration for the Tool Tip
  static studyAreaToolTip = 'A contiguous geographic area within which crop field studies have been conducted, and images have been collected for monitoring purposes.';
  static cropTypeToolTip = 'The list of crops grown in the chosen study area in the selected year(s).';
  static timeSeriesTooltip = 'A set of chronological measurements over farm fields with the selected crops of a single field characteristic or single image-derived characteristic, averaged per date.';
  static fieldConstantsToolTip = 'A field constant is measured only once per season for any farm field, the histogram shows frequency of these values over the set of fields.';
  static classifiedTimeSeriesToolTip = 'A set of chronological measurements over farm fields of a secondary field/image characteristic, displayed per class.';

  // Configuration for Online Help
  static onlineHelpURL = 'https://s3.amazonaws.com/test-kly-web/PlaceholderOnlineDoc.pdf';
}
