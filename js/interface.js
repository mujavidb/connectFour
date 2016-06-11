//ViewController

let theGame = new Play(2)

var connectFourArea = document.querySelector('.connectFourBoard')
var columns = document.querySelectorAll('.connectFourBoard .column')
var discArea = document.querySelector('.discArea')
var restartButton = document.getElementsByClassName("restartGame")[0]

let previousPosition = connectFourArea.getBoundingClientRect()

restartButton.addEventListener('click', () => {
    //remove discs
    while (discArea.firstChild) discArea.removeChild(discArea.firstChild)
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

window.addEventListener('resize', () => {
    let newBasePosition = connectFourArea.getBoundingClientRect()
    let leftAdjust = parseFloat(newBasePosition.left) - parseFloat(previousPosition.left)

    Array.prototype.forEach.call(discArea.childNodes, (disc) => {
        disc.style.left = `${ parseFloat(disc.style.left.slice(0,-2)) + leftAdjust }px`
    })

    previousPosition = newBasePosition
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
    } else {
        if (location[0] == maxHeight - 1) {
            columns[location[1]].classList.add("deselect")
        }
        document.body.classList.toggle("switch")
    }
}
