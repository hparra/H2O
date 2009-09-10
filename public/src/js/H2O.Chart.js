/** 
* @projectDescription 	H2O.Chart is a part of the H2O Library developed in part of the telios project.
* @author	Jakkree Janchoi jjanchoi@uci.edu
* @version	1.1 
*/


// HGP: My comments...
// JJ: Jakkree's comments

/**
* Create a new instance of H2O.Chart.
* Example: myChart = H2O.Chart({id: "idName" , resize: true, ....});
* To call function USE myChart.clear(); DO NOT USE myChart.self.clear();
* All parameters passed to the contructor are optional. Except for id, id is required to be defined.
* @classDescription	This class creates a Chart.
* @param {boolean} [scale_graph] Enable or disable scaling feature. Default set to enable.
* @param {boolean} [dotPlot] Enable or disable the rounded dot at each plot point. Default set to disable.
* @param {boolean} [show_line_number] Enable or disable the display of line numbers. Default is set to enable.
* @param {String} id sets the id of the Chart canvas. **REQUIRED OPTION**
* @param {HEX} [bgGradientStart] sets the beginning color of the background gradient. Default set to #330033.
* @param {HEX} [bgGradientEnd] sets the ending color of the background gradient. Default set to #000033.
* @return {canvas}	Returns a new Chart.
* @constructor	
*/
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
	var deltaX = 15;
	var sizePercent = 1;//option**
	var minReading = 99999999; //Change to integer max value
	var totalReading = 0;
	var currentReading = 0;
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
	var buffer = []; // Array that keeps all the data read in. 
	var resize = true;
	var dotPlot = false;
	var deltaXPercent = 5; // 5% of total size in X axis
	var showLineNumber = false;
	var expandX = false;
	var screenBuffer = []; // buffer that only has information about what is currently on the screen. Will be removed once clear() is called

    /////********************** I IS PRIVATE FUNCTION ******************////////



(function() {

		// Passing an ID is required for this object build properly.

		// HGP: No.
		//self = document.createElement('div');
		//self.setAttribute('id', options.id);

		self = document.createElement('canvas');
		self.setAttribute('id', options.id);  // TODO: Error check or autogen
		self.setAttribute('class', 'H2O_Chart');

		theName = options.id; // HGP: Redundant now. Use self.id
	
		if (!(options.scale_percent != undefined)) {
			sizePercent = options.scale_percent / 100;
		}
		if(options.expandX){
			// if expandX is true, the graph is allocate more space to plot points
			// else it will stretch the plotted points to fit the graph
			expandX = options.expandX;
		}
		if(options.deltaX){
			deltaXPercent = option.deltaX;
		}
		if(options.addDot){
			dotPlot = options.addDot; 	
		}
		if( !(options.scale_graph === undefined)){
			resize = options.scale_graph;
		}
		if(options.show_line_number){
			showLineNumber = options.show_line_number;
		}
		if( !(options.bgGradientStart === undefined) ){
			colorBGBegin = options.bgGradientStart;
		}
		if( !(options.bgGradientEnd === undefined) ){
			colorBGEnd = options.bgGradientEnd;
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
		++totalReading;
		if (input < minReading) {
			minReading = input;
		}
		if (input > maxReading) {
			maxReading = input;
		}
		if ((((xCoordinate)+(sizeXPixel * (deltaXPercent / 100))) >= sizeXPixel - 25) || (xCoordinate >= sizeXPixel - 25)) {
			xCoordinate = 25;
			startPoint = currentReading;
			self.clear();
		}
		else {
			currentReading = input;
			ctx.strokeStyle = '#fff'; // white
			ctx.lineCap = 'round';
			ctx.beginPath();
			ctx.moveTo(xCoordinate, onGraphY);
			if (expandX) {
				xCoordinate += deltaX; //space between each read is 10px
			}else {
				// TODO: calc percentage of X
				xCoordinate += sizeXPixel * (deltaXPercent / 100);
			}
			// HGP: See comment above. This should be passed in.
			// Painting and passing this data asynchronously is the tricky part!
			// We need to differentiate between a chart that is always painting
			// and one that paints only when it receives data.
			
			percentOnGraph = input / graphCel;
			onGraphY = Math.round(sizeYPixel * percentOnGraph);
			onGraphY = sizeYPixel - onGraphY;
			ctx.lineTo(xCoordinate, onGraphY);
			if (dotPlot === true) {
				ctx.arc(xCoordinate, onGraphY, 2, 0, Math.PI * 2, true);
			}
			ctx.stroke();
		}
		
	};

/**
 *  This function takes in plot points that will be drawn on to the Chart. 
 *  Example: myChart.feedData(100);
 * 	@method feedData
	@param {int} input data will be drawn on the chart.
*/
	self.feedData = function( newInput ){
		try {
			if (isFinite(newInput)) {
				screenBuffer.push(newInput);
				drawGraph(newInput);
			}else{
				throw "Err1"
			}
		}catch(err){
			if(err =="Err1"){
				alert("Invalid number passed to H2O.Chart");
			}
		}
	};

	paintBG = function(){
		//This function will re-draw the background along with the lines
		lineargradient = ctx.createLinearGradient(0, 0, 0, sizeYPixel);
		lineargradient.addColorStop(0, colorBGBegin);
		lineargradient.addColorStop(1, colorBGEnd);
		ctx.fillStyle = lineargradient;
		ctx.fillRect(0, 0, sizeXPixel, sizeYPixel); // This line re-draws the background
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#CCCCCC'; // white
		var i = sizeYPixel;
		var k = 0;
		//numberOfLines represents the amount of number shown on the side
		var numberOfLines = Math.round(sizeYPixel / yInterval) - 1;
		while (k <= sizeYPixel) {
			ctx.beginPath();
			ctx.moveTo(0, i);
			ctx.fillStyle = "white";
			percent = (Math.round(graphCel / numberOfLines) * k) / graphCel;
			percent = sizeYPixel * percent;
			percent = sizeYPixel - percent;
			//Now checks if ctx.fillText is supported before actually using it.
			if (showLineNumber && (ctx.fillText)){
				ctx.fillText(Math.round(graphCel / numberOfLines) * k, 1, percent);
			}
			k++;
			ctx.fillStyle = lineargradient;
			ctx.lineTo(sizeXPixel, i);
			ctx.stroke();
			i -= yInterval;
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
			ctx.moveTo(xCoordinate, onGraphY);
			ctx.stroke();		
			
			for (var i = 0; i < screenBuffer.length; ++i) {
				ctx.strokeStyle = '#fff'; // white
				ctx.lineCap = 'round';
				ctx.beginPath();
				ctx.moveTo(xCoordinate, onGraphY);
				if (expandX) {
					xCoordinate += deltaX; //space between each read is 10px
				}else{
					xCoordinate += sizeXPixel * (deltaXPercent / 100);
				}
				percentOnGraph = screenBuffer[i] / graphCel;
				onGraphY = Math.ceil(sizeYPixel * percentOnGraph);
				onGraphY = sizeYPixel - onGraphY;
				ctx.lineTo(xCoordinate, onGraphY);
				ctx.stroke();
			}
		}
	};
	

/**
 *  getMaxReading returns the max value that has been feed into the Chart
	@method getMaxReading
	@return {int} returns the max reading
*/
	self.getMaxReading = function(){return maxReading;};
	
/**
 *  getMinReading returns the min value that has been feed into the Chart
	@method getMinReading
	@return {int} returns the min reading
*/
	self.getMinReading = function(){return minReading;};
	
	// HGP: In ms? This can't be trusted due to one-threaded nature of JS
	// JJ: Perhapse using time stamp based on client current time?
	// Returns the total time since first reading
	self.getTotalTime = function(){return totalTime;};
	
/**
 *  getTotalReading returns the number of inputs fed into the Chart
	@method getTotolReading
	@return {int} returns the total readings
*/
	self.getTotalReading = function(){return totalReading;};
	

/**
 *  getCurrentReading returns the current input value
	@method getCurrentReading
	@return {int} returns the current input value
*/
	self.getCurrentReading = function(){return currentReading;};
	
/**
 *  Clears the graph of any plotted data and automatically redraws the background
	@method clear
*/
	self.clear = function(){
		screenBuffer = [];
		ctx.clearRect(0, 0, sizeXPixel, sizeYPixel);
		paintBG();// This line re-draws the background
	};
	/// End of graph clearing ///

	return self;
}; // HGP: Great work!


