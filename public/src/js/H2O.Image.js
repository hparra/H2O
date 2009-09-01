/**
* @param options 
* options.ID: ID of the image
* options.altText: alt text
* options.src: src address
*/
H2O.Image = function(options) {
	/** @private H2O.Image Object */
	var self = document.createElement('img');
		
	if (options.id === undefined)
		options.id = H2O.CreateRandomID();
	if (options.alt === undefined)
		options.alt = "";
	if (options.src === undefined)
		options.src = "";

	self.setAttribute('id', options.id);
    self.setAttribute('alt', options.alt);
	self.setAttribute('style', '\
		position: relative;\
		border: none;\
		padding: none;\
		margin: none;\
	');

	debug = function(s) {
		return "H2O.Image('" + options.id + "'): " + s;
	}

	self.addEventListener("load", function() {
		console.debug(debug("Loaded " + self.width + " x " + self.height));
		self.originalWidth = self.width;
		self.originalHeight = self.height;
		self.originalRatio = self.width / self.height;
	}, false);
	
	self.addEventListener("DOMNodeInserted", function(e) { // NOTE: Not supported in IE
		//console.log(self.parentNode);
		// the hell? it fires twice and the first time isb no good.
		// it's a DocumentFragment, from I don't know where
		if ((self.parentNode.id) !== undefined) {
			e.stopPropagation(); // cancel bubble
			
			console.debug("H2O.Image(" + self.width + ", " + self.height + ") inserted.");
			
			self.resize();
			window.addEventListener("resize", self.resize, false);
		}
	}, false);


	/**x
	* Loads picture by setting 'src' parameter
	*/
	self.load = function() {
		if (options.src)
			self.setAttribute('src', options.src);
		else
			console.debug("");
	},
	
	/**
	* @function
	* resizes the image on window resize event
	*/
	self.resize = function() {
		console.debug("Original (W, H, R): " + self.originalWidth + ", " + self.originalHeight + ", " + self.originalRatio);
		console.debug("RESIZE: image(" + self.width + ", " + self.height + ") "
			+ "offset(" + self.parentNode.offsetWidth + ", " + self.parentNode.offsetHeight + ")");
		

		containerWidth = self.parentNode.offsetWidth;
		containerHeight = self.parentNode.offsetHeight;
		containerRatio = containerWidth / containerHeight;
		
		width = 0;
		height = 0;
		
		if (self.originalRatio > containerRatio) {
			width = containerWidth;
			height = containerWidth / self.originalRatio;
		}
		else {
			width = containerHeight * self.originalRatio;
			height = containerHeight;
		}
		
		width = width - (2 * options.padding);
		height = height - (2 * options.padding);

		self.style.width = width + "px";
		self.style.height = height + "px";
		
		// TODO: "Placement" code
		/*
		self.style.top = "100%";
		self.style.marginTop = -height + "px";
		
		self.style.top = "50%";
		self.style.left = "50%";
		self.style.marginLeft = (-1 * width) / 2 + "px";
		self.style.marginTop = (-1 * height) / 2 + "px";
		*/
	};
	
	return self;
};

