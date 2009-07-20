H2O.Button = function(options) {
	var self = null;
	// H2O Button Options:
	// options.ID: id of the button
	// options.text: text of the button
	// options.href: where the button links to
	// options.click: set the onclick attribute for the link
	(function() {
		
		self = document.createElement('div');
        self.setAttribute('id', options.ID);
		self.innerHTML = options.text;
		
		a = document.createElement('a');
		a.setAttribute('href', options.href);
		a.setAttribute('onClick', options.click);
		a.setAttribute('style', '\
			border: none;\
		');
		
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
		    width = self.parentNode.offsetHeight;
		    height = self.parentNode.offsetHeight;
		} else {
		    width = self.parentNode.offsetWidth;
		    height = self.parentNode.offsetWidth;
		};
		
		/* Centering */
		self.style.width = width + "px";
		self.style.height = height + "px";
		self.style.marginLeft = (-1 * width) / 2 + "px";
		self.style.marginTop = (-1 * height) / 2 + "px";
	};
	
	return self;
};