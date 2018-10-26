/* 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title : Assignment 1 Sliding Block Puzzle
Author : 
Created : 
Modified : 
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

// Add any other global variables you may need here.
/**
 * Creates all the tiles necessary.
 * @return undefined
 */

window.onload = function () {
	up = 1
	down = 2
	left = 3;
	right = 4;
	setLevel(2,20);
}

function setLevel(sz,lv){
	step =0;
	$("#step").text("Step: "+step.toString());
	score = 0;
	isclick = true;
	gridSize = 98
	size = parseInt(sz);
	maxSize = parseInt(lv);
	N = size*size;
	boxSize = size*(gridSize+2);
	//maxSize = level;
	imgMatrix = new Array(N);	
	marix = new Array(size);
	for(var i=0;i<size;i++){
		marix[i] = new Array(size);
			for(var j =0;j<size;j++){
				marix[i][j] = i*size+j+1;
		}
	}
	col = size-1;
	row = size-1;
	imgSolve();
 	createTiles(size);
 	tileClicked();
}

function createTiles(size){

	var box = document.getElementById("play_area");
	$(box).html("");
	$(box).css({
		'width':boxSize,
		'height':boxSize
	});
	for(var i =0;i<size;i++){
 		for(var j =0 ;j<size;j++){
 			var grid = document.createElement("div");
 			grid.id = i*size+j+1;
 			grid.className = "grid";
 			$(grid).css({
 				'width':gridSize,
				'height':gridSize,
 				'top':i*100,
 				'left':j*100
 			});
 			grid.appendChild(imgMatrix[i*size+j]);
 			box.appendChild(grid);
 		}

	 }
	 $('#'+N).text('');
	 $('#'+N).css("background-color","#ecf0f1");

}

function imgSolve(){
	var img=document.getElementById("img");
	img.width = boxSize/2;
	img.height = boxSize/2;
	var pieceH = img.naturalHeight/size;
	var pieceW = img.naturalWidth/size;
	for(var i =0; i<size;i++){
		for(var j =0;j<size;j++){
			var y= i*pieceH;
			var x = j*pieceW;
			//得到每一小块图片的数据
			var cvs =document.createElement('canvas');
			cvs.width = gridSize;
			cvs.height = gridSize;
			var ctx=cvs.getContext("2d");
			ctx.drawImage(img,x,y,pieceW,pieceH,0,0,gridSize,gridSize);
			imgMatrix[i*size+j] = cvs;
			//test*/
			
		}
	}

}
/**
 * Example function that could get called when a tile is clicked.
 * @param Add whatever params you need!
 * @return Fill in what the function returns here!
 */
function tileClicked(){
	$('.grid').click(function(){
		var id = parseInt(this.id);
		if(!isclick)
			return;
		if(id==N){
			if(checkWin()&&step>0)
			{
				score+=100;
				$("#score").text("Score: "+score.toString());
				alert("you win");
			}
			else
				return;
		}
		else{
		click(this,500);
		isclick =false;
	    sleep(500).then(() => {
		isclick =true;
		});
		}
		
	});
  // check if the tile can move to the empty spot
  // if the tile can move, move the tile to the empty spot
}

function checkWin(){
	var isWin = false;
	for(var i =0;i<size;i++){
		for(var j=0;j<size;j++){
			if(marix[i][j] != (i*size+j+1)){
				return isWin;
			}
		}
	}
	isWin = true;
	return isWin;
}

function click(node,time){
	var blank = $('#'+N);
	var id = parseInt(node.id);
	var dir = isChangable(id);
	if(dir>0){
		console.log("dir"+dir);
		swap(node,blank,time);
		updateMatrix(id);
		step++;
		$("#step").text("Step: "+step.toString());
	}		
}
function isChangable(number){
	var result = 0;
    if(row+1<size){
    	if(marix[row+1][col]==number)
    		result =down;
    }
    if(row-1>=0){
    	if(marix[row-1][col]==number)
    		result =up;
    }
    if(col+1<size){
    	if(marix[row][col+1] == number)
    		result =right;
    }
    if(col-1>=0){
    	if(marix[row][col-1]==number)
    		result =left;
    }
    return result;

}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function updateMatrix(number){
	 for(var i = 0;i<size;i++){
        for(var j = 0;j<size;j++){
        	if(marix[i][j]==number){
        		marix[row][col] = number;
        		row = i;
        		col = j;
        		marix[i][j] = N;
        		console.log("move to:"+number);
        		return;
        	}
        }
    }
}

function swap(a,b,time){
	var apos = $(a).position();
	var bpos = $(b).position();
	$(a).animate({
		left: bpos.left,
		top: bpos.top
	},time);
	$(b).animate({
		left:apos.left,
		top:apos.top
	},time)

   }

/**
 * Shuffle up the tiles in the beginning of the game
 * @return
 */
async function shuffleTiles(){
	$("#step").text("Step: "+0);
	$("#Analysis").hide();
	var up =N;
	var down = 1;
	var number = 0;
	lastdir = 0;
	//jquery 方法 回溯打乱 更新marix(数据)     
	while(number<maxSize){
		var random = parseInt(Math.random()*(up-down)+down);
		var dir = isChangable(random);
		//console.log("dir:"+dir+"ldir"+lastdir);
		if(dir>0&&IsNotWiggle(dir,lastdir)){
			var node = $("#"+random);
			var blank = $("#"+N);
			swap(node,blank,40);
			updateMatrix(random);
			number++;
			lastdir = dir;
			//console.log('marix:'+marix);
			await sleep(60);			
		}
	}
	//js方法
	/*var parent = document.getElementById("play_area");
	var divs = parent.childNodes;
	for(var i =0;i<divs.length;i++){
		var r= (i - i%size)/size;
		var c =i - r*size;
		console.log("id:"+divs[i].id);
		$(divs[i]).text(marix[r][c]);
		$(divs[i]).attr("id",marix[r][c].toString());
		$(divs[i]).css("background-color","#e7e7e7");
	}*/
}

function IsNotWiggle(dir,ldir){
	if((dir==1&&ldir==2)||(ldir==1&&dir==2)||(dir==3&&ldir==4)||(ldir==3&&dir==4))
		return false;
	return true;
}


function showHelp(){
	$("#help").fadeIn(1500);
}
function showData(){
	$("#panpart").fadeIn(1500);
	$("#score").fadeIn(1500);
	$("#step").fadeIn(1500);
}
function showTip(){
	$("#tip").fadeIn(1500);
}

function go(){
	var selectedSize = document.getElementById("GameSize");
	var selectedLevel = document.getElementById("GameLevel");
	var a = selectedSize.options[selectedSize.options.selectedIndex].value;
	var b = selectedLevel.options[selectedLevel.options.selectedIndex].value;
	console.log(a,b);
	setLevel(a,b);
}

//A* search
function AstarLoad(){
	//factorial array init
	factorial = new Array(N);
	factorial[0] = 1;
	for(var i=1;i <=N;i++){
		factorial[i] = factorial[i-1]*i;
	}

	//distance array init
	referance = new Array(N);
	for(var i=0;i<N;i++){
		referance[i] = parseInt(i/size+calculate(i)-1);
	}
	distance = new Array(N);
	for(var i=0;i<N;i++){
		distance[i] = new Array(N);
	}
	for(var i=0;i<N;i++){
		for(var j=0;j<N;j++){
			if(i==j)
				distance[i][j]=0;
			else if(i<j){
				distance[j][i] = referance[j-i];
				distance[i][j] = referance[j-i];
			}
		}
	}

	//visit array init
	visit = new Array();

	//direction init
	to = [[0,-1],[0,1],[-1,0],[1,0]];

	bestWay = new Stack();
}

function calculate(number){
	var result =0;
	if ((number+1)%size==0) {
		result = size;
	}
	else{
		result = (number+1)%size;
	}
	return result;
}

function node(){
	this.f = 0;
	this.g =0;
	this.h =0;
	this.x =0;
	this.y=0;
	this.map = new Array(size);
	for(var i=0;i<size;i++){
		this.map[i] = new Array(size)
	}
	this.last =null;
}

function Cantor(node){
	var current = new Array(N);
	var cantorSum =0;
	for(var i =0;i<size;i++){
		for(var j =0; j<size; j++){
			current[size*i+j] = node.map[i][j];
			var cantorNum = 0;
			for(var k = size*i+j;k>=0;k--){
				if(current[k]>current[size*i+j])
					cantorNum++;
			}
			cantorSum += factorial[size*i+j]*cantorNum;
		}
	}
	return cantorSum;
}

function get_h(node){
	var manhattan =0;
	for(var i=0; i<size;i++){
		for(var j=0;j<size;j++){
			if(node.map[i][j]==N)
				continue;
			var cur = node.map[i][j]-1;
			var pos = i*size+j;
			manhattan+=distance[cur][pos];
		}
	}
	return manhattan;
}

function AstarCore(){

	var queue = new Queue();
	start = new node();
	for(var i=0;i<size;i++){
		for(var j=0;j<size;j++){
			start.map[i][j]= marix[i][j];
		}
	}
	start.x = row;
	start.y = col;
	start.h = get_h(start);
	start.f = start.h;

	counter =0;
	visit[counter] = Cantor(start);
	if(Cantor(start)==0)
		return 0;
	queue.enqueue(start);
	while(!queue.isEmpty()){
		var top = queue.dequeue();
		var ctn = Cantor(top);
		visit[counter++] = ctn;
		if(counter>65000&&size>=4||counter>90000&&size<4){
			alert("out of range of A* search, it will be a long time");
			return 0;
		}
		
		for(var i =0; i<4; i++){
			var next = cloneDeep(top);
			next.x+=to[i][0];
			next.y +=to[i][1];
			if(next.x<0||next.y<0||next.y>=size||next.x>=size)
				continue;
			
			next.map[top.x][top.y] = top.map[next.x][next.y];
			next.map[next.x][next.y] = N;
			
			next.g+=1;
			next.h =get_h(next);
			next.f = next.g+next.h;
			var ctn_next = Cantor(next);
			next.last = top;
			
			if(ctn_next==0){
				
				var st = next.g;
				while(next.last!=null){
					bestWay.push(next);
					next = cloneDeep(next.last);
				}
				return st;
			}
			if(IsVisited(ctn_next))
				continue;
			queue.enqueue(next);
			//showData
			
		}
	}
	
}

function IsVisited(number){
	for(var i =0;i<visit.length;i++){
		if(visit[i]==number)
			return true;
	}
	return false;
}

async function showResult(){
	AstarLoad();
	var result = AstarCore();
	$("#Analysis").show();
	$("#CantorNum").text("steps of shortest way: "+result.toString())
	$("#VisitNum").text("Visited path: "+ visit.length.toString())
	while(!bestWay.isEmpty()){
		var n = bestWay.peek();
		bestWay.pop();
		var seed = marix[n.x][n.y];
		var node = $("#"+seed);
		var blank = $("#"+N);
		swap(node,blank,200);
		updateMatrix(seed);
		await sleep(400);

	}

}

function cloneDeep(obj){
	var newnode = new node();
	
	for(var i=0;i<size;i++){
		for(var j=0;j<size;j++){
			newnode.map[i][j]=  obj.map[i][j];
		}
	}
	newnode.x= obj.x;
	newnode.y = obj.y;
	newnode.g = obj.g;
	newnode.h = obj.h;
	newnode.f =obj.f;
	newnode.last = obj.last;
	return newnode;
}

 function Queue() {
        
        //初始化队列（使用数组实现）
        var items = [];

        //向队列（尾部）中插入元素
        this.enqueue = function(element) {
            items.push(element);
        }

        //从队列（头部）中弹出一个元素，并返回该元素
        this.dequeue = function() {
            return items.shift();
        }

        //查看队列最前面的元素（数组中索引为0的元素）
        this.front = function() {
            return items[0];
        }

        //查看队列是否为空，如果为空，返回true；否则返回false
        this.isEmpty = function() {
            return items.length == 0;
        }

        //查看队列的长度
        this.size = function() {
            return items.length;
        }

        //查看队列
        this.print = function() {
            //以字符串形势返回
            return items.toString();
        }
    }

function Stack() {

    var items = [];

    this.push = function(element){
        items.push(element);
    };

    this.pop = function(){
        return items.pop();
    };

    this.peek = function(){
        return items[items.length-1];
    };

    this.isEmpty = function(){
        return items.length == 0;
    };

    this.size = function(){
        return items.length;
    };

    this.clear = function(){
        items = [];
    };

    this.print = function(){
        console.log(items.toString());
    };

    this.toString = function(){
        return items.toString();
    };
}

/**
 * When the page loads, create our puzzle
 */

