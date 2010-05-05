/*
* H2O.Image
*
* How it works:
* - H2O searches for <img> tags with class="H20Image"
* - Image hides
* - Image grabs source URL from alt parameter
* - Image sets itself to initialize of onLoad
* - Image resizes
* - Image unhides
*/
(function() {
	if (window.H2O.Image) return;

	/**
	* Image
	*/
	Image = function(node) {
		var self = node;
		self.style.display = "none";
		
		/* initializer */	
		function initialize() {
			
			/* retain original image information */
			self.originalWidth = self.width;
			self.originalHeight = self.height;
			self.originalRatio = self.width / self.height;
			
			/* force initial resize */
			//self.resize();

			/* unhide */
			//self.style.display = "block";
			self.show();
		}
		
		/**
		*/
		self.resize = function() {
			
			var parentWidth = document.defaultView.getComputedStyle(self.parentNode, null)['width'].replace(/px/, "");
			var parentHeight = document.defaultView.getComputedStyle(self.parentNode, null)['height'].replace(/px/, "");
			
			var r = parentWidth / parentHeight;

			var width = 0;
			var height = 0;

			if (self.originalRatio > r) {
				width = parentWidth;
				height = parentWidth / self.originalRatio;
			}
			else {
				width = parentHeight * self.originalRatio;
				height = parentHeight;
			}

			self.style.width = width + "px";
			self.style.height = height + "px";
	
			/* vertical alignment */
			if (node.className.match(/MIDDLE/)) {
				self.style.top = "50%";
				self.style.marginTop = (-1 * height) / 2 + "px";
			} else if (node.className.match(/BOTTOM/)) {
				self.style.top = "100%";
				self.style.marginTop = -height + "px";
			} 


			/*
			options = {
				align: "center",
				valign: "bottom"
			}
			*/

			/* WORKS - but CSS can do better! See http://www.w3.org/Style/Examples/007/center */
			/*
			if (options.align === 'center') {
				self.style.left = "50%";
				self.style.marginLeft = (-1 * width) / 2 + "px";		
			}

			if (options.align === 'right') {
				self.style.left = "100%";
				self.style.marginLeft = -width + "px";
			}
			*/

			/* TODO: implement stripper */
			/*
			if (options.valign === 'middle') {
				self.style.top = "50%";
				self.style.marginTop = (-1 * height) / 2 + "px";
			}

			if (options.valign === 'bottom') {
				self.style.top = "100%";
				self.style.marginTop = -height + "px";
			}
			*/
			
			
		};
		
		/* initiate image loading - doesn't work on iPhone or Android */
		/*
		self.addEventListener("load", initialize, false);
		self.src = self.alt;
		*/
		
		initialize();
		
	}
	
	window.H2O.Image = Image;
})();