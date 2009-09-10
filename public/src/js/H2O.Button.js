/**
* @param options {Object}
* H2O Button Options:
* options.ID: id of the button
* options.type: type of the button
* options.text: text of the button
* options.href: where the button links to
* options.click: set the onclick attribute for the link
*/
H2O.Button = function(options) {
	/** @private H2O.Button Object*/
	var self = null;

	/**
	* Power constructor for H2O.Button
	* @constructor
	*/
	(function() {
		
		// OPTIONS Checking
		// 
		// Checks for undefined parameters and sets default values
		// Default ID: TODO
		// Default type: ERROR
		// Default text: click me
		// Default href: #
		// Default click: "" 

		if (options.ID === undefined) {
			options.ID = "testbutton"; // FIXME: Something random/sequential?
		}
		if (options.type === undefined) {
			// Throw Error
		}
		if (options.text === undefined) {
			options.text = 'click me';
		}
		if (options.href === undefined) {
			options.href = '#';
		}
		if (options.click === undefined) {
			options.click = '';
		}
		
		self = document.createElement('div');
        //self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			position: relative;\
			top: 50%;\
			left: 50%;\
		');
		//self.innerHTML = options.text;
		
		a = document.createElement('a');
		//a.setAttribute('href', options.href);
		a.setAttribute('onClick', options.click);
		a.setAttribute('style', '\
			border: none;\
		');
		
		
		if (options.type === 'other') {
			// TODO: Build this
			//text = H2O.Label({ text: options.text });	
		} else if (options.type === 'next') {
			// button = document.createElement('img');
			// button.setAttribute('src', '../../images/H2OButtonNext.png');
			button = H2O.Image({ ID: 'nextbutton', alt: 'Next', src: 'http://marco.calit2.uci.edu/assets/i3/images/H2OButtonNext.png'});
		} else if (options.type === 'back') {
			// button = document.createElement('img');
			// button.setAttribute('src', '../../images/H2OButtonBack.png');
			button = H2O.Image({ ID: 'backbutton', alt: 'Back', src: 'http://marco.calit2.uci.edu/assets/i3/images/H2OButtonBack.png'});
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
	
	/**
	* @function
	* resizes the image on window resize event
	*/
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