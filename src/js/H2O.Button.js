H2O.Button = function(options) {
	var self = null;
	// H2O Button Options:
	// options.ID: id of the button
	// options.type: type of the button
	// options.text: text of the button
	// options.href: where the button links to
	// options.click: set the onclick attribute for the link
	(function() {
		
		self = document.createElement('div');
        self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			position: relative;\
			top: 50%;\
			left: 50%;\
		');
		//self.innerHTML = options.text;
		
		a = document.createElement('a');
		a.setAttribute('href', options.href);
		//a.setAttribute('onClick', options.click);
		a.setAttribute('style', '\
			border: none;\
		');
		
		
		if (options.type === 'other') {
			// TODO: Build this
		} else if (options.type === 'next') {
			// button = document.createElement('img');
			// button.setAttribute('src', '../../images/H2OButtonNext.png');
			button = H2O.Image({ ID: 'nextbutton', alt: 'Next', src: '../../images/H2OButtonNext.png'});
		} else if (options.type === 'back') {
			// button = document.createElement('img');
			// button.setAttribute('src', '../../images/H2OButtonBack.png');
			button = H2O.Image({ ID: 'backbutton', alt: 'Back', src: '../../images/H2OButtonBack.png'});
		} else {
			// Throw Error
		}
			
		button.setAttribute('alt', 'Back');
		button.setAttribute('style', '\
			border: none;\
			width: 100%;\
			height: 100%;\
		');
		
		a.appendChild(button);
		self.appendChild(a);
		
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