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
				console.debug("[H2O] " + str);
			} else if (opera) {
				opera.postError("[H2O] " + str);
			}
		}
	};
	
	H2O.createElement = function(str, options) {
		var e = document.createElement(str);
		
		
		
		return e;
	}
	
	/**
	* Enhances an Element with additional methods and properties
	*///
	H2O.enhanceElement = function(node) {
		/* reimplement margin & padding top/left correctly */
		/* BAD! Should check for % only */
		node.percentMarginTop = document.defaultView.getComputedStyle(node, null)['marginTop'].replace(/%|px/, "");
		node.percentMarginBottom = document.defaultView.getComputedStyle(node, null)['marginBottom'].replace(/%|px/, "");
		node.percentPaddingTop = document.defaultView.getComputedStyle(node, null)['paddingTop'].replace(/%|px/, "");
		node.percentPaddingBottom = document.defaultView.getComputedStyle(node, null)['paddingBottom'].replace(/%|px/, "");		
		node.style.marginTop = 0;
		node.style.marginBottom = 0;
		node.style.paddingTop = 0;
		node.style.paddingBottom = 0;

		/* getComputedWidth() */
		node.getComputedWidth = function() {
			return document.defaultView.getComputedStyle(this, null)['width'];
		}

		/* getComputedHeight() */
		node.getComputedHeight = function() {
			return document.defaultView.getComputedStyle(this, null)['height'];
		}

		/* getComputedMarginTop() */
		node.getComputedMarginTop = function() {
			return document.defaultView.getComputedStyle(this, null)['marginTop'];
		}
		
		/* getComputedMarginBottom() */
		node.getComputedMarginBottom = function() {
			return document.defaultView.getComputedStyle(this, null)['marginBottom'];
		}
		
		/* getComputedPaddingTop() */
		node.getComputedPaddingTop = function() {
			return document.defaultView.getComputedStyle(this, null)['paddingTop'];
		}
		
		/* getComputedPaddingBottom() */
		node.getComputedPaddingBottom = function() {
			return document.defaultView.getComputedStyle(this, null)['paddingBottom'];
		}
		
		/* hide() */
		if (!node.hide) {
			node.hide = function() {
				this.style.display = "none";
			}
		}
		
		/* show() */
		if (!node.show) {
			node.show = function() {
				this.style.display = "block";
				this.resize();
			}
		}
		
		/* toggle() */
		if (!node.toggle) {
			node.toggle = function() {
				if (this.style.display == "none") {
					this.show();
				} else {
					this.hide();
				}
			}
		}
	}
	
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
		
		H2O.enhanceElement(node);
		
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
			node.resize = function() {
				//var offsetHeight = document.defaultView.getComputedStyle(node.parentNode, null)['height'].replace(/%|px/, "");
				var offsetHeight = node.parentNode.offsetHeight;
				//var offsetHeight = node.offsetHeight;
				node.style.marginTop = (node.percentMarginTop / 100 * offsetHeight) + "px";
				node.style.marginBottom = (node.percentMarginBottom / 100 * offsetHeight) + "px";
				node.style.paddingTop = (node.percentPaddingTop / 100 * offsetHeight) + "px";
				node.style.paddingBottom = (node.percentPaddingBottom / 100 * offsetHeight) + "px";
				node.dispatchResizeEvent();
			};
		}

		if (node === document.body) {
			window.addEventListener("resize", document.body.resize, false);
		} else {
			node.parentNode.addEventListener("resize", node.resize, false);
		}
		

	};
	
	window.addEventListener("load", function() {
		initializeTree(document.body);
		document.body.show();
		//document.body.resize();
	}, true);
	
	window.H2O = H2O;
	
})();