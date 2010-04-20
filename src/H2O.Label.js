	/**
 * 
 */
// USE: my_label = new H2O.Label()

(function() {
	if (window.H2O.Label) return;

	/**
	* Label
	*/
	Label = function(node) {
		var self = node;
		
		/* initializer */	
		function initialize() {
			self.addEventListener("parentresize", function(evt) {
				console.debug("H2O.Label's parent resized: " + evt.width + "x" + evt.height);
				this.resize(evt.width, evt.height)	
			}, false);
			
			/* force initial resize */
			self.resize(self.parentNode.offsetWidth, self.parentNode.offsetHeight);
		}
		
		/**
		*/
		self.resize = function(w, h) {
			this.style.lineHeight = h + "px"; // always correct
			this.style.fontSize = h + "px";
		}
		
		initialize();
	}
	
	window.H2O.Label = Label;
})();