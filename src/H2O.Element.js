
(function() {
	if (window.H2O.Element) return;
	
	
	Element = function(node) {
		var self = node;
		
		/* initializer */	
		function initialize() {
			/* force initial resize */
			//self.resize(self.parentNode.offsetWidth, self.parentNode.offsetHeight);
		}
		
		self.show = function() {
			self.style.display = "block";
			//self.dispatchResizeEvent();
		}
		
		self.hide = function() {
			self.style.display = "none";
		}
		
		self.dispatchResizeEvent = function () {
			resizeEvent = document.createEvent("Event");
			resizeEvent.initEvent("parentresize", false, false);
			resizeEvent.width = self.getWidth();
			resizeEvent.height = document.height;
			self.dispatchEvent(resizeEvent);
		}
		
		initialize();
	}
	
	window.H2O.Element = Element;
})();