/**
* H2O.ListItem is the H2O-compliant version of <li>, HTMLLIElement.
*///
(function() {
	if (window.H2O.ListItem) return;

	/**
	* Contructs an H2O ListItem (<li>) element
	*///
	var ListItem = function(attributes) {
		var li = document.createElement("LI");
		//li.setAttributes(attributes);
		
		// THIS SHOULD BE SOMEWHERE ELSE
		if (attributes) {
			
			if (attributes.classes) {
				for (var i in attributes.classes) {
					li.setAttribute("class", attributes.classes[i]);
				}
			}
			
			
			li.percentMarginTop = attributes.percentMarginTop;
			li.percentMarginBottom = attributes.percentMarginBottom;
			li.percentPaddingTop = attributes.percentPaddingTop;
			li.percentPaddingBottom = attributes.percentPaddingBottom;
		}
		
		li.addEventListener("DOMNodeInserted", function(evt) {
			ListItem.extend(li);
		}, false);
		
		return li;
	}
	
	/**
	* Extends an <li> to have H2O features 
	*///
	ListItem.extend = function(node) {
		H2O.Element.extend(node);
		return node;
	}
	
	window.H2O.ListItem = ListItem;
})();