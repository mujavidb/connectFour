//TODO: Structure JS correctly
//TODO: Make complete design responsive
//TODO: Improve Design
//TODO: Add Player Scoring

let addDiscToBoard

let setup = (function(){
    
    let theGame = new Play(2)
    var connectFourArea = document.querySelector('.connectFourBoard')
    var columns = document.querySelectorAll('.connectFourBoard .column')
    var discArea = document.getElementById('discArea')
    let winHighlightArea = document.getElementById("winHighlight")
    var restartButton = document.getElementsByClassName("restartGame")[0]
    let previousPosition = connectFourArea.getBoundingClientRect()
    var svgNS = "http://www.w3.org/2000/svg"

    addDiscToBoard = function(location, player, maxHeight){
        let disc = document.createElementNS(svgNS, "image")
        disc.setAttributeNS("http://www.w3.org/1999/xlink", "href", player == 1 ? "img/red_disc.png" : "img/yellow_disc.png")
        disc.setAttribute("x", `${ 15 + (location[1]) * 94 + 7}px`)
        disc.setAttribute("y", `${ 15 + (5 - location[0]) * 94 + 7}px`)
        disc.setAttribute("width", "80")
        disc.setAttribute("height", "80")
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
        discArea.style.top = `${previousPosition.top}px`
        discArea.style.left = `${previousPosition.left}px`
    }

    window.addEventListener('resize', () => {
        let newBasePosition = connectFourArea.getBoundingClientRect()
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
        type == "H" ? horizontalHighlight(x, y) : type == "V" ? verticalHighlight(x, y) : diagonalHighlight(x, y, type == "RL" ? 135 : 45)
    }

    function createSVGHighlight(x, y, width, height, player){
        let highlight = document.createElementNS(svgNS, "rect")
        let styles = ""
        highlight.setAttributeNS(null, "x", `${ x }`)
        highlight.setAttributeNS(null, "y", `${ y }`)
        highlight.setAttributeNS(null, "rx", "47")
        highlight.setAttributeNS(null, "ry", "47")
        highlight.setAttributeNS(null, "width", `${width}`)
        highlight.setAttributeNS(null, "height", `${height}`)
        styles += `fill: ${player == 1 ? "rgba(200, 47, 70, 0.30)" : "rgba(255, 171, 0, 0.4)"};`
        styles += `stroke: none;`
        highlight.setAttributeNS(null, "style", styles)
        return highlight
    }

    function verticalHighlight(x, y) {
        let height = 376 // 4 * 94
        let width = 94
        let boardHeight = 564
        let left = 15 + (x * width)
        let top = 15 + boardHeight - height - (y * 94)
        let highlight = createSVGHighlight(left, top, 94, 376, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    function horizontalHighlight(x, y) {
        let height = 94
        let width = 376 // 4 * 94
        let left = 15 + (y * height)
        let top = 15 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, 376, 94, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    function diagonalHighlight(x, y, angle) {
        let width = 496
        let height = 94
        let transform = document.createElementNS(svgNS, "g")
        let left = 15 + (y * height)
        let top = 15 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, 496, 94, theGame.currentPlayer)
        transform.setAttributeNS(null, "transform", `rotate(${angle} ${left + 47} ${top + 47})`)
        transform.appendChild(highlight)
        winHighlightArea.appendChild(transform)
    }

    placeHighlightOverBoard()

})()

document.addEventListener("DOMContentLoaded", setup, false)
