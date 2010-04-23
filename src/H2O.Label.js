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

		self.resize = function() {
			console.debug("resize");
			
			height = document.defaultView.getComputedStyle(self.parentNode, null)['height'];
			console.debug(height);
			
			self.style.lineHeight = height + "px"; // always correct
			self.style.fontSize = height + "px";
		}
	}
	
	window.H2O.Label = Label;
})();