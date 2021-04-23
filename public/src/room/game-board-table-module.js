function createGameBoardTable() {
    let table = document.getElementById('game-board-table');
    for (let i = 0; i < 11; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < 11; j++) {
            let td = document.createElement('td');
            tr.appendChild(td);
        }
        table?.appendChild(tr);
    }
}
function clearTable() {
    let table = document.getElementById('game-board-table');
    if (table?.children.length === 11) {
        for (let i = 0; i < 11; i++) {
            if (table.children[i].children.length === 11) {
                for (let j = 0; j < 11; j++) {
                    table.children[i].children[j].innerHTML = '';
                }
            }
        }
    }
}
export { createGameBoardTable, clearTable };
