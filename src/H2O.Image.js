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

	var Image = function() {
		var element = Image.extend(document.createElement("IMG"));
		
		element.addEventListener("load", function(evt) {
			H2O.debug("H2O.Image src loaded.");
			element.originalWidth = element.width;
			element.originalHeight = element.height;
			element.originalRatio = element.width / element.height;
			
			if (element.parentNode) {
				element.resize();
			}
		}, false);

		element.addEventListener("DOMNodeInserted", function(evt) {
			element.parentNode.addEventListener("resize", element.resize, false);
			element.show();
		}, false);
		
		return element;
	};

	/**
	* Image
	*/
	Image.extend = function(node) {
		H2O.Element.extend(node);
		H2O.debug("Extending image");	

		//node.style.display = "none";
		node.hide();
		
		node.resize = function() {
			
			var parentWidth = document.defaultView.getComputedStyle(node.parentNode, null)['width'].replace(/px/, "");
			var parentHeight = document.defaultView.getComputedStyle(node.parentNode, null)['height'].replace(/px/, "");
			
			var r = parentWidth / parentHeight;
			var width = 0;
			var height = 0;

			if (node.originalRatio > r) {
				width = parentWidth;
				height = parentWidth / node.originalRatio;
			}
			else {
				width = parentHeight * node.originalRatio;
				height = parentHeight;
			}
			
			node.style.width = width + "px";
			node.style.height = height + "px";
	
			/* vertical alignment */
			if (node.className.match(/MIDDLE/)) {
				node.style.top = "50%";
				node.style.marginTop = (-1 * height) / 2 + "px";
			} else if (node.className.match(/BOTTOM/)) {
				node.style.top = "100%";
				node.style.marginTop = -height + "px";
			}			
		};
		
		if (node.parentNode) {
			/* retain original image information */	
			node.originalWidth = node.width;
			node.originalHeight = node.height;
			node.originalRatio = node.width / node.height;
			node.parentNode.addEventListener("resize", node.resize, false);
			node.show();
		}

		return node;
	}
	
	window.H2O.Image = Image;
})();