
(function() {
	if (window.H2O.Label) return;

	/**
	* Label
	*/
	var Label = function(node) {
		var self = node;

		self.resize = function() {
			
			var parentWidth = document.defaultView.getComputedStyle(self.parentNode, null)['width'].replace(/px/, "");
			var parentHeight = document.defaultView.getComputedStyle(self.parentNode, null)['height'].replace(/px/, "");
			var fontSize = document.defaultView.getComputedStyle(self, null)['fontSize'].replace(/px/, "");
			var scrollSlope = self.scrollHeight / self.scrollWidth;
			
			/* center text vertically */
			self.style.lineHeight = parentHeight + "px";

			if (isNaN(scrollSlope)) { /* for Webkit bug */
				/* Conservative: assumes each character is as wide as its height */
				var proposedFontSize = (parentWidth / self.childNodes[0].length);
				if (proposedFontSize < parentHeight) {
					self.style.fontSize = proposedFontSize + 'px';
				} else {
					self.style.fontSize = parentHeight + "px";
				}
			} else {
			
				var ratio = parentWidth / self.scrollWidth;
				var heightBound = scrollSlope * parentWidth;
				/*
				H2O.debug("parentXY: " + parentWidth  + "x" +  parentHeight);
				H2O.debug("--fontSize: " + fontSize);
				H2O.debug("--scrollXY: " + self.scrollWidth + "x" +  self.scrollHeight);
				H2O.debug("--scrollSlope: " + scrollSlope);
				H2O.debug("--heightBound: " + heightBound);			
				*/
				if (heightBound < parentHeight) {
					self.style.fontSize = fontSize * ratio + "px";
				
				} else {
					self.style.fontSize = parentHeight + "px";
				}
			}
			
			self.dispatchResizeEvent();
		}
	}
	
	window.H2O.Label = Label;
})();