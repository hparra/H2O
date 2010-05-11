/**
 * H2O
 * http://www.w3.org/TR/DOM-Level-3-Events/
 * Terminal tags: Hx, IMG, VIDEO
 * Non-terminal tags: DIV, SPAN, UL, TABLE
 *///
(function() {
	if (window.H2O) return;
	
	/**
	 *
	 *///
	var H2O = function() {

	};
	
	H2O.DEBUG = true;
	
	/**
	 * Reports debug info to console if available
	 * @private
	 *///
	H2O.debug = function(str) {
		if (H2O.DEBUG) {
			if (typeof console !== 'undefined') {
				console.debug(str);
			} else if (typeof opera !== 'undefined') {
				opera.postError(str);
			}
		}
	};
	
	H2O.createElement = function(str) {
		return new H2O.Element(str);
	};
	
	/**
	 * Initializes an Element (sub)tree for H2O compliance
	 * @private
	 *///
	var initializeTree = function(node) {
		
		/* bypass non-Elements (and children) */
		if (node.nodeType != Node.ELEMENT_NODE) return;
		
		/* bypass Elements (and their children) with "NO_H2O" class */
		if (node.className.match(/NO_H2O/)) return; /* Too new HTML5/DOM3: node.classList.contains("NO_H2O"); */
		
		/* preorder depth-first traversal */
		for (var i = 0; i < node.childNodes.length; ++i) {
			initializeTree(node.childNodes[i]);
		}
		
		//H2O.debug(node.tagName);
		
		/* initalize elements by tag */
		switch (node.tagName) {
		case "IMG":
			H2O.Image(node); break;
		case "H1":
		case "H2":
		case "H3":
		case "H4":
		case "H5":
		case "H6":
			H2O.Label(node); break;
		case "LI":
			H2O.ListItem.extend(node); break;
		case "OL":
		case "UL":
			H2O.List.extend(node); break;
		case "DIV":
		case "SPAN":
		case "VIDEO":
		default:
			H2O.Element.extend(node); break;
		}
		

		

	};
	
	window.addEventListener("load", function() {
		initializeTree(document.body);
		//document.body.show();
		document.body.resize();
	}, true);
	
	window.H2O = H2O;
	
})();