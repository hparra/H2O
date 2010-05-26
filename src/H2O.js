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
	
	H2O.getLocationSearch = function() {
		var query = {};
		if (document.location.search) {
			var pairs = document.location.search.substr(1).split("&");
			for (var i = 0; i < pairs.length; ++i) {
				var couple = pairs[i].split("=");
				query[couple[0]] = couple[1];
			}
		}
		return query;
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
		
		/* initalize elements by tag */
		switch (node.tagName) {
		case "IMG":
			H2O.Image.extend(node); break;
		case "H1":
		case "H2":
		case "H3":
		case "H4":
		case "H5":
		case "H6":
			H2O.Label.extend(node); break;
		case "LI":
			H2O.ListItem.extend(node); break;
		case "OL":
		case "UL":
			H2O.List.extend(node); break;
		default:
			H2O.debug(node.tagName);
			H2O.Element.extend(node); break;
		}
	};
	
	window.addEventListener("load", function() {
		initializeTree(document.body);
		document.body.show();
		//document.body.resize();
		
		// dispatch the H2O load event
		var e = document.createEvent("Event");
		e.initEvent("H2O.LOAD", false, false);
		window.dispatchEvent(e);
		
	}, true);
	
	window.H2O = H2O;
	
})();