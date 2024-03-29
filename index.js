const path = require('path');

module.exports.createCaptcha = require(path.join(__dirname,'src/captcha.js')).createCaptcha;
module.exports.createSusImage = require(path.join(__dirname,'src/susImage.js')).createSusImage;
module.exports.createHugImage = require(path.join(__dirname,'src/hugImage.js')).createHugImage;

// Experimental
module.exports.createOilPainting = require(path.join(__dirname,'src/oilPainting.js')).createOilPainting;
module.exports.createSusifyImage = require(path.join(__dirname,'src/susifyImage.js')).createSusifyImage;