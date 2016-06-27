//TODO: Internationalise
//TODO: Add move authentication
//TODO: Document
//TODO: Structure CSS
//TODO: Allow for minification of selectors and variables across all files
//TODO: Improve modal design
//TODO: Add gone offline notification
//TODO: Find all bugs and edge-cases

function _$(x){ return document.querySelector(x) }

function _$$(x){ return document.querySelectorAll(x) }

function _f(selected, modifier) {Array.prototype.forEach.call(selected, modifier)}

function p(x){
    console.log(x)
}

let addDiscToBoard = null
let restartGame = null
let cancelSearchModal = null
let onlineGameSetup = null

let setup = (() => {

    let theGame = new OfflineGame(2)
    const connectFourArea = _$(".gameContainer")
    const columns = _$$('.column')
    const discSVG = _$('#discArea')
    const discArea = _$('#discAreaGroup')
    const winHighlightArea = _$("#winHighlight")
    const redScore = _$("#redScore")
    const yellowScore = _$("#yellowScore")
    const perspective = _$(".perspectiveChild")
    const restartButton = _$(".restartGame")
    const playOnline = _$('.playOnline')
    const svgNS = "http://www.w3.org/2000/svg"
    const KEYCODE_ESC = 27;

    addDiscToBoard = function(location, player, maxHeight){
        const disc = document.createElementNS(svgNS, "image")
        disc.setAttributeNS("http://www.w3.org/1999/xlink", "href", player == 1 ? "img/red_disc.svg" : "img/yellow_disc.svg")
        disc.setAttribute("x", `${ 18 + (location[1]) * 94 + 7}`)
        disc.setAttribute("y", "-80")
        disc.setAttribute("width", "80")
        disc.setAttribute("height", "80")
        discArea.appendChild(disc)
        animateDiscDown(disc, location[0])

        setTimeout(() => {
            if (theGame.winningSequence.type) {
                connectFourArea.classList.add("deselectAll")
                document.body.classList.add( player == 1 ? "redWin" : "yellowWin" )
                highlightWin(theGame.winningSequence.type, theGame.winningSequence.x, theGame.winningSequence.y)
                if (player == 1) {
                    redScore.innerHTML = `${ parseInt(redScore.innerHTML) + 1}`
                } else {
                    yellowScore.innerHTML = `${ parseInt(yellowScore.innerHTML) + 1}`
                }
            } else {
                if (location[0] == maxHeight - 1) {
                    columns[location[1]].classList.add("deselect")
                }
                document.body.classList.toggle("switch")
            }
        }, 100 + (300 / 5) * (5 - location[0]))
    }

    function animateDiscDown(disc, y){
        const finalLocation = 18 + (5 - y) * 94 + 7
        const transitionSpeed = `transform ${ (0.3 / 5) * (5 - y) }s ease-in`
        disc.style.transition = transitionSpeed
        setTimeout(() => {
            disc.style.transform = `translateY(${finalLocation + 80}px)`
        }, 20)
    }

    function ensureScreenSize(){
        if (screen.width < 320) {
            _$(".screenSize").classList.add("show")
        } else {
            _$(".screenSize").classList.remove("show")
        }
    }

    function highlightWin(type, x, y){
        type == "H" ? horizontalHighlight(x, y) : type == "V" ? verticalHighlight(x, y) : diagonalHighlight(x, y, type == "RL" ? 135 : 45)
    }

    function createSVGHighlight(x, y, width, height, player){
        const highlight = document.createElementNS(svgNS, "rect")
        let styles = ""
        highlight.setAttributeNS(null, "x", `${ x }`)
        highlight.setAttributeNS(null, "y", `${ y }`)
        highlight.setAttributeNS(null, "rx", "47")
        highlight.setAttributeNS(null, "ry", "47")
        highlight.setAttributeNS(null, "width", `${width}`)
        highlight.setAttributeNS(null, "height", `${height}`)
        styles += `fill: ${player == 1 ? "rgba(240, 70, 95, 0.5)" : "rgba(215, 200, 40, 0.4)"};`
        styles += `stroke: none;`
        highlight.setAttributeNS(null, "style", styles)
        return highlight
    }

    function verticalHighlight(x, y) {
        const height = 376 // 4 * 94
        const width = 94
        const boardHeight = 564
        const left = 18 + (x * width)
        const top = 18 + boardHeight - height - (y * 94)
        const highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    function horizontalHighlight(x, y) {
        let height = 94
        let width = 376 // 4 * 94
        let left = 18 + (y * height)
        let top = 18 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    function diagonalHighlight(x, y, angle) {
        let width = 494
        let height = 94
        let left = 18 + (y * height)
        let top = 18 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)
        let transform = document.createElementNS(svgNS, "g")
        transform.setAttributeNS(null, "transform", `rotate(${angle} ${left + 47} ${top + 47})`)
        transform.appendChild(highlight)
        winHighlightArea.appendChild(transform)
    }

    restartGame = (isOnline, didInitiateRestart = true) => {
        restartButton.disabled = true

        //remove highlights
        while (winHighlightArea.firstChild) winHighlightArea.removeChild(winHighlightArea.firstChild)

        //animate discs down and out
        discArea.classList.add("moveOut")
        perspective.classList.add("active")

        setTimeout(() => {
            restartButton.disabled = false
            //remove discs
            while (discArea.firstChild) discArea.removeChild(discArea.firstChild)
            discArea.classList.remove("moveOut")
            perspective.classList.remove("active")
            //remove deslectAll
            connectFourArea.classList.remove("deselectAll")
            //remove all deselects
            for (let disc of discArea.childNodes) {
                disc.classList.remove("deselect")
            }
            //remove win classes and return to normal
            document.body.classList.remove("redWin")
            document.body.classList.remove("yellowWin")
            document.body.classList.add("switch")
            //start a new game in model
            if (isOnline){
                if (theGame.isOnline){
                    if (didInitiateRestart) {
                        theGame.requestRestart()
                    }
                    theGame.internalRestart()
                } else {
                    theGame = new OnlineGame(2)
                }
            } else {
                if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                    redScore.innerHTML = "0"
                    yellowScore.innerHTML = "0"
                    playOnline.classList.remove("quitOnline")
                    playOnline.innerHTML = "Play Online"
                }
                theGame = new OfflineGame(2)
            }
        }, 1500)
    }

    cancelSearchModal = (cancelGame, goOnline = false) => {
        _$(".startOnline").classList.remove("show")
        if (cancelGame) {
            // theGame.isOnline ? theGame = new OnlineGame(2) : theGame = new OfflineGame(2)
        } else if (goOnline) {
            redScore.innerHTML = "0"
            yellowScore.innerHTML = "0"
            playOnline.classList.add("quitOnline")
            playOnline.innerHTML = "Quit Online"
            restartGame(true)
        }
    }

    onlineGameSetup = (playerNumber) => {
        _$(".slideRandom").classList.add("online")
        if (playerNumber == 1) {
            _$("#playerStartInfo").innerHTML = "You are playing as Red, starting first"
            _$(".gameFound").classList.add("playerOne")
        } else {
            _$("#playerStartInfo").innerHTML = "You are playing as Yellow, starting second"
            _$(".gameFound").classList.add("playerTwo")
        }
        setTimeout(() => {
            _$(".slideRandom").classList.remove("online")
            _$(".gameFound").classList.remove("playerOne")
            _$(".gameFound").classList.remove("playerTwo")
        }, 4000)
    }

    // Setup code i.e. bind all event listeners
    (() => {

        ensureScreenSize()
        restartButton.disabled = false

        window.addEventListener('resize', () => {
            ensureScreenSize()
        }, false)

        restartButton.addEventListener('click', () => {
            restartGame(theGame.isOnline)
        }, false)

        playOnline.addEventListener('click', () => {
            if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                theGame.forceDisconnect()
            } else {
                _$('.startOnline').classList.add("show")
                theGame = new OnlineGame(2)
            }
        }, false)

        document.onkeydown = (event) => {
            if (event.keyCode == KEYCODE_ESC && String(_$(".startOnline").classList).indexOf("show") > -1) {
                theGame.forceDisconnect()
                cancelSearchModal(false)
            }
        }

        _$(".cancelRandomSearch").addEventListener("click", () => {
            //cancel actual searching in socket/server
            theGame.forceDisconnect()
            cancelSearchModal(true)
        }, false)

        for (let column of columns) {
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
        }
    })();

})()

document.addEventListener("DOMContentLoaded", setup, false)
