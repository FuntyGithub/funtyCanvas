const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage  } = require('canvas')

// sus image generator
exports.createSusImage = async function (imageURL, size = {x: 128, y: 71}, bgColor = '#00000000') {
    // create canvas
    const canvas = createCanvas(size.x, size.y);
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size.x, size.y);

    // draw profile picture
    let userImage = await loadImage(imageURL);
    ctx.drawImage(userImage , 0, 0, canvas.width, canvas.height);

    // draw eyes
    let eyes = await loadImage("https://github.com/FuntyGithub/susGeneratorBot/blob/main/img/eyes.png?raw=true");
    ctx.drawImage(eyes , 0, 0, canvas.width, canvas.height);

    // set global composite operation so we can draw the eyes transparently
    ctx.globalCompositeOperation = "xor";

    // draw temlpate eyes
    let templateImage = await loadImage("https://github.com/FuntyGithub/susGeneratorBot/blob/main/img/template.png?raw=true");
    ctx.drawImage(templateImage , 0, 0, canvas.width, canvas.height);

    // return image
    let img = new MessageAttachment(canvas.toBuffer(), "sus.png");
    return img;
}