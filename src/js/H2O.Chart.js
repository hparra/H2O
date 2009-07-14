// H2O.Chart.js
// Written by Jakkree Janchoi
// UC Irvine
// WENDI, teliOS project
// 2009-07-02 YMD

// HGP: My comments...
// JJ: Jakkree's comments

H2O.Chart = function(options){
	var self = null;
	var xCoordinate = 25; // Time on graph
	var input = 0; // Input on graph --> getSize()
	var startPoint = 0; //option**
	var absZero = 0;//option**
	var yInterval = 25;//option**
	var ctx; // HGP: Not necessary.
	var maxSize;
	var maxReading = 0;
	var sizePercent = .7;//option**
	var minReading = 99999999; //Change to integer max value
	var totalReading = 0;

	// HGP: What is this? 
	// JJ: Total time since the graph started
	var totalTime = 0; // Needs to be incremented

	var onGraphY = 0;
	
	// HGP: Not anymore. IDs should be randomly generated if one isn't specified
	var theName = ""; //option** REQUIRED TO BE INITALIZED BY USER/DEV (pass name reference)

	// HGP: No.
	var sizeXPixel = 100; //option**
	var sizeYPixel = 100; //option**

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
	
	
	// HGP: This should be in your demo HTML. See related comment in drawGraph()
	getNumber = function(){
		// Returns a number to be graphed
		var temp = Math.ceil(Math.random()*100);
		return temp;
	};


	(function() {  //constructor

		// Passing an ID is required for this object build properly.

		// HGP: No.
		//self = document.createElement('div');
		//self.setAttribute('id', options.id);

		self = document.createElement('canvas');
		self.setAttribute('id', options.id);  // TODO: Error check or autogen
		self.setAttribute('class', 'H2O_Chart');

		theName = options.id; // HGP: Redundant now. Use self.id
		
	
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

		// HGP: Again...
		//ctx = document.getElementById(theName).getContext("2d"); // initialize ctx here
		ctx = self.getContext("2d");

		// HGP: Aha! This should scale too! The formula is up to you.
		ctx.lineWidth = 3;

		// HGP: Redundant. Called from resize().
		//paintBG();	
	
		self.addEventListener("DOMNodeInserted", function(e) {
			//console.log(self.parentNode);
			if ((self.parentNode.id) === undefined) {
				// the hell? it fires twice and the first time is no good.
				// it's a DocumentFragment, from I don't know where
			} else {
				e.stopPropagation(); // cancel bubble
				resize();
				window.addEventListener("resize", resize, false);
				// HGP: We start it once it's in the document
				// we may even wait for the user/ui to start it
			}
		}, false);
	
	})(); // End of constructor
	
	// HGP: Not anymore. My bad
	/////********************** END OF PRIVATE FUNCTION ******************////////

	// HGP: Not true. Part or all of this should be a public function
	// We want to call draw from the outside, e.g. my_chart.draw(1337);
	drawGraph = function(input){
		// This function draws the graph on to the canvas. Users will not needs to call this function.
		screenBuffer.push(input);
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

		// HGP: See comment above. This should be passed in.
		// Painting and passing this data asynchronously is the tricky part!
		// We need to differentiate between a chart that is always painting
		// and one that paints only when it receives data.

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
	
	// Data is feed into here//
	self.feedData = function( newInput ){
		drawGraph(newInput);
	};
	//*****************//
	
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
			// HGP: This is too new. An option perhaps?
			//ctx.fillText(Math.round(graphCel / numberOfLines) * k, 1, percent);

			k++;
			ctx.fillStyle = lineargradient;
			ctx.lineTo(sizeXPixel, i);
			ctx.stroke();
			i += yInterval;
		}
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#fff'; // white
	};


	// HGP: we may actually want this to be public
	start = function() {
		return setInterval(drawGraph, 100);
	};	
	
	
	// HGP: we should have a self.stop too
	
	// HGP: Closure DOES allow resize to be a private function
	// even though we are telling window to call it
	// I don't know why it wasn't working before!
	resize = function(){
		if (resize) {
			var w = self.parentNode.offsetWidth;
			var h = self.parentNode.offsetHeight;
			sizeXPixel = Math.ceil(w);
			sizeYPixel = Math.ceil(h);
			self.height = sizeYPixel;
			self.width = sizeXPixel;

			// HGP: Those six lines above can be two

			xCoordinate = 25;
			paintBG(); // HGP: Good.
			
			// HGP: We may want to abstact this out
			percentOnGraph = startPoint / graphCel;
			onGraphY = Math.ceil(sizeYPixel * percentOnGraph);
			onGraphY = sizeYPixel - onGraphY; // Reverses the axis. Since graphic coordinates != cartisian coordinates (Direction-wise)
			ctx.strokeStyle = '#fff';
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
	
	// HGP: In ms? This can't be trusted due to one-threaded nature of JS
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
}; // HGP: Great work!


