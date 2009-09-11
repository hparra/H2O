
H2O.Grid = function(options) {
	/** @private H2O.Carousel Object */
	var self = null;

	/**
	* Power constructor for H2O.Carousel
	* @constructor
	*/
	(function() { // constructor
		
		self = document.createElement('div');
		self.setAttribute('id', options.id);
		self.setAttribute('style','\
			width: 100%;\
			height: 100%;\
			overflow: hidden;\
		');	
	
		for (i = 0; i < (options.columns * options.rows); i = i + 1) {
			box = document.createElement('div');
	        box.setAttribute('class', self.id + '_box');
			box.setAttribute('id', 'box' + i);
			box.setAttribute('style','\
				position: static;\
				clear: none;\
				float: left;\
				overflow: hidden;\
				display: block;\
			');
			self.appendChild(box);
		}
		
		self.addEventListener("DOMNodeInserted", function(e) {
			if (self.parentNode.id !== undefined) {
				// console.debug("DOMNodeInserted: " + self.id);
				e.stopPropagation(); // cancel bubble
				window.addEventListener("resize", self.resize, false);
				self.resize();
			}
		}, false);
	})();
	
	/**
	* resizes the image on window resize event
	* @function
	*/
	self.resize = function() {
		box_width_ratio = 1 / options.columns; // Width / # of Columns = Box Width
		box_height_ratio = 1 / options.rows; // Height / # of Rows = Box Height

        boxWidth = self.parentNode.offsetWidth * box_width_ratio;
        boxHeight = self.parentNode.offsetHeight * box_height_ratio;

		// ONLY GRAB SELF's child 'box'
		boxList = document.getElementsByClassName(self.id + '_box');

		for (b = 0; b < boxList.length; b = b + 1) {
			boxList[b].style.width = boxWidth + "px";
			boxList[b].style.height = boxHeight + "px";
		}
	};
	
	self.insert = function(object, number) {
		document.getElementById('box' + number).appendChild(object);
	}
		
	return self;
};