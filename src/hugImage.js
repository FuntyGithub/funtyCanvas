const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage  } = require('canvas')
const path = require('path');

// hug image generator
exports.createHugImage = async function (imageURL, size = {x: 112, y: 112}, bgColor = '#00000000', picPos = {x: 1, y: 45}, picRotation = 0) {

    // create canvas
    const canvas = createCanvas(size.x, size.y);
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size.x, size.y);

    //draw hug pepe
    let pepe = await loadImage(path.join(__dirname, '../img/hugImage/pepe.png'));
    ctx.drawImage(pepe , 0, 0, canvas.width, canvas.height);

    // draw profile picture
    let userImage = await loadImage(imageURL);
    ctx.rotate(picRotation * Math.PI / 180);
    ctx.drawImage(userImage , picPos.x, picPos.y);
    ctx.rotate(-picRotation * Math.PI / 180);

    // draw Hug arms
    let arms = await loadImage(path.join(__dirname, '../img/hugImage/arms.png'));
    ctx.drawImage(arms , 0, 0, canvas.width, canvas.height);

    // return image
    return new MessageAttachment(canvas.toBuffer(), "hug.png");
}
