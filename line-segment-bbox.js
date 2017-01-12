// utility for turning json line segment into sequence of bbox's

const buffer = 20;
const sampleJSON = {
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
		const segments = getLineSegments(line_json.geometry.coordinates);
		const segmentsR =  rotateSegments(segments);

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
	// segments
}


// for a set of coordinates get the angle and save it to the array

// given coordinates and angle, rotate using the 2d transform to the postivie X axis

// compute buffer coordinates in the positive / negative y direction and return bbox

// de-rotate the bbox

// return a new geojson of bboxes along the segment

