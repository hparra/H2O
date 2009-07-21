H2O.Input = function(options) {
	var self = null;
	
	(function() {
		
        self = document.createElement('form');
        self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			width: 100%;\
			height: 100%;\
		');
		
		input = document.createElement('input');
		input.setAttribute('type', 'input');
		input.setAttribute('name', options.name);
		input.setAttribute('style', '\
			position: relative;\
			font-family: arial;\
			width: 100%;\
			height: 100%;\
		');
		
		self.appendChild(input);
		
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
		self.style.marginLeft = (-1 * width) / 2 + "px";
		self.style.marginTop = (-1 * height) / 2 + "px";
	};
	
	return self;
};