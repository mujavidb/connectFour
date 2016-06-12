let theGame = new Play(2)
var connectFourArea = document.querySelector('.connectFourBoard')
var columns = document.querySelectorAll('.connectFourBoard .column')
var discArea = document.querySelector('.discArea')
let winHighlightArea = document.getElementById("winHighlight")
var restartButton = document.getElementsByClassName("restartGame")[0]
let previousPosition = connectFourArea.getBoundingClientRect()
var svgNS = "http://www.w3.org/2000/svg";

function addDiscToBoard(location, player, maxHeight){
    let disc = document.createElement("img")
    let basePosition = connectFourArea.getBoundingClientRect()
    disc.classList.add("disc")
    disc.style.top = `${basePosition.top + 15 + (5 - location[0]) * 94 + 7}px`
    disc.style.left = `${basePosition.left + 15 + (location[1]) * 94 + 7}px`
    disc.src = player == 1 ? "img/red_disc.png" : "img/yellow_disc.png"
    discArea.appendChild(disc)

    if (theGame.winningSequence.type) {
        connectFourArea.classList.add("deselectAll")
        document.body.classList.add( player == 1 ? "redWin" : "yellowWin" )
        highlightWin(theGame.winningSequence.type, theGame.winningSequence.x, theGame.winningSequence.y)
    } else {
        if (location[0] == maxHeight - 1) {
            columns[location[1]].classList.add("deselect")
        }
        document.body.classList.toggle("switch")
    }
}

function placeHighlightOverBoard(){
    winHighlightArea.style.top = `${previousPosition.top}px`
    winHighlightArea.style.left = `${previousPosition.left}px`
}

placeHighlightOverBoard()

window.addEventListener('resize', () => {
    let newBasePosition = connectFourArea.getBoundingClientRect()
    let leftAdjust = parseFloat(newBasePosition.left) - parseFloat(previousPosition.left)

    Array.prototype.forEach.call(discArea.childNodes, (disc) => {
        disc.style.left = `${ parseFloat(disc.style.left.slice(0,-2)) + leftAdjust }px`
    })

    previousPosition = newBasePosition

    placeHighlightOverBoard()
}, false)

restartButton.addEventListener('click', () => {
    //remove discs
    while (discArea.firstChild) discArea.removeChild(discArea.firstChild)
    //remove highlights
    while (winHighlightArea.firstChild) winHighlightArea.removeChild(winHighlightArea.firstChild)
    //remove deslectAll
    connectFourArea.classList.remove("deselectAll")
    //remove all deselects
    Array.prototype.forEach.call(discArea.childNodes, (disc) => {
        disc.classList.remove("deselect")
    })
    //remove win classes and return to normal
    document.body.classList.remove("redWin")
    document.body.classList.remove("yellowWin")
    document.body.classList.add("switch")
    //new game
    theGame = new Play(2)
}, false)

Array.prototype.forEach.call(columns, (column) => {
    column.addEventListener('click', () => {
        for(let i = 0; i < columns.length; i++){
            if (columns[i] === column){
                if (theGame.isPossibleMove(i)) {
                    theGame.playerMove(i + 1)
                    break
                } else {
                    console.log("Move not possible")
                }
            }
        }
    }, false)
})

function highlightWin(type, x, y){
    if (type == "H") {
        horizontalHighlight(x, y)
    }
    if (type == "V") {
        verticalHighlight(x, y)
    }
    if (type == "RL") {
        leftRightHighlight(x, y)
    }
    if (type == "LR") {
        rightLeftHighlight(x, y)
    }
}

function verticalHighlight(x, y) {
    let height = 376 // 4 * 94
    let width = 94
    let boardHeight = 564
    let highlight = document.createElementNS(svgNS, "rect")
    let styles = ""
    highlight.setAttributeNS(null, "x", `${ 15 + (x * width)}`)
    highlight.setAttributeNS(null, "y", `${ 15 + boardHeight - height - (y * 94)}`)
    highlight.setAttributeNS(null, "rx", "47")
    highlight.setAttributeNS(null, "ry", "47")
    highlight.setAttributeNS(null, "width", `${width}`)
    highlight.setAttributeNS(null, "height", `${height}`)
    styles += `fill: ${theGame.currentPlayer == 1 ? "rgba(200, 47, 70, 0.30)" : "rgba(238, 204, 60, 0.35)"};`
    styles += `stroke: none;`
    highlight.setAttributeNS(null, "style", styles)
    winHighlightArea.appendChild(highlight)
}

function horizontalHighlight(x, y) {
    let height = 94
    let width = 376 // 4 * 94
    let highlight = document.createElementNS(svgNS, "rect")
    let styles = ""
    highlight.setAttributeNS(null, "x", `${ 15 + (y * height)}`)
    highlight.setAttributeNS(null, "y", `${ 15 + ((6 - x - 1) * height)}`)
    highlight.setAttributeNS(null, "rx", "47")
    highlight.setAttributeNS(null, "ry", "47")
    highlight.setAttributeNS(null, "width", `${width}`)
    highlight.setAttributeNS(null, "height", `${height}`)
    styles += `fill: ${theGame.currentPlayer == 1 ? "rgba(200, 47, 70, 0.30)" : "rgba(238, 204, 60, 0.35)"};`
    styles += `stroke: none;`
    highlight.setAttributeNS(null, "style", styles)
    winHighlightArea.appendChild(highlight)
}

function leftRightHighlight(x, y) {
    let diagonal = 132.936 // a^2 + b^2 = diagonal^2
    let width = 496
    let height = 94
    let transform = document.createElementNS(svgNS, "g")
    let highlight = document.createElementNS(svgNS, "rect")
    let styles = ""

    transform.setAttributeNS(null, "transform", `rotate(135 ${15 + (y * height) + 47} ${15 + ((6 - x - 1) * height) + 47})`)
    highlight.setAttributeNS(null, "x", `${ 15 + (y * height)}`)
    highlight.setAttributeNS(null, "y", `${ 15 + ((6 - x - 1) * height)}`)
    highlight.setAttributeNS(null, "rx", "47")
    highlight.setAttributeNS(null, "ry", "47")
    highlight.setAttributeNS(null, "width", `${width}`)
    highlight.setAttributeNS(null, "height", `${height}`)
    styles += `fill: ${theGame.currentPlayer == 1 ? "rgba(200, 47, 70, 0.30)" : "rgba(238, 204, 60, 0.35)"};`
    styles += `stroke: none;`
    highlight.setAttributeNS(null, "style", styles)

    transform.appendChild(highlight)
    winHighlightArea.appendChild(transform)
}

function rightLeftHighlight(x, y) {
    let diagonal = 132.936 // a^2 + b^2 = diagonal^2
    let width = 496
    let height = 94
    let transform = document.createElementNS(svgNS, "g")
    let highlight = document.createElementNS(svgNS, "rect")
    let styles = ""

    transform.setAttributeNS(null, "transform", `rotate(45 ${15 + (y * height) + 47} ${15 + ((6 - x - 1) * height) + 47})`)
    highlight.setAttributeNS(null, "x", `${ 15 + (y * height)}`)
    highlight.setAttributeNS(null, "y", `${ 15 + ((6 - x - 1) * height)}`)
    highlight.setAttributeNS(null, "rx", "47")
    highlight.setAttributeNS(null, "ry", "47")
    highlight.setAttributeNS(null, "width", `${width}`)
    highlight.setAttributeNS(null, "height", `${height}`)
    styles += `fill: ${theGame.currentPlayer == 1 ? "rgba(200, 47, 70, 0.30)" : "rgba(238, 204, 60, 0.35)"};`
    styles += `stroke: none;`
    highlight.setAttributeNS(null, "style", styles)

    transform.appendChild(highlight)
    winHighlightArea.appendChild(transform)
}
