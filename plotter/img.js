var fs = require('fs');
var stream = fs.createWriteStream("render.ppm");

var image = []
var width = 255
var height = 255

for (var y = 0; y < height; y++) {
	var row = []
	for (var x = 0; x < width; x++) {
		var pixel = []
		pixel[0] = Math.round(y%255)
		pixel[1] = Math.round(x%255)
		pixel[2] = Math.round(255)
		row[x] = pixel
	}
	image[y] = row
}

stream.once('open', function(fd) {
  stream.write("P3\n#JS PPM\n" + image[0].length + " " + image.length + "\n255\n");

	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			stream.write(image[y][x].join(" ") + " ")		
		}
		stream.write("\n")		
	}
  stream.end();
});