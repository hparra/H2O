/**
 * 
 */
// USE: my_label = new H2O.Label()
H2O.Label = function(options) {
		var self = null;
	
	(function() { // constructor
		
		// check for options, if not create defaults
	//options.id = options.id || "testID"; // FIXME: Should be random number
		//options.text ||= "testTEXT";
		self = document.createElement('span'); // TODO: should we use P or H2 instead for accessibility?
		self.setAttribute('id', options.id);
		self.setAttribute('class', 'H2O_Label');
		self.setAttribute('style','\
			margin: 0px;\
			padding: 0px;\
			overflow: hidden;\
			font-size: 14px;\
		');
		self.innerHTML = options.text;
		
		self.addEventListener("DOMNodeInserted", function(e) { // NOTE: Not supported in IE
			//console.log(self.parentNode);
			// the hell? it fires twice and the first time is no good.
			// it's a DocumentFragment, from I don't know where
			if ((self.parentNode.id) !== undefined) {
				//console.debug(self.id + " DOMNodeInserted");
				e.stopPropagation(); // cancel bubble
				window.addEventListener("resize", self.resize, false);

				// FIXME: HACK. Don't know why this is the case.
				//setTimeout(self.resize, 100);
				self.resize();
			}
		}, false);
	})();


	self.resize = function() {
		
		//if (typeof self.parentNode !== undefined) {
			//console.debug(self.id + " Resize");

			self.style.width = self.parentNode.offsetWidth;
			self.style.height = self.parentNode.offsetHeight;

			width_ratio = self.parentNode.offsetWidth / self.offsetWidth;
			fontSize = self.style.fontSize.replace(/px/, ""); // FIXME: assumes we are only using px
			self.style.lineHeight = self.parentNode.offsetHeight + "px"; // always correct
			self.style.fontSize = (fontSize * width_ratio) + "px";

			// height_ratio = self.parentNode.offsetHeight / self.offsetHeight;
			// if (self.parentNode.offsetHeight < self.offsetHeight) {
			// 	fontSize = self.style.fontSize.replace(/px/, "");
			// 	self.style.fontSize = (fontSize * height_ratio) + "px";
			// }
		//}
	}

	self.destroy = function() {
		window.removeEventListener("resize", resize);
		// todo: remove element
		self = null;
	};
	
	
	return self;
};