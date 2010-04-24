
(function() {
	if (window.H2O.List) return;

	/**
	* Label
	*/
	List = function(node) {
		var self = node;
		var children;
		var focus;
		var columns;
		var rows;
		
		/* initializer */	
		function initialize() {
			
			/* deal with children */
			children = self.getElementsByTagName("LI");
			focus = 0;
			
			/* hackerade! */
			H2O.debug("xL width: " +  document.defaultView.getComputedStyle(self, null)['width'].replace(/px/, ""));
			columns = Math.round(self.offsetWidth / children[0].offsetWidth);
			rows = Math.round(self.offsetHeight / children[0].offsetHeight);
			H2O.debug(columns + " x " + rows);
			
			
			/* hide what isn't shown */
			/*
			for (var i = columns * rows; i < children.length; ++i) {
				H2O.debug("hid");
				self.hideChild(children[i]);
			}
			*/
		}
		
		self.addChild = function(node) {
			self.appendChild(node);
			self.resize();
			self.children = self.getElementsByTagName("LI");
		}
		
		self.hideChild = function(node) {
			node.style.display = "none";
		}
		
		self.showChild = function(node) {
			node.style.display = "block";
			node.resize();
		}
		
		self.toggleChild = function(node) {
			if (node.style.display = "none") {
				this.showChild(node);
			} else {
				this.hideChild(node);
			}
		}
		
		self.showNext = function() {
			H2O.debug("NEXT");
			if (focus < children.length - 1) {
				children[focus].style.display = "none";
				++focus;
			}
		}
		
		self.showPrevious = function() {
			H2O.debug("LAST");
			if (focus > 0) {
				--focus;
				children[focus].style.display = "block";
				children[focus].resize();
			}
		}
		
		initialize();
	}
	
	window.H2O.List = List;
})();