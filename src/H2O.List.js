
(function() {
	if (window.H2O.List) return;

	var List = function() {
		return List.extend(document.createElement("UL"));
	}

	List.extend = function(node) {
		H2O.Element.extend(node);

		node.perpage = null;
		node.focus = null;

		node.getItems = function() {
			return this.getElementsByTagName("LI");
		}
		
		/* showNext() */
		node.showNext = function(count) {
			count = count || this.perpage;
			var children = this.getItems();
			var notLastPage = children.length - this.focus > this.perpage;
			for (var i = 0; i < count && notLastPage; ++i) {
				children[this.focus].hide();
				++this.focus;
			}
		}
		
		/* showPrevious() */
		node.showPrevious = function(count) {
			count = count || this.perpage;
			var children = this.getItems();
			for (var i = 0; i < count && this.focus > 0; ++i) {
				--this.focus;			
				children[this.focus].show();
			}
		}
		

		//
		node.calculateViewportLength = function() {
			var items = this.getItems();
			if (items.length > 0) {
				var item = items[0];
				
				/* expecting % - only needed if not rendered */
				var width = item.getComputedOffsetWidth();
				var height = item.getComputedOffsetHeight();
				
				var rows;
				var columns;				
				if (false) {
					rows = Math.round(100 / height);
					columns = Math.round(100 / width);
				} else {
					rows = item.parentNode.offsetHeight / item.offsetHeight;
					columns = item.parentNode.offsetWidth / item.offsetWidth;
				}
				
				this.focus = 0;
				this.perpage = (columns * rows) || 1;
			}
		}
		
		function initialize() {
			node.calculateViewportLength();
		}
		
		initialize();
		
		return node;
	}
	
	window.H2O.List = List;
})();