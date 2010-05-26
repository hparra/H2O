
(function() {
	if (window.H2O.Label) return;

	var Label = function(node) {
		var element = Label.extend(document.createElement("H6"));

		element.addEventListener("DOMNodeInserted", function(evt) {
			element.parentNode.addEventListener("resize", element.resize, false);
		}, false);
		
		return element;
	}
	
	Label.extend = function(node) {
		H2O.Element.extend(node);
		
		node.resize = function() {
			var parentWidth = document.defaultView.getComputedStyle(node.parentNode, null)['width'].replace(/px/, "");
			var parentHeight = document.defaultView.getComputedStyle(node.parentNode, null)['height'].replace(/px/, "");
			var fontSize = document.defaultView.getComputedStyle(node, null)['fontSize'].replace(/px/, "");
			var scrollSlope = node.scrollHeight / node.scrollWidth;
			
			/* center text vertically */
			node.style.lineHeight = parentHeight + "px";

			H2O.debug("parentXY: " + parentWidth  + "x" +  parentHeight);
			H2O.debug("--fontSize: " + fontSize);
			H2O.debug("--scrollXY: " + node.scrollWidth + "x" +  node.scrollHeight);
			H2O.debug("--scrollSlope: " + scrollSlope);

			if (isNaN(scrollSlope)) { /* for Webkit bug */
				/* Conservative: assumes each character is as wide as its height */
				var proposedFontSize = (parentWidth / node.childNodes[0].length);
				if (proposedFontSize < parentHeight) {
					node.style.fontSize = proposedFontSize + 'px';
				} else {
					node.style.fontSize = parentHeight + "px";
				}
			} else {
			
				var ratio = parentWidth / node.scrollWidth;
				var heightBound = scrollSlope * parentWidth;
				

				H2O.debug("--heightBound: " + heightBound);			
				
				if (heightBound < parentHeight) {
					node.style.fontSize = fontSize * ratio + "px";
				
				} else {
					node.style.fontSize = parentHeight + "px";
				}
			}
		}
		
		if (node.parentNode) {
			H2O.debug("HELO?");
			node.parentNode.addEventListener("resize", node.resize, false);
		}		
		
		//node.dispatchResizeEvent();
		return node;
	}
	
	window.H2O.Label = Label;
})();