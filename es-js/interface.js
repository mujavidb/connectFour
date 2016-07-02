//TODO: Internationalise
//TODO: Add move authentication
//TODO: Allow for minification of selectors and variables across all files
//TODO: Improve modal design
//TODO: Add gone offline notification
//TODO: Account for inability to connect to server

//Shorthand to select element
function _$(x){ return document.querySelector(x) }

//Shorthand to select multiple elements
function _$$(x){ return document.querySelectorAll(x) }

//Apply a function to multiple elements
function _f(selected, modifier) {Array.prototype.forEach.call(selected, modifier)}

//Ease of debugging
function p(x){
    console.log(x)
}

//View functions to expose to controller
let addDiscToBoard = null
let restartGame = null
let cancelSearchModal = null
let onlineGameSetup = null

let setup = (() => {

    //Setup variables
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

    //Does what it says on the tin
    addDiscToBoard = function(location, player, maxHeight){

        //Creates an SVG image element and places it above the board
        const disc = document.createElementNS(svgNS, "image")
        disc.setAttributeNS("http://www.w3.org/1999/xlink", "href", player == 1 ? "img/red_disc.svg" : "img/yellow_disc.svg")
        disc.setAttribute("x", `${ 18 + (location[1]) * 94 + 7}`)
        disc.setAttribute("y", "-80")
        disc.setAttribute("width", "80")
        disc.setAttribute("height", "80")
        discArea.appendChild(disc)

        //Animate disc down the board to its position
        animateDiscDown(disc, location[0])

        //Wait till piece is down
        setTimeout(() => {

            //Check if the move won the game for the player
            if (theGame.winningSequence.type) {

                //Prevent any columns from being clicked
                connectFourArea.classList.add("deselectAll")

                //Display winning player sign
                document.body.classList.add( player == 1 ? "redWin" : "yellowWin" )

                //Highlight the winning set of four on the board
                highlightWin(theGame.winningSequence.type, theGame.winningSequence.x, theGame.winningSequence.y)

                //Increment the player's score
                if (player == 1) {
                    redScore.innerHTML = `${ parseInt(redScore.innerHTML) + 1}`
                } else {
                    yellowScore.innerHTML = `${ parseInt(yellowScore.innerHTML) + 1}`
                }
            } else {

                //If no win
                //If the column is now full, prevent it from being clicked
                if (location[0] == maxHeight - 1) {
                    columns[location[1]].classList.add("deselect")
                }

                //Change the player in UI
                document.body.classList.toggle("switch")
            }

            //Length of time equal to animation length
        }, 100 + (300 / 5) * (5 - location[0]))
    }

    //Literally cant explain this name further
    function animateDiscDown(disc, y){

        //Calculate location to animate disc down to
        const finalLocation = 18 + (5 - y) * 94 + 7

        //Depending on row the disc goes down to, animation length changes
        //so that the speed of descent is constant
        const transitionSpeed = `transform ${ (0.3 / 5) * (5 - y) }s ease-in`
        disc.style.transition = transitionSpeed

        //Allow 20ms for DOM to update
        setTimeout(() => {

            //Translate the disc to finalLocation so that
            //animation is passed to css
            disc.style.transform = `translateY(${finalLocation + 80}px)`
        }, 20)
    }

    //Display message if screen width too small
    function ensureScreenSize(){

        //If screensize is too small throw up a modal
        if (screen.width < 320) {
            _$(".screenSize").classList.add("show")
        } else {
            _$(".screenSize").classList.remove("show")
        }
    }

    //Depending on type of victory (H, V, LR, RL) activate different function
    function highlightWin(type, x, y){
        type == "H" ? horizontalHighlight(x, y) : type == "V" ? verticalHighlight(x, y) : diagonalHighlight(x, y, type == "RL" ? 135 : 45)
    }

    //Creates the physical svg rounded rect
    function createSVGHighlight(x, y, width, height, player){

        //Create the rect
        const highlight = document.createElementNS(svgNS, "rect")
        let styles = ""
        highlight.setAttributeNS(null, "x", `${ x }`)
        highlight.setAttributeNS(null, "y", `${ y }`)
        highlight.setAttributeNS(null, "rx", "47")
        highlight.setAttributeNS(null, "ry", "47")
        highlight.setAttributeNS(null, "width", `${width}`)
        highlight.setAttributeNS(null, "height", `${height}`)

        //Depending on player apply different fill
        styles += `fill: ${player == 1 ? "rgba(240, 70, 95, 0.5)" : "rgba(215, 200, 40, 0.4)"};`
        styles += `stroke: none;`
        highlight.setAttributeNS(null, "style", styles)

        //Send finished product out to be used
        return highlight
    }

    //Place vertical highlight
    function verticalHighlight(x, y) {
        const height = 376 // 4 * 94
        const width = 94
        const boardHeight = 564
        const left = 18 + (x * width)
        const top = 18 + boardHeight - height - (y * 94)
        const highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    //Place horizontal highlight
    function horizontalHighlight(x, y) {
        let height = 94
        let width = 376 // 4 * 94
        let left = 18 + (y * height)
        let top = 18 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)
        winHighlightArea.appendChild(highlight)
    }

    //Place diagonal highlight on board
    function diagonalHighlight(x, y, angle) {

        //Set up SVG
        let width = 494
        let height = 94
        let left = 18 + (y * height)
        let top = 18 + ((6 - x - 1) * height)
        let highlight = createSVGHighlight(left, top, width, height, theGame.currentPlayer)

        //Create container to rotate
        let transform = document.createElementNS(svgNS, "g")
        transform.setAttributeNS(null, "transform", `rotate(${angle} ${left + 47} ${top + 47})`)
        transform.appendChild(highlight)
        winHighlightArea.appendChild(transform)
    }

    //Removes all pieces from board and run a function if passed
    function clearBoard(restartLogic){

        //Disable restart button to prevent re-clicks during the process
        restartButton.disabled = true

        //remove highlights
        while (winHighlightArea.firstChild) winHighlightArea.removeChild(winHighlightArea.firstChild)

        //animate discs container out of view
        discArea.classList.add("moveOut")
        perspective.classList.add("active")

        setTimeout(() => {
            restartButton.disabled = false

            //Remove discs from view
            while (discArea.firstChild) discArea.removeChild(discArea.firstChild)

            //Move disc container back into view
            discArea.classList.remove("moveOut")
            perspective.classList.remove("active")

            //Remove deslectAll from columns to allow for clicking anew
            connectFourArea.classList.remove("deselectAll")

            //Remove individual deselect classes from columns
            for (let disc of discArea.childNodes) {
                disc.classList.remove("deselect")
            }

            //Remove win classes and return game to default start
            document.body.classList.remove("redWin")
            document.body.classList.remove("yellowWin")
            document.body.classList.add("switch")

            //If internal restart logic is supplied, run it
            if (restartLogic != null) {
                restartLogic()
            }

        }, 1500)
    }

    //clears board then adds internal restart logic
    restartGame = (isOnline, didInitiateRestart = true) => {
        clearBoard(() => {

            //If restarting to a new OnlineGame
            if (isOnline){

                //If the user is connected to the server
                if (theGame.isOnline){

                    //If the user requested restart themselves
                    if (didInitiateRestart) {

                        //Get opponent to restart their game, too
                        theGame.requestRestart()
                    }

                    //Restart game logic internally, i.e. create a new model
                    theGame.internalRestart()
                } else {

                    //If playing an online game but not connected to server yet
                    theGame = new OnlineGame(2)
                }
            } else {

                //If restarting to a new OfflineGame
                //If user is currently in an OnlineGame
                if (String(playOnline.classList).indexOf("quitOnline") > -1) {

                    //Restart counters
                    redScore.innerHTML = "0"
                    yellowScore.innerHTML = "0"

                    //Change button in view
                    playOnline.classList.remove("quitOnline")
                    playOnline.innerHTML = "Play Online"
                }

                //Create a new game
                theGame = new OfflineGame(2)
            }
        })
    }

    //Cancels the online game search
    cancelSearchModal = (cancelGame, goOnline = false) => {

        //Cancels the modal
        _$(".startOnline").classList.remove("show")

        //If user is about to go online
        if (goOnline) {

            //Clear scores
            redScore.innerHTML = "0"
            yellowScore.innerHTML = "0"

            //Update playOnline button for online gameplay
            playOnline.classList.add("quitOnline")
            playOnline.innerHTML = "Quit Online"
            clearBoard()
        }
    }

    //When game is found and the user connect to their opponent
    //tell the player which piece they are playing as
    onlineGameSetup = (playerNumber) => {

        //
        _$(".slideRandom").classList.add("online")

        //Update search-online-modal with user's color and player order
        if (playerNumber == 1) {
            _$("#playerStartInfo").innerHTML = "You are playing as Red, starting first"
            _$(".gameFound").classList.add("playerOne")
        } else {
            _$("#playerStartInfo").innerHTML = "You are playing as Yellow, starting second"
            _$(".gameFound").classList.add("playerTwo")
        }

        //Remove classes after the modal has gone
        setTimeout(() => {
            _$(".slideRandom").classList.remove("online")
            _$(".gameFound").classList.remove("playerOne")
            _$(".gameFound").classList.remove("playerTwo")
        }, 4000)
    }

    // Setup code i.e. bind all event listeners
    (() => {

        //Check screen size
        ensureScreenSize()

        //Bugfix for incorrect server disconnection + restart event
        restartButton.disabled = false

        //To ensure the game is displayed correctly to all users
        window.addEventListener('resize', () => {
            ensureScreenSize()
        }, false)

        //No really... it restarts the game
        restartButton.addEventListener('click', () => {
            restartGame(theGame.isOnline)
        }, false)

        playOnline.addEventListener('click', () => {

            //If already online triggers a two-player disconnect
            if (String(playOnline.classList).indexOf("quitOnline") > -1) {
                theGame.forceDisconnect()
            } else {

                //If not online, starts online game search
                _$('.startOnline').classList.add("show")
                theGame = new OnlineGame(2)
            }
        }, false)

        //If ESC key pressed
        document.onkeydown = (event) => {

            //If during search modal, cancel search
            if (event.keyCode == KEYCODE_ESC && String(_$(".startOnline").classList).indexOf("show") > -1) {
                theGame.forceDisconnect()
                cancelSearchModal(false)
            }
        }

        //Cancel actual searching in socket/server
        _$(".cancelRandomSearch").addEventListener("click", () => {
            theGame.forceDisconnect()
            cancelSearchModal(true)
        }, false)

        //Add functionality to column buttons
        for (let column of columns) {
            column.addEventListener('click', () => {
                for(let i = 0; i < columns.length; i++){
                    if (columns[i] === column){

                        //If the move is possible
                        if (theGame.isPossibleMove(i)) {

                            //Play move on board
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
