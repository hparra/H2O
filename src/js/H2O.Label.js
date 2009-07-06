
// USE: my_label = new H2O.Label()
H2O.Label = function(options) {
	var self = null;
	(function() { // constructor
		
		// check for options, if not create defaults
		//options.id = options.id || "testID";
		//options.text ||= "testTEXT";

		self = document.createElement('div'); // TODO: should we use P or H1 instead for accessibility?
		self.setAttribute('id', options.id); // TODO: assign random id if not present
		//label.setAttribute('class' ''); // TODO: accept classes as options
		self.setAttribute('style','\
			display: block;\
			margin: 0;\
			padding: 0;\
			overflow: hidden;\
		');
		self.innerHTML = options.text;
		self.addEventListener("DOMNodeInserted", function(e) {
			console.log(self.parentNode);
			if ((self.parentNode.id) === undefined) {
				// the hell? it fires twice and the first time is no good.
				// it's a DocumentFragment, from I don't know where
			}
			else {
				e.stopPropagation(); // cancel bubble
				self.resize();
				window.addEventListener("resize", self.resize, false);
			}
		}, false);
	})();

	self.resize = function() {
		self.style.width = self.parentNode.offsetWidth;
		self.style.height = self.parentNode.offsetHeight;
		self.style.lineHeight = self.parentNode.offsetHeight + "px";
		self.style.fontSize = self.parentNode.offsetHeight + "px";
	}

	self.destroy = function() {
		window.removeEventListener("resize", self.resize);
		// todo: remove element
		self = null;
	};
	
	return self;
};