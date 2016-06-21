//TODO: Internationalise
//TODO: Document
//TODO: Add github url
//TODO: Structure JS correctly
//TODO: Compatible for iOS8
//TODO: Add ability to play opponents online, yes
//TODO: Structure CSS, yes

function _$(x) {
    return document.querySelector(x);
}

function _$$(x) {
    return document.querySelectorAll(x)
}

let addDiscToBoard

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

    function animateDiscDown(disc, y){
        const finalLocation = 18 + (5 - y) * 94 + 7
        const transitionSpeed = `transform ${ (0.3 / 5) * (5 - y) }s ease-in`
        disc.style.transition = transitionSpeed
        setTimeout(() => {
            disc.style.transform = `translateY(${finalLocation + 80}px)`
        }, 20)
    }

    addDiscToBoard = function(location, player, maxHeight){
        let disc = document.createElementNS(svgNS, "image")
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
        let highlight = document.createElementNS(svgNS, "rect")
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
        let height = 376 // 4 * 94
        let width = 94
        let boardHeight = 564
        let left = 18 + (x * width)
        let top = 18 + boardHeight - height - (y * 94)
        let highlight = createSVGHighlight(left, top, 94, 376, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    function horizontalHighlight(x, y) {
        let height = 94
        let width = 376 // 4 * 94
        let left = 18 + (y * height)
        let top = 18 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, 376, 94, theGame.currentPlayer)
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

    function restartGame(isOnline){
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
            //new game
            if (isOnline){
                if (theGame.isOnline){
                    theGame.internalRestart()
                } else {
                    theGame = new OnlineGame(2)
                }
            } else {
                theGame = new OfflineGame(2)
            }
        }, 1500)
    }

    // Setup code
    (() => {
        window.addEventListener('resize', () => {
            ensureScreenSize()
        }, false)

        ensureScreenSize()

        restartButton.addEventListener('click', () => {
            restartGame(false)
        }, false)

        playOnline.addEventListener('click', () => {
            _$('.startOnline').classList.add("show")
        }, false)

        _$('.slideOptions_choices .random').addEventListener('click', () => {
            _$('.startOnline .slideOptions').classList.add('random')
            restartGame(true)
        }, false)

        _$(".cancelRandomSearch").addEventListener("click", () => {
            //cancel actual searching
            _$(".close").parentNode.classList.remove("show")
            _$('.startOnline .slideOptions').classList.remove('random')
            _$('.startOnline .slideOptions').classList.remove('friend')
        }, false)

        for (let button of document.querySelectorAll('button.close')) {
            button.addEventListener('click', () => {
                button.parentNode.classList.remove("show")
                _$('.startOnline .slideOptions').classList.remove('random')
                _$('.startOnline .slideOptions').classList.remove('friend')
            }, false)
        }

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
