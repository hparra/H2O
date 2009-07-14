H2O.Image = function(options) {
	var self = null;
	
	(function() {
		/* frame */
        self = document.createElement('div');
        self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			position: relative;\
			top: 50%;\
			left: 50%;\
		');

        /* image */
        img = document.createElement('img');
        img.setAttribute('alt', options.altText);
		img.setAttribute('src', options.src);
		img.setAttribute('style', '\
			position: static;\
			border: none;\
			width: 100%;\
			height: 100%;\
		');			
		
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
		self.style.marginLeft = -width / 2 + "px";
		self.style.marginTop = -height / 2 + "px";
	};
	
	return self;
};