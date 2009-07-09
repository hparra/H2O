
var xCoordinate = 25; // Time on graph
var input = 0; // Input on graph --> getSize()
var startPoint = 0;
var absZero = 0;
var yInterval = 25;
var ctx;
var maxSize;
var maxReading = 0;
var sizePercent = .7;
var minReading = 99999999; //Change to integer max value
var totalReading = 0;
var totalTime = 0; // Needs to be incremented
var onGraphY = 0;
var theName = "";
var sizeXPixel = 300;
var sizeYPixel = 300;
var lineColor = "#fff";
var graphCel = 100;
var colorBGBegin = "#330033";
var colorBGEnd = "#000033";
var lineargradient;
var buffer = []; // Array that keeps track of buffer
var resize = true;
var screenBuffer = []; // buffer that only has information about what is currently on the screen. Will be removed once clear() is called


/// This part deals with resizing/// 
if (resize) {
	$(document).ready(function(){
		$(window).resize(function(){
			var w = window.innerWidth;
			var h = window.innerHeight;
			sizeXPixel = Math.ceil(w * sizePercent);
			sizeYPixel = Math.ceil(h * sizePercent);
			var c = document.getElementById('canvas');
			c.height = sizeYPixel;
			c.width = sizeXPixel;
			xCoordinate = 25;
			paintBG();
			percentOnGraph = startPoint / graphCel;
			onGraphY = Math.ceil(sizeYPixel * percentOnGraph);
			onGraphY = sizeYPixel - onGraphY;
			ctx.strokeStyle = '#fff'; // white
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(startPoint, onGraphY);
			ctx.stroke();
			for (var i = 0; i < screenBuffer.length; ++i) {
				ctx.strokeStyle = '#fff'; // white
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(xCoordinate, onGraphY);
				xCoordinate += 15;
				percentOnGraph = screenBuffer[i] / graphCel;
				onGraphY = Math.ceil(sizeYPixel * percentOnGraph);
				onGraphY = sizeYPixel - onGraphY;
				ctx.lineTo(xCoordinate, onGraphY);
				ctx.stroke();
			}
		});
	});
}
//////////////////////////////////////

H2O.chart = function(){
  //This function will build a graph with all the default parameters and the parameters given.
  //Users will need to pass the name of the canvas, interval of the y axis, max y value, width, and height.
  theName = n;
  onGraphY = sizeYPixel;
  sizeXPixel = x;
  sizeYPixel = y;
  graphCel = g;
  ctx = document.getElementById(theName).getContext("2d");
  ctx.lineWidth = 3;
  paintBG();
  return setInterval(drawGraph, 1000);
};
function buildGraphQuick(n, theInterval, g, x, y){
  //This function will build a graph with all the default parameters and the parameters given.
  //Users will need to pass the name of the canvas, interval of the y axis, max y value, width, and height.
  theName = n;
  onGraphY = sizeYPixel;
  sizeXPixel = x;
  sizeYPixel = y;
  graphCel = g;
  yInterval = theInterval;
  ctx = document.getElementById(theName).getContext("2d");
  ctx.lineWidth = 3;
  paintBG();
  return setInterval(drawGraph, 100);
};
function buildCustomGraph(name){
	// Before calling this function make sure to set all the custom values wanted. values unset to have default values.
	//setSizeX;
	//setSizeY
	
};

function drawGraph() {  // Internal function.
  // This function draws the graph on to the canvas. Users will not needs to call this function.
  
  ++totalReading;
  if(input < minReading){
	minReading = input;
  }
  if(input > maxReading){
    maxReading = input;	
  }
  if(xCoordinate >= sizeXPixel-5){
   xCoordinate = 25; 
   clear();
  }
  ctx.strokeStyle = '#fff'; // white
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(xCoordinate, onGraphY);
  xCoordinate += 15; //space between each read is 10px
  input = getNumber(); // input read in here
  percentOnGraph = input/graphCel;
  onGraphY = Math.round(sizeYPixel * percentOnGraph);
  onGraphY = sizeYPixel - onGraphY;
  ctx.lineTo(xCoordinate,onGraphY);
  //ctx.arc(xCoordinate, onGraphY, 2, 0, Math.PI*2, true);
  ctx.stroke();   
};
function createHistoryGraph(){
	// This function creates graph History.
	
};
function getTotalReading(){
	// Returns total reading
	return totalReading;
};
function getMaxReading(){
	// Returns maximum reading
	return maxReading;
};
function getMinReading(){
	// Returns minimum reading
	return minReading;
};
function getTotalTime(){
	// Returns the total time running
	return totalTime;
};
function getNumber(){
	// Returns a number to be graphed
	var temp = Math.ceil(Math.random()*200);
	screenBuffer.push(temp);
	return temp;
};
function clear(){
	//This will clear the graph
	screenBuffer = [];
	startPoint = input;
	ctx.clearRect(0,0,sizeXPixel,sizeYPixel); 
	paintBG();// This line re-draws the background
};
function paintBG(){
	//This function will re-draw the background along with the lines
	  lineargradient = ctx.createLinearGradient(0,0,0,sizeYPixel);
  	lineargradient.addColorStop(0, colorBGBegin);
  	lineargradient.addColorStop(1,colorBGEnd);
  	ctx.fillStyle = lineargradient;
    ctx.fillRect(0,0,sizeXPixel,sizeYPixel); // This line re-draws the background
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#CCCCCC'; // white
    var i =0;
	var k=0;
    var numberOfLines = Math.round(sizeYPixel/yInterval)-1;	
    while(k <= sizeYPixel){
    	ctx.beginPath();
    	ctx.moveTo(0, i);
		ctx.fillStyle = "white";
		percent  = (Math.round(graphCel/numberOfLines)*k) / graphCel;
		percent= sizeYPixel * percent;
		percent = sizeYPixel - percent;
  		ctx.fillText( Math.round(graphCel/numberOfLines)*k , 1, percent);
		
		  //percentOnGraph = input/graphCel;
  		 // onGraphY = Math.ceil(sizeYPixel * percentOnGraph);
         // onGraphY = sizeYPixel - onGraphY;
			
		k++;
		ctx.fillStyle = lineargradient;  
    	ctx.lineTo(sizeXPixel,i);	
    	ctx.stroke();
    	i += yInterval;
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff'; // white
};



////*******Start of the set functions********////////

function setResize(r, p){
	// If true the graph will resize according to window
	// else the graph will remain static
	resize = r;
};
function setNameX(str){
	// Sets the name of the x axis
	xAxis = str;
};
function setNameY(str){
	// Sets the name of the y axis
	yAxis = str;
};
function setSizeX(num){
	// Sets the width in pixels
  sizePixelX = num;
};
function setSizeY(num){
	// Sets the height in pixels
	sizePixelY = num;
};
function getSize(){
	// Gets the max size of the graph (height)
	return maxSize;
};
function setLineColor(str){
	// Lets the color of the line. Parameter can be a hex corresponding to a color or a string indicating
	// the color name.
	lineColor = str;
};
function setBackground(beginGrad, endGrad){
	// Sets the background color with a gradient effect. If want solid color pass the same color in both parameters
	colorBGBegin = beginGrad;
	colorBGEnd = endGrad;
};
function setAbsZero(num){
	// Sets where the zero is going to be set in the graph
	absZero = num;
};
function setXInterval(num){
	// Sets the interval in the x axis
};
function setYInterval(num){
	// Sets the interval in the y axis
};
