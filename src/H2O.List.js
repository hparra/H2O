
(function() {
	if (window.H2O.List) return;

	List = function(node) {
		var self = node;
		var children;
		var focus;
		var columns;
		var rows;
		var perpage;
		
		/* initializer */	
		function initialize() {
			
			/* deal with children */
			children = self.getElementsByTagName("LI");
			for (var i = 0; i < children.length; ++i) {
				children[i].addEventListener('webkitTransitionEnd', function(e) { 
					this.toggle();
					H2O.debug("??? " + this.style.display );
				}, false );
			}
			
			focus = 0;

			/* Only works if elements have been rendered */
			//var columns = Math.round(self.offsetWidth / children[0].offsetWidth);
			//var rows = Math.round(self.offsetHeight / children[0].offsetHeight);

			/* expecting % */
			var width = children[0].getComputedOffsetWidth();
			var height = children[0].getComputedOffsetHeight();
			
			rows = Math.round(100 / height);
			columns = Math.round(100 / width);
			
			perpage = (columns * rows) || 1;
			
			H2O.debug("Perpage: " + perpage);
			
			/* hide what isn't shown */
			for (var i = perpage; i < children.length; ++i) {
				//children[i].hide();
			}
		}

		self.showNext = function(count) {
			count = count || perpage;
			var notLastPage = children.length - focus > perpage;
			for (var i = 0; i < count && notLastPage; ++i) {
				children[focus].hide();
				++focus;
			}
		}
		
		self.showPrevious = function(count) {
			count = count || perpage;
			for (var i = 0; i < count && focus > 0; ++i) {
				--focus;			
				children[focus].show();
			}
		}
		
		initialize();
	}
	
	window.H2O.List = List;
})();