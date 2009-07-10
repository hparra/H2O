// H2O.Chart.js
// Written by Jakkree Janchoi
// UC Irvine
// 2009-07-02 YMD


H2O.Chart = function(options){
	var self = null;
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
	var sizeXPixel = 700;
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
	(function() {  //constructor
	
	self = document.createElement('canvas');
	self.setAttribute('id', options.id);
	theName = options.id;
	sizeXPixel = options.sizeX;
	sizeYPixel = options.sizeY;
	onGraphY = sizeYPixel;
	graphCel = options.graphCeil;
	yInterval = options.intervalY;
	ctx = document.getElementById(theName).getContext("2d");
	ctx.lineWidth = 3;
	self.paintBG();	
	self.drawGraph();
		
	self.addEventListener("DOMNodeInserted", function(e) {
		console.log(self.parentNode);
		if ((self.parentNode.id) === undefined) {
			// the hell? it fires twice and the first time is no good.
			// it's a DocumentFragment, from I don't know where
		} else {
			e.stopPropagation(); // cancel bubble
			self.resize();
			window.addEventListener("resize", self.resize, false);
		}
	}, false);
	
	})(); // End of constructor
	

	self.drawGraph = function(){
		// This function draws the graph on to the canvas. Users will not needs to call this function.
		++totalReading;
		if (input < minReading) {
			minReading = input;
		}
		if (input > maxReading) {
			maxReading = input;
		}
		if (xCoordinate >= sizeXPixel - 5) {
			xCoordinate = 25;
			self.clear();
		}
		ctx.strokeStyle = '#fff'; // white
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(xCoordinate, onGraphY);
		xCoordinate += 15; //space between each read is 10px
		input = getNumber(); // input read in here
		percentOnGraph = input / graphCel;
		onGraphY = Math.round(sizeYPixel * percentOnGraph);
		onGraphY = sizeYPixel - onGraphY;
		ctx.lineTo(xCoordinate, onGraphY);
		//ctx.arc(xCoordinate, onGraphY, 2, 0, Math.PI*2, true);
		ctx.stroke();
	};
	/// End of drawgraph ///
	
	
	/// This clears the graph ///
	self.clear = function(){
		screenBuffer = [];
		startPoint = input;
		ctx.clearRect(0, 0, sizeXPixel, sizeYPixel);
		self.paintBG();// This line re-draws the background

	};
	/// End of graph clearing ///
	
	//// repaints the background ////
	self.paintBG = function(){
		//This function will re-draw the background along with the lines
		lineargradient = ctx.createLinearGradient(0, 0, 0, sizeYPixel);
		lineargradient.addColorStop(0, colorBGBegin);
		lineargradient.addColorStop(1, colorBGEnd);
		ctx.fillStyle = lineargradient;
		ctx.fillRect(0, 0, sizeXPixel, sizeYPixel); // This line re-draws the background
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#CCCCCC'; // white
		var i = 0;
		var k = 0;
		var numberOfLines = Math.round(sizeYPixel / yInterval) - 1;
		while (k <= sizeYPixel) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.fillStyle = "white";
			percent = (Math.round(graphCel / numberOfLines) * k) / graphCel;
			percent = sizeYPixel * percent;
			percent = sizeYPixel - percent;
			ctx.fillText(Math.round(graphCel / numberOfLines) * k, 1, percent);
			k++;
			ctx.fillStyle = lineargradient;
			ctx.lineTo(sizeXPixel, i);
			ctx.stroke();
			i += yInterval;
		}
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#fff'; // white
	};
	//// End of repaintBG ///
	
	//Resize function//
	self.resize = function(){
		var w = window.innerWidth;
		var h = window.innerHeight;
		sizeXPixel = Math.ceil(w * sizePercent);
		sizeYPixel = Math.ceil(h * sizePercent);
		var c = document.getElementById('canvas');
		c.height = sizeYPixel;
		c.width = sizeXPixel;
		xCoordinate = 25;
		self.paintBG();
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
	};
	/////End of resize///////
	return self;
};
