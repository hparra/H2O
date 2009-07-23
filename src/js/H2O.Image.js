/**
* @param options 
* options.ID: ID of the image
* options.altText: alt text
* options.src: src address
*/
H2O.Image = function(options) {
	/** @private H2O.Image Object */
	var self = null;
	
	/**
	* Power constructor for H2O.Image
	* @constructor
	*/
	(function() {
		
		if (options.ID === undefined) {
			options.ID = '';
		}
		if (options.altText === undefined) {
			options.ID = '';
		}
		if (options.src === undefined) {
			options.ID = ''; // FIXME: Make this default missing src image
		}
		
        self = document.createElement('div');
        self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			position: relative;\
			top: 50%;\
			left: 50%;\
		');

        img = document.createElement('img');
        img.setAttribute('alt', options.altText);
		img.setAttribute('src', options.src);	
		
        self.appendChild(img);

		self.addEventListener("DOMNodeInserted", function(e) { // NOTE: Not supported in IE
			//console.log(self.parentNode);
			// the hell? it fires twice and the first time is no good.
			// it's a DocumentFragment, from I don't know where
			if ((self.parentNode.id) !== undefined) {
				e.stopPropagation(); // cancel bubble
				self.resize();
				window.addEventListener("resize", self.resize, false);
			}
		}, false);
	})();
		
	/**
	* @function
	* resizes the image on window resize event
	*/
	self.resize = function() {
		width = 0;
		height = 0;
		if (self.parentNode.offsetWidth >= self.parentNode.offsetHeight) {
		    /* Landscape */
		    width = self.parentNode.offsetHeight;
		    height = self.parentNode.offsetHeight;
		} else {
		    /* Portrait */
		    width = self.parentNode.offsetWidth;
		    height = self.parentNode.offsetWidth;
		};
		
		width = width - (2 * options.padding);
		height = height - (2 * options.padding);
		
		/* Centering */
		self.style.width = width + "px";
		self.style.height = height + "px";
		self.style.marginLeft = (-1 * width) / 2 + "px";
		self.style.marginTop = (-1 * height) / 2 + "px";
		
		
		if (img.width > img.height) { /* Horizontal Rectangular Image */
			img.setAttribute('style', '\
				position: relative;\
				border: none;\
				width: 100%;\
				top: 50%;\
			');
			img.style.marginTop = (-1 * img.height) / 2 + "px";
		} else { /* Vertical Rectangular or Square Image */
			img.setAttribute('style', '\
				position: relative;\
				border: none;\
				left: 50%;\
				height: 100%;\
			');
			img.style.marginLeft = (-1 * img.width) / 2 + "px";
		}
	};
	
	return self;
};