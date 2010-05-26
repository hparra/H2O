/**
* H2O.Element is the H2O-compliant version of HTMLElement.
*///
(function() {
	if (window.H2O.Element) return;

	/**
	* Doesn't do anything (Maybe later? Or a parser?)
	*///
	var Element = function(str) {
		var element = document.createElement(str);
		return H2O.Element.extend(element);
	}
	
	Element.parsePercent = function(str) {
		if (str.match(/%/, "")) {
			return parseInt(str.replace(/%/, ""));
		} else if (str.match(/px/, "")) {
			var px = parseInt(str.replace(/px/, ""));
			if (px == 0) {
				return 0;
			}
			else {
				
			}
		}
		
		return null;
	};
	
	/* TODO: DELETE! */
	Element.getPercentedAttribute = function(element, attribute) {
		var value = document.defaultView.getComputedStyle(element, null).getPropertyValue(attribute);
		H2O.debug("getPercentedAttribute => " + value);
		if (value.match(/%/, "")) {
			return parseInt(value.replace(/%/, ""));
		} else if (value.match(/px/, "")) {
			var px = parseInt(value.replace(/px/, ""));
			if (px == 0) {
				return 0;
			}
			else {
				H2O.debug("SHITE! " + document.defaultView.getComputedStyle(element, null)["height"].replace(/px/, "") / px);
			}
		}
	};
	
	/**
	*
	*///
	Element.addComputedMethods = function(node) {
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
		
		/* getComputedMarginTop() */
		node.getComputedMarginLeft = function() {
			return document.defaultView.getComputedStyle(this, null)['marginLeft'];
		}
		
		/* getComputedMarginBottom() */
		node.getComputedMarginRight = function() {
			return document.defaultView.getComputedStyle(this, null)['marginRight'];
		}
		
		/* getComputedPaddingLeft() */
		node.getComputedPaddingLeft = function() {
			return document.defaultView.getComputedStyle(this, null)['paddingLeft'];
		}
		
		/* getComputedPaddingBottom() */
		node.getComputedPaddingRight = function() {
			return document.defaultView.getComputedStyle(this, null)['paddingRight'];
		}
		
		/* Prerendering, as % */
		node.getComputedOffsetWidth = function() {
			var width = parseInt(this.getComputedWidth().replace(/%/, ""));
			var paddingLeft = parseInt(this.getComputedPaddingLeft().replace(/%/, ""));
			var paddingRight = parseInt(this.getComputedPaddingRight().replace(/%/, ""));
			var marginLeft = parseInt(this.getComputedPaddingLeft().replace(/%/, ""));
			var marginRight = parseInt(this.getComputedPaddingRight().replace(/%/, ""));
			/* TODO: include 'border' */
			
			return width + paddingLeft + paddingRight + marginLeft + marginRight;
		}
		
		/* Prerendering, as % */
		node.getComputedOffsetHeight = function() {
			var height = parseInt(node.getComputedHeight().replace(/%/, ""));
			var paddingTop = parseInt(node.getComputedPaddingLeft().replace(/%/, ""));
			var paddingBottom = parseInt(node.getComputedPaddingBottom().replace(/%/, ""));
			var marginTop = parseInt(node.getComputedMarginTop().replace(/%/, ""));
			var marginBottom = parseInt(node.getComputedMarginBottom().replace(/%/, ""));
			
			return height + paddingTop + paddingBottom + marginTop + marginBottom;
		}
	}
	
	/* reimplement margin & padding top/bottom as expected, not DOM spec */
	/* The trick here is that node has not yet been rendered, and still has % in ComputedStyle */
	//node.percentMarginTop = document.defaultView.getComputedStyle(node, null)['marginTop'].replace(/%/, "");
	/* I HATE THIS IMPLEMENTATION */
	Element.cssHacks = function(node) {

		if (typeof node.percentMarginTop === "undefined") {
			node.percentMarginTop = Element.getPercentedAttribute(node, "margin-top");
		}
		
		if (typeof node.percentMarginBottom === "undefined") {
			node.percentMarginBottom = document.defaultView.getComputedStyle(node, null)['marginBottom'].replace(/%/, "");
		}
		
		if (typeof node.percentPaddingTop === "undefined") {
			node.percentPaddingTop = document.defaultView.getComputedStyle(node, null)['paddingTop'].replace(/%/, "");
		}
		
		if (typeof node.percentPaddingBottom === "undefined") {
			node.percentPaddingBottom = document.defaultView.getComputedStyle(node, null)['paddingBottom'].replace(/%/, "");
		}
		
		/* reset (margin, padding) * (top, height) */
		node.style.marginTop = 0;
		node.style.marginBottom = 0;
		node.style.paddingTop = 0;
		node.style.paddingBottom = 0;
	}
	
	/**
	* Extends a HTMLElement descendant to have H2O features 
	*///
	Element.extend = function(node) {
		node.isH2O = true;
		
		node.percentWidth = Element.parsePercent(document.defaultView.getComputedStyle(node, null)['width']);
		node.percentHeight = Element.parsePercent(document.defaultView.getComputedStyle(node, null)['height']);
		H2O.debug(node.tagName + " percentWidth: " + node.percentWidth + "; percentHeight: " + node.percentHeight + ";");

		Element.cssHacks(node);
		Element.addComputedMethods(node);
		
		
		/* hide() */
		if (!node.hide) {
			node.hide = function() {
				this.style.display = "none";
			}
		}
		
		/* show() */
		if (!node.show) {
			node.show = function() {
				node.style.display = "block";
				node.resize();
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
		
		node.resizeMarginBox = function() {
			var offsetHeight = node.parentNode.offsetHeight;
			node.style.marginTop = (node.percentMarginTop / 100 * offsetHeight) + "px";
			node.style.marginBottom = (node.percentMarginBottom / 100 * offsetHeight) + "px";
		}
		
		node.resizePaddingBox = function() {
			var offsetHeight = node.parentNode.offsetHeight;
			node.style.paddingTop = (node.percentPaddingTop / 100 * offsetHeight) + "px";
			node.style.paddingBottom = (node.percentPaddingBottom / 100 * offsetHeight) + "px";
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
				/* calculate marginBoxHeight and paddingBoxHeight by original % */
				var offsetHeight = node.parentNode.offsetHeight;
				node.style.marginTop = (node.percentMarginTop / 100 * offsetHeight) + "px";
				node.style.marginBottom = (node.percentMarginBottom / 100 * offsetHeight) + "px";
				node.style.paddingTop = (node.percentPaddingTop / 100 * offsetHeight) + "px";
				node.style.paddingBottom = (node.percentPaddingBottom / 100 * offsetHeight) + "px";
				node.dispatchResizeEvent();
			};
		}

		/* Adding EventListener for parentNode resize if already in DOMTree */
		if (node.tagName === "BODY") {
			window.addEventListener("resize", node.resize, false);
		} else {
			if (node.parentNode) {
				node.parentNode.addEventListener("resize", node.resize, false);
			}
		}
		
		/* To add listener once it's in DOMTree */
		node.addEventListener("DOMNodeInserted", function(evt) {
			if (evt.target.isH2O && evt.target.nodeType === Node.ELEMENT_NODE) {
				evt.stopPropagation();
				
				if (node.parentNode.isH2O) {
					node.parentNode.addEventListener("resize", node.resize, false);
				}
			}
			
			node.resize();
		}, false);
		
		
		return node;
	}
	
	window.H2O.Element = Element;
})();