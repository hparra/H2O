// H2O.Chart.js
// Written by Jakkree Janchoi
// UC Irvine
// 2009-07-02 YMD


H2O.Chart = function(options){
	var self = null;
	var xCoordinate = 25; // Time on graph
	var input = 0; // Input on graph --> getSize()
	var startPoint = 0; //option**
	var absZero = 0;//option**
	var yInterval = 25;//option**
	var ctx;
	var maxSize;
	var maxReading = 0;
	var sizePercent = .7;//option**
	var minReading = 99999999; //Change to integer max value
	var totalReading = 0;
	var totalTime = 0; // Needs to be incremented
	var onGraphY = 0;
	var theName = ""; //option** REQUIRED TO BE INITALIZED BY USER/DEV (pass name reference)
	var sizeXPixel = 700; //option**
	var sizeYPixel = 300; //option**
	var lineColor = "#fff";
	var graphCel = 100; //option**
	var colorBGBegin = "#330033"; //option**
	var colorBGEnd = "#000033"; //option**
	var lineargradient;
	var buffer = []; // Array that keeps track of buffer
	var resize = true;
	var dotPlot = false;
	var screenBuffer = []; // buffer that only has information about what is currently on the screen. Will be removed once clear() is called

    /////********************** I IS PRIVATE FUNCTION ******************////////
	

	paintBG = function(){
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
	
	
	getNumber = function(){
		// Returns a number to be graphed
		var temp = Math.ceil(Math.random()*100);
		screenBuffer.push(temp);
		return temp;
	};
	start = function(){
	  return setInterval(drawGraph, 100);
	};

	drawGraph = function(){
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
		if(dotPlot === true){
			ctx.arc(xCoordinate, onGraphY, 2, 0, Math.PI*2, true);
		}
		ctx.stroke();
	};
	/// End of drawgraph ///


	(function() {  //constructor

	// Passing an ID is required for this object build properly.
	self = document.createElement('div');
	self.setAttribute('id', options.id);
	theName = options.id;
	if (typeof options.sizeX != undefined) {
		sizeXPixel = options.sizeX;
	}
	if (typeof options.sizeY != undefined) {
		sizeYPixel = options.sizeY;
	}
	if (typeof options.scale_percent != undefined) {
		sizePercent = options.scale_percent / 100;
	}
	if( typeof options.dotPlot != undefined){
		dotPlot = options.addDot; 	
	}
	if( typeof options.scale_graph != undefined){
		resize = options.scale_graph;
	}
	onGraphY = sizeYPixel;
	graphCel = options.graphCeil;
	yInterval = options.intervalY;
	ctx = document.getElementById(theName).getContext("2d"); // initialize ctx here
	ctx.lineWidth = 3;
	paintBG();	
	start();
	
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
	//end resize
	
	})(); // End of constructor
	
	/////********************** END OF PRIVATE FUNCTION ******************////////

		
	
		//resize
		self.resize = function(){
		if (resize) {
			var w = window.innerWidth;
			var h = window.innerHeight;
			sizeXPixel = Math.ceil(w * sizePercent);
			sizeYPixel = Math.ceil(h * sizePercent);
			var c = document.getElementById(theName);
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
		}
	};
	
	// Returns the max reading
	self.getMaxReading = function(){return maxReading;};
	
	// Returns the min reading
	self.getMinReading = function(){return minReading;};
	
	// Returns the total time since first reading
	self.getTotalTime = function(){return totalTime;};
	
	// Returns the total inputs read
	self.getTotalReads = function(){return totalReading;};
	
	/// This clears the graph ///
	self.clear = function(){
		screenBuffer = [];
		startPoint = input;
		ctx.clearRect(0, 0, sizeXPixel, sizeYPixel);
		paintBG();// This line re-draws the background
	};
	/// End of graph clearing ///

	return self;
};
