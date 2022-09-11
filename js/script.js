var chessBoard = [];
var me = true;
var over = false;
//赢法数组
var wins = [];

var myWin = [];
var computerWin = [];


// 初始化棋盘
for(var i=0; i<15; i++){
	chessBoard[i] = [];
	for(var j=0; j<15; j++){
		chessBoard[i][j] = 0;
	}
}

// 初始化赢法
for(var i=0; i<15; i++){
	wins[i] = [];
	for(var j=0; j<15; j++){
		wins[i][j] = [];
	}
}

// 赢法的数量
var count = 0;

//横线 x,y,属于的赢法index
for(var i = 0; i < 15; i++){
	for(var j= 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//竖线
for(var i = 0; i < 15; i++){
	for(var j= 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
//斜线
for(var i = 0; i < 11; i++){
	for(var j= 0; j < 11; j++){
		for(var k = 0; k < 5; k++){
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
//反斜线
for(var i = 0; i < 11; i++){
	for(var j= 14; j > 3; j--){
		for(var k = 0; k < 5; k++){
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}


for(var i = 0; i < count; i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}

var chess = document.getElementById('chess'); // 棋盘
var context = chess.getContext('2d');		  // 二维 

context.strokeStyle = "#000";				  // 黑线
var logo = new Image();						  // 背景	
logo.src = "image/bg.png";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);  // 背景		
	drawChessBoard();						  // 棋盘	
}

var drawChessBoard = function(){
	for(var i=0; i<15; i++){
		context.moveTo(15 + i*30, 15);  // 竖线起点
		context.lineTo(15 + i*30, 435); // 竖线终点
		context.stroke();				// 竖线起点到终点划线	
		context.moveTo(15,15 + i*30);	
		context.lineTo(435,15 + i*30);
		context.stroke();
	}
}


var oneStep = function(i, j, me){
	context.beginPath(); // 原点
	context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI); // 画圆：x, y, r, 起始位置, 结束位置 
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0); // 颜色渐变
	if(me){
		gradient.addColorStop(0, "#0A0A0A"); // 渐变方式
		gradient.addColorStop(1, "#636766");
	}
	else{
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}	
	context.fillStyle = gradient;  // 填充方式
	context.fill();				   // 填充

}

chess.onclick = function(e){ // 点击
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;  // 点击x
	var y = e.offsetY;  // 点击y
	var i = Math.floor(x / 30); //Math.floor向下取整
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0){ // 未被占领
		oneStep(i, j, me);	   // 人走	
		chessBoard[i][j] = 1;  // 占领位置 人：1 机：2
		
		for(var k = 0; k < count; k++){
			if(wins[i][j][k]){ // 命中赢法
				myWin[k]++;	   // 该赢法+1 当该赢法累计5时候说明已完全匹配该赢法取得胜利	
				computerWin[k] = 6; // AI要堵截该赢法
				if(myWin[k] == 5){
					window.alert("you win!")
					over = true;
				}
			}
		}
		if(!over){
			me = !me; // 换手
			computerAI(); // 电脑走
		}
	}
	
}

var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0, v = 0;
	// 分数初始化
	for(var i = 0; i < 15; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	// 
	for(var i = 0; i < 15; i++){
		for(var j = 0; j < 15; j++){
			if(chessBoard[i][j] == 0){ // 可走
				for(var k = 0; k < count; k++){
					if(wins[i][j][k]){ // 当前位置有赢法
						if(myWin[k] == 1){ // 该赢法占的位置越多 分数越高
							myScore[i][j] += 200;
						}
						else if(myWin[k] == 2){
							myScore[i][j] += 400;
						}
						else if(myWin[k] == 3){
							myScore[i][j] += 2000;
						}
						else if(myWin[k] == 4){
							myScore[i][j] += 10000;
						}

						if(computerWin[k] == 1){
							computerScore[i][j] += 220;
						}
						else if(computerWin[k] == 2){
							computerScore[i][j] += 420;
						}
						else if(computerWin[k] == 3){
							computerScore[i][j] += 2100;
						}
						else if(computerWin[k] == 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				// 人的分数高 堵截分数最高的位置
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;					
				}
				// 人机分数相等 机器找最大分数位置
				else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;						
					}
				}
				// 机器分数高于人的最高分 选择走机器分数最高的位置
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;					
				}
				// 机器分数等于人的最高分 选择走拦截人的分数最高的位置
				else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;						
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;

	for(var k = 0; k < count; k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5){
				window.alert("computer win!")
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
}