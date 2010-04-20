
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
			self.addEventListener("parentresize", function(evt) {
				console.debug("H2O.List's parent resized: " + evt.width + "x" + evt.height);
				this.resize(evt.width, evt.height)	
			}, false);
			
			/* force initial resize */
			self.resize(self.parentNode.offsetWidth, self.parentNode.offsetHeight);
			
			/* deal with children */
			children = node.getElementsByTagName("LI");
			console.debug("This has " + children.length + " LIs");
			
			/* hackerade! */
			columns = Math.round(self.offsetWidth / children[0].offsetWidth);
			console.debug("Columns = " + columns);
			
			rows = Math.round(self.offsetHeight / children[0].offsetHeight);
			console.debug("Rows = " + rows);
			
			/* hide what isn't shown */
			for (var i = columns * rows; i < children.length; ++i) {
				self.hideChild(children[i]);
			}
		}
		
		/**
		*/
		self.resize = function(w, h) {
			console.debug("List resized!")
		}
		
		self.hideChild = function(node) {
			node.style.display = "none";
		}
		
		self.showChild = function(node) {
			node.style.display = "block";
		}
		
		self.toggleChild = function(node) {
			if (node.style.display = "none") {
				this.showChild(node);
			} else {
				this.hideChilde(node);
			}
		}
		
		self.next = function() {
			var stack = rows * columns;
			var i = 0;
			var j = 0; /* unhidden index */			

			/* hide */
			while (i < stack && children.length - j > stack) {
				console.debug("looking at " + (i + j))
				if (children[i+j].style.display != "none") {
					this.hideChild(children[i+j]);
					++i;
				} else {
					++j;
				}
			}
			
			/* show */
			var k = i + j;
			while (children.length - j > stack && k < children.length && k < i + j + stack) {
				console.debug("showing " + k);
				this.showChild(children[k]);
				++k;
			}
			
		}
		
		self.previous = function() {
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
					this.toggleChild(children[j]);
				}
			}
			
		}
		
		initialize();
	}
	
	window.H2O.List = List;
})();