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
	debug = function(str) {
		if (console && H2O.DEBUG)
			console.debug("[H2O] " + str);
	};
	
	/**
	 * Initializes an Element (sub)tree for H2O compliance
	 * @private
	 *///
	initializeTree = function(node) {
		
		/* bypass non-Elements (and children) */
		if (node.nodeType != Node.ELEMENT_NODE) return;
		
		/* bypass Elements (and their children) with "NO_H2O" class */
		if (node.className.match(/NO_H2O/)) return; /* Too new HTML5/DOM3: node.classList.contains("NO_H2O"); */
		
		/* initalize elements by tag */
		debug(node.tagName);
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
		case "OL":
		case "UL":
			H2O.List(node); break;
		case "DIV":
		case "SPAN":
		case "VIDEO":
		default:
			/* DO NOTHING */ break;
		}
		
		/* define dispatchResizeEvent() if it doesn't exist (it shouldn't) */
		if (typeof node.dispatchResizeEvent != "function") {
			node.dispatchResizeEvent = function() {
				var e = document.createEvent("Event");
				e.initEvent("resize", false, false);
				node.dispatchEvent(e);
			};
		}
		
		/* define node.resize() if it doesn't exist (it may) */
		if (typeof node.resize != "function") {
			node.resize = node.dispatchResizeEvent;
		}

		if (node === document.body) {
			window.addEventListener("resize", document.body.resize, false);
		} else {
			node.parentNode.addEventListener("resize", node.resize, false);
		}
		
		/* preorder depth-first traversal */
		for (var i = 0; i < node.childNodes.length; ++i) {
			initializeTree(node.childNodes[i]);
		}
	};
	
	window.addEventListener("load", function() {
		initializeTree(document.body);
		//document.body.show();
	}, true);
	
	window.H2O = H2O;
	
})();