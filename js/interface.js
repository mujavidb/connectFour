//ViewController

let theGame = new Play(2)

var columns = document.querySelectorAll('.connectFourBoard .column')
var discArea = document.querySelector('.discArea')

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
    disc.classList.add("disc")
    disc.style.top = `calc( 15px + ${(5 - location[0]) * 94}px + 7px)`
    disc.style.left = `calc( 15px + ${(location[1]) * 94}px + 7px)`
    disc.src = player == 1 ? "img/red_disc.png" : "img/yellow_disc.png"
    discArea.appendChild(disc)

    if (theGame.winningSequence.type) {
        document.getElementsByClassName("connectFourBoard")[0].classList.add("deselectAll")
        return
    }

    if (location[0] == maxHeight - 1) {
        columns[location[1]].classList.add("deselect")
    }

    document.body.classList.toggle("switch")
}
