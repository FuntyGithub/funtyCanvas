
const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage  } = require('canvas')

exports.createOilPainting = async function (imageURL, radius, intensity) {

    // load image
    let image = await loadImage(imageURL),
    canvas = createCanvas(image.width, image.height),
    ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);


    // algorithm by https://codepen.io/loktar00/ (https://codepen.io/loktar00/pen/Rwgxor), adapted to the package by me.

    var width = canvas.width,
        height = canvas.height,
        imgData = ctx.getImageData(0, 0, width, height),
        pixData = imgData.data,
        destCanvas = createCanvas(width, height),
        dCtx = destCanvas.getContext("2d"),
        pixelIntensityCount = [];

    var destImageData = dCtx.createImageData(width, height),
        destPixData = destImageData.data,
        intensityLUT = [],
        rgbLUT = [];

    for (var y = 0; y < height; y++) {
        intensityLUT[y] = [];
        rgbLUT[y] = [];
        for (var x = 0; x < width; x++) {
            var idx = (y * width + x) * 4,
                r = pixData[idx],
                g = pixData[idx + 1],
                b = pixData[idx + 2],
                avg = (r + g + b) / 3;
            
            intensityLUT[y][x] = Math.round((avg * intensity) / 255);
            rgbLUT[y][x] = {
                r: r,
                g: g,
                b: b
            };
        }
    }
    
    
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            pixelIntensityCount = [];
            
            // Find intensities of nearest pixels within radius.
            for (var yy = -radius; yy <= radius; yy++) {
                for (var xx = -radius; xx <= radius; xx++) {
                  if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
                      var intensityVal = intensityLUT[y + yy][x + xx];

                      if (!pixelIntensityCount[intensityVal]) {
                          pixelIntensityCount[intensityVal] = {
                              val: 1,
                              r: rgbLUT[y + yy][x + xx].r,
                              g: rgbLUT[y + yy][x + xx].g,
                              b: rgbLUT[y + yy][x + xx].b
                          }
                      } else {
                          pixelIntensityCount[intensityVal].val++;
                          pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
                          pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
                          pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
                      }
                  }
                }
            }
            
            pixelIntensityCount.sort(function (a, b) {
                return b.val - a.val;
            });
            
            var curMax = pixelIntensityCount[0].val,
                dIdx = (y * width + x) * 4;
            
            destPixData[dIdx] = ~~ (pixelIntensityCount[0].r / curMax);
            destPixData[dIdx + 1] = ~~ (pixelIntensityCount[0].g / curMax);
            destPixData[dIdx + 2] = ~~ (pixelIntensityCount[0].b / curMax);
            destPixData[dIdx + 3] = 255;
        }
    }
    

    ctx.putImageData(destImageData, 0, 0);

    // return buffered image
    return canvas.toBuffer();
}