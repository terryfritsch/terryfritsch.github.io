function myLife() {
    this.canvasSize = 200;
    this.cellSize = 10;
    this.gridSize = parseInt(this.canvasSize / this.cellSize);
    this.deadCell = 0;
    this.aliveCell = 1;

}

myLife.prototype = {
    init: function () {
        this.grid = this.createGrid();        
        this.randomizeAlive();
        this.displayGrid();
        this.loop();
        var me = this;
        
        /* for debug
        window.addEventListener('keypress',function(){
            me.loop();
            
        });*/

    },
    createGrid: function () {


        var gridSize = this.gridSize;
        var grid = Array(gridSize);

        // Allocate 2d grid
        for (var x = 0; x < grid.length; x++) {
            grid[x] = Array(gridSize);

            for (var y = 0; y < grid[x].length; y++) {
                //assign all cells and deadCells
                grid[x][y] = this.deadCell;
            }
        }

       
        return grid;



    },
    displayGrid: function () {
        var grid = this.grid;
        var ctx = $("#life-canvas")[0].getContext("2d");
        this.ctx = ctx;
        var canvasSize = this.canvasSize;
        var cellSize = this.cellSize;
        var me = this;
        //Clear canvas
        
        // Change fill style back to black
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = "1";
        // Iterate through each cell
        this.iterateArr(function (x, y, alive) {
            //stroke grid                
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            //check if grid is alive
            if (alive == me.aliveCell) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        });

    },
    randomizeAlive: function () {
       var grid = this.grid;
        var me = this;
        this.iterateArr(function(x,y,alive){
            var rand = Math.random() < 0.5 ? 1 : 0;
            me.setCell(x,y,rand);
        });


    },
    iterateArr: function (func) {
        var grid = this.grid;
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {

                //pass back x, y, alive
                func(x, y, grid[x][y]);

            }
        }


    },
    setCell:function(x, y, alive){
        var grid = this.grid;
        
        grid[x][y] = alive;
         
        
    },
    checkNeighbors: function(myX,myY){
        var me = this;
        var grid = me.grid;
        var alive = 0;
        //get contstrained neighbors around me
        var neighbours = [
                grid[myX][(myY - 1 + me.gridSize) % me.gridSize],
                grid[(myX + 1 + me.gridSize) % me.gridSize][(myY - 1 + me.gridSize) % me.gridSize],
                grid[(myX + 1 + me.gridSize) % me.gridSize][myY],
                grid[(myX + 1 + me.gridSize) % me.gridSize][(myY + 1 + me.gridSize) % me.gridSize],
                grid[myX][(myY + 1 + me.gridSize) % me.gridSize],
                grid[(myX - 1 + me.gridSize) % me.gridSize][(myY + 1 + me.gridSize) % me.gridSize],
                grid[(myX - 1 + me.gridSize) % me.gridSize][myY],
                grid[(myX - 1 + me.gridSize) % me.gridSize][(myY - 1 + me.gridSize) % me.gridSize]
            ];
        
        for (var i = 0; i < neighbours.length; i++) {
            if (neighbours[i]) {
                //set party-mode
                var letters = '0123456789ABCDEF'.split('');
                var color = '#';
                for (var j = 0; j < 6; j++ ) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                    me.ctx.lineWidth = "2";
                    me.ctx.strokeStyle = color;
                    me.ctx.strokeRect(myX * me.cellSize, myY * me.cellSize, me.cellSize, me.cellSize);  
                
                
                //increment alive
                alive++;
            }
        }
        
               
        return alive;
        
    },
    nextGeneration: function(){
        var me = this;
        var grid = me.grid;
        var newGrid = me.createGrid(); //create nextGen grid
        console.log("==================================");
        
        me.iterateArr(function(x,y,alive){
            
            var aliveCount = me.checkNeighbors(x,y);
            
            //Conways rules.....
            if(alive && (aliveCount == 2 || aliveCount ==3)){
                //we're good
                 newGrid[x][y] = me.aliveCell;                
            }
            if(!alive && aliveCount == 3){
                //come alive!
                newGrid[x][y] = me.aliveCell;
            }
            else{
                //die
                
                
                
            }
            console.log("count " +aliveCount);
                console.log("alive " +alive);
            
        });
        
        me.grid = newGrid;
        
    },
    loop:function(){
        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        this.nextGeneration();
        this.displayGrid();
        
        setTimeout(this.loop.bind(this),100);
        
        
    }



}


var life = new myLife();

life.init();