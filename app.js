document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let cells = [];
    let width = 10;
    let mineAmount = 20;
    let isGameOver = 0;

    const di = [-1, -1, -1, 1, 1, 1, 0, 0];
    const dj = [-1, 1, 0, -1, 1, 0, 1, -1];

    function inBounds(x, y)
    {
        if(x < 0 || x >= width || y < 0 || y >= width)
            return 0;
        return 1;
    }

    function populateGrid(cells)
    {
        console.log(cells);
        let cnt = 0;
        while(cnt < mineAmount)
        {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * width);
            if(cells[x][y] != -1)
            {
                cnt++;
                cells[x][y] = -1;
                for(let k=0; k<8; k++)
                {
                    let nx = x + di[k];
                    let ny = y + dj[k];
                    if(inBounds(nx, ny) && cells[nx][ny] != -1)
                    {
                        cells[nx][ny]++;
                    }
                }
            }
        }
    }

    function createGrid()
    {
        cells = Array.from(Array(width), () => new Array(width).fill(0));
        populateGrid(cells);
        for(let i=0; i<width; i++)
        {
            for(let j=0; j<width; j++)
            {
                const cell = document.createElement('div'); 
                cell.setAttribute('id', i*width+j);
                if(cells[i][j] == -1)
                    cell.classList.add('mine');
                else
                    cell.setAttribute("data", cells[i][j]);
                cell.classList.add('cell');
                grid.appendChild(cell);
                cell.addEventListener('contextmenu', (e) => {
                    rightClick(e, cell);
                })
                cell.addEventListener('click', (e) => {
                    leftClick(cell);
                    // cell.
                    // cell.classList.
                    // cell.classList.remo
                })
            }
        }
    }
    createGrid();

    function BFS(x, y)
    {
        const cell = document.getElementById(`${x*width + y}`);
        if(cell.classList.contains('checked'))
            return ;
        cell.classList.add('checked');
        let mines = cell.getAttribute('data');
        if(mines != 0)
        {
            cell.classList.add('open');
            // cell.innerHTML = mines;  
            return ;
        }
        for(let k=0; k<8; k++)
        {
            let nx = x + di[k];
            let ny = y + dj[k];
            if(!inBounds(nx, ny) || cells[nx][ny] == -1)
                continue;

            BFS(nx, ny)
        }
    }

    function rightClick(event, cell)
    {
        event.preventDefault();
        if(isGameOver || cell.classList.contains("checked")) return
        if(cell.classList.contains('flag'))
            cell.classList.remove('flag');
        else
            cell.classList.add('flag');
    }

    function leftClick(cell)
    {
        if(isGameOver) return
        if(cell.classList.contains('mine'))
            console.log("Game Over"), isGameOver = 1;
        else
        {
            let id = cell.getAttribute('id');
            BFS(Math.floor(id/10), id%10);
        }
    }

})