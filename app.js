document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    grid.addEventListener(('contextmenu'), (event) => {
        event.preventDefault();
    })
    let cells = [];
    let width = 16;
    let height = 16;
    let mineAmount = 40;
    
    let selectedSize = '16x16'

    let flagCount = 0;
    let checkedCount = 0;
    let isGameOver = 0;
    let started = 0;
    let startTime = 0;

    const di = [-1, -1, -1, 1, 1, 1, 0, 0];
    const dj = [-1, 1, 0, -1, 1, 0, 1, -1];

    function inBounds(x, y)
    {
        if(x < 0 || x >= height || y < 0 || y >= width)
            return 0;
        return 1;
    }

    
    function populateGrid(cells)
    {
        let cnt = 0;
        while(cnt < mineAmount)
        {
            const x = Math.floor(Math.random() * height);
            const y = Math.floor(Math.random() * width);
            if(cells[x][y] != -1)
            {
                cnt++;
                cells[x][y] = -1;5
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
    
    function reset()
    {
        flagCount = 0, checkedCount = 0, isGameOver = 0;
        started = 0, startTime = 0;
        cells = [];

        document.getElementById('timer').innerHTML = "00:00"
        for(let i=0; i<width*height; i++)
        {
            const cell = document.getElementById(i);
            cell.remove();
        }
    }

    function createGrid()
    {
        console.log(height, width);
        document.getElementById('flag-count').innerHTML = `00/${mineAmount}`
        cells = Array.from(Array(height), () => new Array(width).fill(0));
        console.log(cells);
        populateGrid(cells);
        for(let i=0; i<height; i++)
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
                cell.classList.add(`cell-${height}x${width}`);
                grid.appendChild(cell);
                cell.addEventListener('contextmenu', (e) => {
                    rightClick(e, cell);
                })
                cell.addEventListener('click', (e) => {
                    leftClick(cell);
                })
            }
        }
    }

    //init
    createGrid();
    grid.classList.add(`grid-${selectedSize}`);

    //Util functions

    // function removeSizeClass()
    // {
    //     for(let i=0; i<width*height; i++)
    //     {
    //         const cell = document.getElementById(i);
    //         cell.classList.remove(`cell-${selectedSize}`);
    //     }
    //     grid.classList.remove(`grid-${selectedSize}`);
    // }

    // function addSizeClass()
    // {
    //     for(let i=0; i<width*height; i++)
    //     {
    //         const cell = document.getElementById(i);
    //         cell.classList.add(`cell-${selectedSize}`);
    //     }
    //     grid.classList.add(`grid-${selectedSize}`);
    // }
    
    function BFS(x, y)
    {
        const cell = document.getElementById(`${x*width + y}`);
        if(cell.classList.contains('checked'))
            return ;
        cell.classList.remove('flag');
        cell.classList.add('checked');
        checkedCount++;
        let mines = cell.getAttribute('data');
        if(mines != 0)
            cell.classList.add(`${"open"+cell.getAttribute('data')}`);  
            height
        if(checkedCount == width*height - mineAmount)
        {
               isGameOver = 1;
            return ;
        }
        if(mines == 0)
        {
            for(let k=0; k<8; k++)
            {
                let nx = x + di[k];
                let ny = y + dj[k];
                if(!inBounds(nx, ny) || cells[nx][ny] == -1)
                continue;
                
                BFS(nx, ny)
            }
        }

    }

    //EventListeners

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.onclick = playAgain;

    document.getElementById('8x8').onclick = changeGridSize;
    document.getElementById('16x16').onclick = changeGridSize;
    document.getElementById('16x30').onclick = changeGridSize;
    

    function changeGridSize(event) 
    {
        grid.classList.remove(`grid-${selectedSize}`);
        reset();
        selectedSize = event.target.id;
        height = parseInt(selectedSize.split('x')[0]);
        width = parseInt(selectedSize.split('x')[1]);
        grid.classList.add(`grid-${selectedSize}`);
        if(width == 8) mineAmount = 20;
        if(width == 16) mineAmount = 40;
        if(width == 30) mineAmount = 99;
        createGrid();
    }

    function playAgain()
    {
        reset();
        createGrid();
    }

    function startTimer()
    {
        setInterval(() => {
            if(isGameOver)
                return
            const timer = document.getElementById('timer')
            if(!started)
                timer.innerHTML = "00:00";
            else
            {
                var now = new Date().getTime();
                var dif = now - startTime;
                var minutes = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((dif % (1000 * 60)) / 1000);
                seconds = `${seconds < 10? `0${seconds}` : seconds}`;
                minutes = `${minutes < 10? `0${minutes}` : minutes}`;
                timer.innerHTML = `${minutes}:${seconds}`;
            }
        }, 1000)
    }

    function rightClick(event, cell)
    {
        event.preventDefault();
        if(isGameOver || cell.classList.contains("checked")) return
        if(cell.classList.contains('flag'))
            cell.classList.remove('flag'), flagCount--;
        else
            cell.classList.add('flag'), flagCount++;
        document.getElementById("flag-count").innerHTML = `${flagCount<10? "0" : ""}${flagCount}/${mineAmount}`
    }

    function leftClick(cell)
    {
        let id = cell.getAttribute('id');
        let x = Math.floor(id/width);
        let y = id%width;
        if(isGameOver || cell.classList.contains('flag')) 
            return
        if(cell.classList.contains('mine'))
        {
            started = 1;
            startTime = 0;
            console.log("Game Over"), isGameOver = 1;
            cell.classList.add('mine_self');
            for(let i=0; i<height; i++)
            {
                for(let j=0; j<width; j++)
                {
                    let id = i*width + j;
                    if(id == cell.getAttribute('id'))
                        continue;
                    let C = document.getElementById(id);
                    if(C.classList.contains('flag') || 
                        C.classList.contains('checked'))
                        continue;
                    if(C.classList.contains('mine'))
                        C.classList.add("mine_others");
                }
            }
        }
        else if(cell.classList.contains('checked'))
        {
            let flags = 0;
            for(let k=0; k<8; k++)
            {
                let nx = x + di[k];
                let ny = y + dj[k];
                if(!inBounds(nx, ny))
                    continue;
                let adjacentCell = document.getElementById(`${nx*width + ny}`);
                if(adjacentCell.classList.contains('checked'))
                    continue;
                else if(adjacentCell.classList.contains('flag'))
                    flags++;
            }
            if(flags == cells[x][y])
            {
                for(let k=0; k<8; k++)
                {
                    let nx = x + di[k];
                    let ny = y + dj[k];
                    if(!inBounds(nx, ny))
                        continue;
                    let adjacentCell = document.getElementById(`${nx*width + ny}`);
                    if(adjacentCell.classList.contains('checked') || 
                        adjacentCell.classList.contains('flag'))
                        continue;
                    leftClick(adjacentCell);
                }
            }
        }
        else
        {
            if(!started)
            {
                started = 1;
                startTime = new Date().getTime();
                startTimer();
            }
            BFS(x, y);
        }
    }

})