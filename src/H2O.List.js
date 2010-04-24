
(function() {
	if (window.H2O.List) return;

	/**
	* Label
	*/
	List = function(node) {
		var self = node;
		var children;
		var columns;
		var rows;
		
		/* initializer */	
		function initialize() {
			
			/* deal with children */
			children = self.getElementsByTagName("LI");
			
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
				this.hideChilde(node);
			}
		}
		
		self.showNext = function() {
			H2O.debug("NEXT");
			
			var stack = rows * columns;
			var i = 0;
			var j = 0; /* unhidden index */			

			/* hide */
			while (i < stack && children.length - j > stack) {
				console.debug("looking at " + (i + j))
				if (children[i+j].style.display != "none") {
					self.hideChild(children[i+j]);
					++i;
				} else {
					++j;
				}
			}
			
			/* show */
			var k = i + j;
			while (children.length - j > stack && k < children.length && k < i + j + stack) {
				console.debug("showing " + k);
				self.showChild(children[k]);
				++k;
			}
			
		}
		
		self.showPrevious = function() {
			var stack = rows * columns;
			var i = 0;
			var j = 0; /* unhidden index */
			
			/* find first unhidden */
			while (i < children.length && children[i].style.display == "none") {
				++i;
			}
			
			/* flip from stack away from i or next possible spot */
			if (i > 0) {
				j = i + Math.min(stack, children.length - i);
				console.debug('j at ' + j);
				i = i - stack;
				while (i < j) {
					--j;
					self.toggleChild(children[j]);
				}
			}
			
		}
		
		initialize();
	}
	
	window.H2O.List = List;
})();