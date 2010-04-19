/**
 * 
 */
// USE: my_label = new H2O.Label()
H2O.Label = function(options) {
	
	var self = document.createElement('span'); // TODO: should we use P or H2 instead for accessibility?

	if (options.id === undefined)
		options.id = H2O.CreateRandomID();
	if (options.text === undefined)
		options.text = "";
	
	self.setAttribute('id', options.id);
	self.setAttribute('class', 'H2O_Label');
	self.setAttribute('style','\
		margin: 0px;\
		padding: 0px;\
		overflow: hidden;\
	');
	self.innerHTML = options.text;
	
	self.addEventListener("DOMNodeInserted", function(e) { // NOTE: Not supported in IE
		if ((self.parentNode.id) !== undefined) {
			e.stopPropagation();
			self.resize();
			window.addEventListener("resize", self.resize, false);
		}
	}, false);


	self.resize = function() {
		
		containerWidth = self.parentNode.offsetWidth;
		containerHeight = self.parentNode.offsetHeight;

		//self.style.width = self.parentNode.offsetWidth;
		//self.style.height = self.parentNode.offsetHeight;

		//width_ratio = self.parentNode.offsetWidth / self.offsetWidth;
		//fontSize = self.style.fontSize.replace(/px/, ""); // FIXME: assumes we are only using px
		self.style.lineHeight = containerHeight + "px"; // always correct
		self.style.fontSize = containerHeight + "px";

		// height_ratio = self.parentNode.offsetHeight / self.offsetHeight;
		// if (self.parentNode.offsetHeight < self.offsetHeight) {
		// 	fontSize = self.style.fontSize.replace(/px/, "");
		// 	self.style.fontSize = (fontSize * height_ratio) + "px";
		// }
		//self.style.width = width;
		//self.style.height = height;
	}

	self.destroy = function() {
		window.removeEventListener("resize", resize);
		// todo: remove element
		self = null;
	};
	
	
	return self;
};