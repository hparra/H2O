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
	 * Adds ParentResizeEvent listeners/dispatchers and converts all .H2O elements
	 * @private
	 *///
	initialize = function() {
		addDefaultParentResizeEventListener(document.body);
		window.addEventListener("resize", onWindowResize, false);
		
		/* traverse all potential H2O Elements and convert them */
		elements = document.getElementsByClassName("H2O");
		for (var i = 0; i < elements.length; ++i) {
			debug("Found H2OElement: " + elements[i].tagName);
			
			H2O.Element(elements[i]);
			switch (elements[i].tagName) {
			case "IMG": /* terminal */
				H2O.Image(elements[i]); break;
			case "H6": /* terminal */
				H2O.Label(elements[i]); break;
			case "OL":
			case "UL":
				H2O.List(elements[i]); break;
			case "DIV":
			case "SPAN":
			case "VIDEO":
				/* DO NOTHING */ break;
			}
		}
		
		/* force resize */
		resizeEvent = document.createEvent("Event");
		resizeEvent.initEvent("parentresize", false, false);
		resizeEvent.width = document.width;
		resizeEvent.height = document.height;
		document.body.dispatchEvent(resizeEvent)
		
		/* Done */
		debug("Done Loading!");
	};
	
	/**
	 * Adds the default ParentResizeEvent listener that call
	 * @private
	 *///
	addDefaultParentResizeEventListener = function(node) {
		/* Add eventListener */
		if (node.nodeType == Node.ELEMENT_NODE) {
			node.addEventListener("parentresize", dispatchParentResizeEvent, false);				
		}
		/* traverse children */
		var children = node.childNodes;
		debug("Entering " + node.tagName + " who has " + children.length + " children");	
		for (var i = 0; i < children.length; ++i) {
			debug("child = " + i + ", nodeType = " + children[i].nodeType);
			addDefaultParentResizeEventListener(children[i]);
		}
		debug("Leaving " + node.tagName);
	}
	
	/**
	 *
	 *///
	dispatchParentResizeEvent = function(evt) {
		parent = evt.target;
		//debug(evt.target.tagName + " hypoteticaly resize here");
		
		var children = parent.childNodes;
		
		var resizeEvent = document.createEvent("Event");
		resizeEvent.initEvent("parentresize", false, false);
		
		/* offset doesn't include margin/border */
		var width = parent.offsetWidth;
		var height = parent.offsetHeight;
		
		/* parent's padding should be subtracted! */
		var pl = window.getComputedStyle(parent, null).getPropertyValue("padding-left").replace(/%|px/, "");
		var pr = window.getComputedStyle(parent, null).getPropertyValue("padding-right").replace(/%|px/, "");
		
		/* assume it was a percentage. BAD! */
		pl = pl / 100 * width;
		pr = pr / 100 * width;
		
		resizeEvent.width = width - (pl + pr);
		resizeEvent.height = height;
		
		for (i in children) {
			if (children[i].nodeType == Node.ELEMENT_NODE) {
				children[i].dispatchEvent(resizeEvent);
			}
		}
	}

	/**
	 * Triggers top most ParentResizeEvent
	 * @private
	 *///
	onWindowResize = function(evt) {
		//debug("WINDOW resize: " + document.width + "x" + document.height);
		resizeEvent = document.createEvent("Event");
		resizeEvent.initEvent("parentresize", false, false);
		resizeEvent.width = document.width;
		resizeEvent.height = document.height;
		document.body.dispatchEvent(resizeEvent);
	}
	
	window.addEventListener("load", initialize, true);
	window.H2O = H2O;
	
})();