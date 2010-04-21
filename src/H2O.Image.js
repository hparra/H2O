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
			self.addEventListener("parentresize", function(evt) {
				console.debug("H2O.Image's parent resized: " + evt.width + "x" + evt.height);
				this.resize(evt.width, evt.height)	
			}, false);
			
			/* force initial resize */
			self.resize(self.parentNode.offsetWidth, self.parentNode.offsetHeight);

			/* unhide */
			self.style.display = "block";
		}
		
		/**
		*/
		self.resize = function(w, h) {
			/*
			console.debug("Original (W, H, R): " + self.originalWidth + ", " + self.originalHeight + ", " + self.originalRatio);
			console.debug("RESIZE: image(" + self.width + ", " + self.height + ") "
				+ "offset(" + self.parentNode.offsetWidth + ", " + self.parentNode.offsetHeight + ")");
			*/

			/*
			containerWidth = self.parentNode.offsetWidth;
			containerHeight = self.parentNode.offsetHeight;
			containerRatio = containerWidth / containerHeight;
			*/
			r = w / h;

			width = 0;
			height = 0;

			if (self.originalRatio > r) {
				width = w;
				height = w / self.originalRatio;
			}
			else {
				width = h * self.originalRatio;
				height = h;
			}

			/*
			paddingL = parseInt(document.defaultView.getComputedStyle(self.parentNode, null)['paddingLeft'].replace(/px/, ""));
			paddingR = parseInt(document.defaultView.getComputedStyle(self.parentNode, null)['paddingRight'].replace(/px/, ""));
			paddingT = parseInt(document.defaultView.getComputedStyle(self.parentNode, null)['paddingTop'].replace(/px/, ""));
			paddingB = parseInt(document.defaultView.getComputedStyle(self.parentNode, null)['paddingBottom'].replace(/px/, ""));
			
			console.log(paddingL);
			console.log(paddingR);
			console.log(paddingT);
			console.log(paddingB);
			
			paddingB = 0;
			paddingT = document.defaultView.getComputedStyle(self, null).paddingTop.replace(/%/, "") * h / 100;
			console.debug("PADDING TOP:" + paddingT);

			
			width = width - (paddingL + paddingR);
			height = height - (paddingT + paddingB);
			*/

			self.style.width = width + "px";
			self.style.height = height + "px";


			options = {
				align: "center",
				valign: "middle"
			}

			if (options.align === 'center') {
				self.style.left = "50%";
				self.style.marginLeft = (-1 * width) / 2 + "px";		
			}

			if (options.align === 'right') {
				self.style.left = "100%";
				self.style.marginLeft = -width + "px";
			}

			if (options.valign === 'middle') {
				self.style.top = "50%";
				self.style.marginTop = (-1 * height) / 2 + "px";
			}

			if (options.valign === 'bottom') {
				self.style.top = "100%";
				self.style.marginTop = -height + "px";
			}

		};
		
		self.addEventListener("load", function() {
			self.originalWidth = self.width;
			self.originalHeight = self.height;
			self.originalRatio = self.width / self.height;

			initialize();
			
		}, false);

		/* initiate image loading */
		self.src = self.alt;
		
	}
	
	window.H2O.Image = Image;
})();