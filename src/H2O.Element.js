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
		switch (element.tagName) {
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
		return null;
	}
	
	/**
	* Extends a HTMLElement descendant to have H2O features 
	*///
	Element.extend = function(node) {
		node.isH2O = true;
		
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
			var height = parseInt(this.getComputedHeight().replace(/%/, ""));
			var paddingTop = parseInt(this.getComputedPaddingLeft().replace(/%/, ""));
			var paddingBottom = parseInt(this.getComputedPaddingBottom().replace(/%/, ""));
			var marginTop = parseInt(this.getComputedMarginTop().replace(/%/, ""));
			var marginBottom = parseInt(this.getComputedMarginBottom().replace(/%/, ""));
			
			return height + paddingTop + paddingBottom + marginTop + marginBottom;
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

		/* Adding EventListener for parentNode resize if already in DOMTree */
		if (node === document.body) {
			window.addEventListener("resize", document.body.resize, false);
		} else {
			if (node.parentNode) {
				node.parentNode.addEventListener("resize", node.resize, false);
			}
		}
		
		/* To add listener once it's in DOMTree */
		node.addEventListener("DOMNodeInserted", function(evt) {
			if (evt.target.isH2O && evt.target.nodeType === Node.ELEMENT_NODE) {
				evt.stopPropagation();
				H2O.debug("Hey! " + evt.target + " was added " + evt.target.parentNode);
				
				if (node.parentNode.isH2O) {
					node.parentNode.addEventListener("resize", node.resize, false);
				}
			}
		}, false);
		
		return node;
	}
	
	window.H2O.Element = Element;
})();