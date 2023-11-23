const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage  } = require('canvas')
const path = require('path');

// susify image generator
exports.createSusifyImage = async function (imageURL, amount = 64, bgColor = '#000000') {

    // load image
    let userImage = await loadImage(imageURL);

    // create canvas
    const canvas = createCanvas(userImage.width, userImage.height);
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // cut out the form of the background
    let background = await loadImage(path.join(__dirname,'../img/susifyImage/background.png'));
    let amongus = await loadImage(path.join(__dirname,'../img/susifyImage/amongus.png'));
    
    // duplicate the image to a grid that has the amount of squares as the amount parameter
    let gridCanvas = createCanvas(userImage.width * amount, userImage.height * amount);
    let gridCtx = gridCanvas.getContext('2d');
    let amongusCanvas = createCanvas(userImage.width * amount, userImage.height * amount);
    let amongusCtx = amongusCanvas.getContext('2d');
    for (let y = 0; y < amount; y++) {
        for (let x = 0; x < amount; x++) {
            gridCtx.drawImage(background, x * userImage.width, y * userImage.height, userImage.width, userImage.height);
            amongusCtx.drawImage(amongus, x * userImage.width, y * userImage.height, userImage.width, userImage.height);
        }
    }

    // draw the background
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(gridCanvas, 0, 0, canvas.width, canvas.height);




    

    // ctx.globalCompositeOperation = "destination-in";
    // ctx.drawImage(background , 0, 0, canvas.width, canvas.height);

    
    // let amongus = await loadImage(path.join(__dirname,'../img/susifyImage/amongus.png'));
    // // duplicate the image to a grid that has the amount of squares as the amount parameter
    // let amongusCanvas = createCanvas(userImage.width * amount, userImage.height * amount);
    // let amongusCtx = amongusCanvas.getContext('2d');
    // for (let y = 0; y < amount; y++) {
    //     for (let x = 0; x < amount; x++) {
    //         amongusCanvas.drawImage(amongus, x * userImage.width, y * userImage.height, userImage.width, userImage.height);
    //     }
    // }

    // draw among us image
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(amongusCanvas , 0, 0, canvas.width, canvas.height);

    // draw profile picture behind the canvas
    ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(userImage , 0, 0, canvas.width, canvas.height);







    // return image
    // let img = new MessageAttachment(canvas.toBuffer(), "susify.png");
    return canvas.toBuffer()

}