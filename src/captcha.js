const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage  } = require('canvas')
const path = require('path');

// captcha generator
exports.createCaptcha = async function({length = 5, bgColor = "#" + randomInt(0, 16777215).toString(16), bgColorDiff = {R: 20, G: 20, B: 20}, decoys = {amount: 40, sizeMin: 10, sizeMax: 25}, randomCharOrder = true, characters = "ABCDEFGHJKLMNOPQRSTUVWXYZabefgjmnqrty123456789!#@%!@#$%^&*()", width = 600, height = 400, minCharacterSize = 30, maxCharacterSize = undefined, characterColor = undefined, lineColor = undefined, decoyColor = undefined}) {
    var solution = ""

    if (randomCharOrder) { // check if the order of the provided characters should be random
        for (var i = 0; i < length; i++) {
            solution += characters.charAt(randomInt(0, characters.length - 1))
        }
    } else solution = characters // if not, just use the provided characters

    const canvas = createCanvas(width, height)
    const captcha = canvas.getContext("2d")

	// Background
    captcha.fillStyle = bgColor
    captcha.fillRect(0, 0, canvas.width, canvas.height)
    var width = canvas.width / length

    if (lineColor == undefined) {
        // get random colors for the lines
        do {
            lineColor = await randomColor(bgColor, bgColorDiff)
        } while (lineColor == captcha.fillStyle)
        if (lineColor != captcha.fillStyle) captcha.strokeStyle = lineColor
        else return (new Error("Could not generate line color"))
    } else captcha.strokeStyle = lineColor

    captcha.lineWidth = randomInt(2, 4)
    captcha.beginPath()

    for (var i = 0; i < length; i++) {
        let char = solution.charAt(i)
		let fontsize = randomInt(90 - (length * 8), 100 - (length * 8))
		if (fontsize < minCharacterSize) fontsize = minCharacterSize
		else if (fontsize > maxCharacterSize) fontsize = maxCharacterSize
        let buffer = fontsize * 0.7
        captcha.font = fontsize + "px Arial"
        charColor = captcha.fillStyle
        captcha.textAlign = "center"

        if (characterColor == undefined) { // if no color is provided, get a random color
            // get random colors for the characters
            do {
                charColor = await randomColor(bgColor, bgColorDiff)
            } while (charColor == captcha.fillStyle)
            if (charColor != captcha.fillStyle) captcha.fillStyle = charColor
            else return (new Error("Could not generate char color"))
        } else captcha.fillStyle = characterColor

        let rotation = randomInt(-3, 3)
        captcha.rotate(rotation * Math.PI / 180)

        // get random positions for the characters
        let xMin = width * i
        let xMax = width * i + width - (2 * buffer)
        if (i == 0) xMin = buffer

        let x = randomInt(xMin, xMax)
        let y = randomInt(buffer, canvas.height - buffer * 2)

        captcha.fillText(char, x, y) // draw the characters
        captcha.rotate(-rotation * Math.PI / 180) // rotate back

		if (i === 0) captcha.moveTo(x, y)
		else captcha.lineTo(x, y) // draw the lines
    }
    captcha.stroke()

    for (var i = 0; i < decoys.amount; i++) {
        let fontsize = randomInt(decoys.sizeMin, decoys.sizeMax)
		let buffer = fontsize * 0.7
        captcha.font = fontsize + "px Arial"

        // get color for the decoy
        if (decoyColor == undefined) captcha.fillStyle = lineColor
        else captcha.fillStyle = decoyColor

        // get decoy characters and rotate them
        let char = characters.charAt(randomInt(0, characters.length - 1))
        let rotation = randomInt(-3, 3)
        captcha.rotate(rotation * Math.PI / 180)
        captcha.textAlign = "center"

        // get random positions for the decoy characters
        let width = canvas.width / decoys.amount
        let xMin = width * i
        let xMax = width * i + width - (2 * buffer)
        if (i == 0) xMin = buffer
        let x = randomInt(xMin, xMax)

        let y = randomInt(buffer, canvas.height - buffer * 2)

        captcha.fillText(char, x, y)
        captcha.rotate(-rotation * Math.PI / 180)
    }

    const image = new MessageAttachment(canvas.toBuffer(), "captcha.png")
    return {solution, image}



}

// function to get a random color
function randomColor(bgColor, bgColorDiff) {
    do {
        charColor = "#" + randomInt(0, 16777215).toString(16)

        charColorR = parseInt(charColor.substring(1, 3), 16)
        charColorG = parseInt(charColor.substring(3, 5), 16)
        charColorB = parseInt(charColor.substring(5, 7), 16)

        bgColorR = parseInt(bgColor.substring(1, 3), 16)
        bgColorG = parseInt(bgColor.substring(3, 5), 16)
        bgColorB = parseInt(bgColor.substring(5, 7), 16)

        if (bgColorDiff.R > Math.abs(bgColorR - charColorR) || bgColorDiff.G > Math.abs(bgColorG - charColorG) || bgColorDiff.B > Math.abs(bgColorB - charColorB)) charColor = bgColor

    } while (charColor == bgColor)
    return charColor
}

// function to get a random integer between min and max
function randomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}