
(function() {
	if (window.H2O.Element) return;
	
	Element = function(node) {
		var self = node;
		
		Element.DEBUG = true;
		function debug(str) {
			if (console && H2O.Element.DEBUG)
				console.debug("[H2O.Element(" + self.tagName + ")] " + str);
		}		
		
		/* initializer */	
		function initialize() {
			/* force initial resize */
			//self.resize(self.parentNode.offsetWidth, self.parentNode.offsetHeight);
			
			var pt = 0; /* % */
			var pb = 0; /* % */
			
			//pt = self.offsetPadding;
			//self.style.paddingTop = "0px";
			//debug("PTa = " + pt);
			pt = document.defaultView.getComputedStyle(self, null).getPropertyValue("padding-top");
			debug("PTb	 = " + pt);
		}
		
		self.show = function() {
			self.style.display = "block";
			
			/*
			for (int i = 0; i < self.childNodes.length; ++i) {
				self.childNodes[i].dispatchParentResizeEvent();
			}
			*/
		}
		
		self.hide = function() {
			self.style.display = "none";
		}
		
		/*
		self.dispatchResizeEvent = function () {
			resizeEvent = document.createEvent("Event");
			resizeEvent.initEvent("parentresize", false, false);
			resizeEvent.width = self.getWidth();
			resizeEvent.height = document.height;
			self.dispatchEvent(resizeEvent);
		}
		*/
		
		initialize();
	}
	
	window.H2O.Element = Element;
})();