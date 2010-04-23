
(function() {
	if (window.H2O.Label) return;

	/**
	* Label
	*/
	var Label = function(node) {
		var self = node;

		self.resize = function() {
			var fitsHorizontally = true;
			
			var parentWidth = document.defaultView.getComputedStyle(self.parentNode, null)['width'].replace(/px/, "");
			var parentHeight = document.defaultView.getComputedStyle(self.parentNode, null)['height'].replace(/px/, "");

			/* center text vertically */
			this.style.lineHeight = parentHeight + "px";
			
			console.debug("scrollHeight: " + self.scrollHeight);
			console.debug("parentHeight: " + parentHeight);
			console.debug("scrollWidth: " + self.scrollWidth);
			console.debug("parentWidth: " + parentWidth);
			
			/* total lines of text (more than one you can't see) */
			//	var lines = Math.round(self.scrollHeight / parentHeight);
			//console.debug("lines: " + lines);
			
			/*
			var sh = self.scrollHeight;
			var sw = self.scrollWidth;
			if (lines > 1) {
				sh = sh / lines;
				sw = sw * lines;
			}
			
			var ratio =	sh / sw;
			*/

			/*
			width_ratio = parentWidth / self.scrollWidth;
			fontSize = self.style.fontSize.replace(/px/, "");
			self.style.fontSize = (fontSize * width_ratio) + "px";
			*/

			/*
			height_ratio = self.parentNode.offsetHeight / self.offsetHeight;
			if (self.parentNode.offsetHeight < self.offsetHeight) {
				fontSize = self.style.fontSize.replace(/px/, "");
				self.style.fontSize = (fontSize * height_ratio) + "px";
			}
			*/
			//self.style.width = width;
			//self.style.height = height;
			
			
			if (fitsHorizontally) {
				self.style.fontSize = parentHeight + "px";
			} else {
				/* ??? */
				//self.style.fontSize = parentHeight * ratio + "px";
			}
			
			
			
			self.dispatchResizeEvent();
		}
	}
	
	window.H2O.Label = Label;
})();