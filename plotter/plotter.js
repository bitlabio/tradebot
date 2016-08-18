var fs = require('fs');

var renderimg = function (width, height, image, filename, options) {
	console.log("rendering image..")

	/*
	var options = options
	if (options == undefined) { options = {} }
	if (options.filename == undefined) { options.filename = "render.ppm"}
	*/

	var stream = fs.createWriteStream(filename);

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
}








var pixels = []
var width = 1920
var height = 1080

for (var y = 0; y < height; y++) {
	var row = []
	for (var x = 0; x < width; x++) {
		var pixel = []
		pixel[0] = Math.round(y%255)
		pixel[1] = Math.round(x%255)
		pixel[2] = Math.round(255)
		row[x] = pixel
	}
	pixels[y] = row
}

renderimg(1920, 1080, pixels, 'polotest.ppm');