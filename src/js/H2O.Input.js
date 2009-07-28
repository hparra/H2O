H2O.Input = function(options) {
	var self = null;
	
	(function() {
		
        self = document.createElement('fieldset');
        self.setAttribute('id', options.ID);
		self.setAttribute('style', '\
			border: none;\
			width: 100%;\
			height: 100%;\
			margin: 0px;\
			padding: 0px;\
		');
		
		dl = document.createElement('dl');
		
		for (d in options.data) {
			dd = document.createElement('dd');
			dd.setAttribute('style', '\
				margin: 0px;\
			');
			
			dd.style.padding = options.padding + 'px';
		
			input = document.createElement('input');
			input.setAttribute('type', 'input');
			input.setAttribute('name', options.data[d].name);
			input.setAttribute('style', '\
				border: 2px solid #000000;\
				background-color: #ffffff;\
				position: relative;\
				font-family: arial;\
				font-size: 20px;\
				width: 100%;\
			');
			
			dd.innerHTML = options.data[d].name+':';
			dd.appendChild(input);
			dl.appendChild(dd);
		}
		
		self.appendChild(dl);
		
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
	
	// Resize unnecessary for input boxes? 
	self.resize = function() {
		// width = 0;
		// height = 0;
		// if (self.parentNode.offsetWidth >= self.parentNode.offsetHeight) {
		//     /* Landscape */
		//     width = self.parentNode.offsetHeight;
		//     height = self.parentNode.offsetHeight;
		// } else {
		//     /* Portrait */
		//     width = self.parentNode.offsetWidth;
		//     height = self.parentNode.offsetWidth;
		// };
		// 
		// width = width - (2 * options.padding);
		// height = height - (2 * options.padding);
		// 
		// /* Centering */
		// self.style.width = width + "px";
		// self.style.height = height + "px";
		// self.style.marginLeft = (-1 * width) / 2 + "px";
		// self.style.marginTop = (-1 * height) / 2 + "px";
	};
	
	return self;
};