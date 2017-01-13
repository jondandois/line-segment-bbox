// utility for turning json line segment into sequence of bbox's

var buffer = 1.5;
var sampleJSON = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [100.9, 50.2],
      [103, 43.7],
      [103.9, 39],
      [102.1, 32.5],
      [97.4, 23.4],
      [97.4, 16.9],
      [103, 11.2],
      [102.1, 7.5],
      [87.1, 6.4],
      [76.8, 0],
      [68.2, 5.1],
      [67.8, 20],
      [62.7, 28.8],
      [57.5, 33.6],
      [48.9, 41.7],
      [39.1, 38.3],
      [33.5, 41.4],
      [25.3, 36.3],
      [21.5, 37.6],
      [15.4, 45.8],
      [0, 48.8]
    ]
  }
};

lineSegmentBbox(sampleJSON, buffer);

// main function for parsing the geojson line into bboxs
function lineSegmentBbox(line_json, buffer){
	if (line_json.type === "Feature" && line_json.geometry.type === "LineString") {
		var segments = getLineSegments(line_json.geometry.coordinates);
		var segmentsR = rotateSegments(segments);
		var segmentsBR =  bufferAndRotateSegments(segmentsR, buffer);
		var boundaryPolygons = parseSegmentsToGeoJson(segmentsBR);
		console.log(JSON.stringify(boundaryPolygons));
	} else {
		console.warn("input must be only a Feature and geometry must be type LineString");
	}
}

// from an array of coordinate pairs, return a new array of line segments
function getLineSegments(coordinates){
	var segments = [];
	coordinates.map(function(coordinatePair, i){
		if (i < coordinates.length-1) {
			segments.push([coordinatePair, coordinates[i+1]]);
		}
	});
	return segments;
}

// rotate line segments to standard orientation
function rotateSegments(segments){
	return segments.map(function(segment){
		var rot = Math.atan2(segment[1][1] - segment[0][1], segment[1][0] - segment[0][0]);
		return [
			rotatePoints(segment[0][0], segment[0][1], -rot),
			rotatePoints(segment[1][0], segment[1][1], -rot),
			rot
		];
	});
}

// rotate a single xy coordinate pair on an angle
function rotatePoints(x,y,angle, reverse = null){
	if (reverse){
		var xR = x*Math.cos(angle) + y*Math.sin(angle);
  	var yR = -1*x*Math.sin(angle) + y*Math.cos(angle);
	} else {
  	var xR = x*Math.cos(angle) - y*Math.sin(angle);
  	var yR = x*Math.sin(angle) + y*Math.cos(angle);
	}
  return [xR, yR];
}

// buffer segements and return a coordinates for a polygon array
function bufferAndRotateSegments(segmentsR, buffer){
	return segmentsR.map(function(segment){
		var rot = segment[2];
		var y0 = segment[0][1];
		var x1 = segment[0][0];
		var x2 = segment[1][0];
		var UL = rotatePoints(x1, y0+buffer, -rot, true);
		var UR = rotatePoints(x2, y0+buffer, -rot, true);
		var LR = rotatePoints(x2, y0-buffer, -rot, true);
		var LL = rotatePoints(x1, y0-buffer, -rot, true);
		return [ UL, UR, LR, LL, UL];
	});
}

function parseSegmentsToGeoJson(segments){
	var newGeoJson = {};
	newGeoJson.type = "FeatureCollection";
	newGeoJson.features = [];
	segments.map(function(segment){
		newGeoJson.features.push({
			"type": "Feature",
			"geometry": {
				"type": "Polygon",
				"coordinates": [segment]
			}
		});
	});
	return newGeoJson;
}
