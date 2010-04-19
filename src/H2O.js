/*
* H2O
* http://www.w3.org/TR/DOM-Level-3-Events/
*/
(function() {
	if (window.H2O) return;
	
	var H2O = function() {

	}
	
	var DEBUG = true;
	function debug(str) {
		if (console && DEBUG)
			console.debug("[H20] " + str);
	}
	
	// add default listener on all childrem recurisvely
	// Breadth First, Post Order
	/*
	addDefaultParentResizeEventListener = function(node) {
		var children = node.childNodes;
		debug("Entering " + node.tagName + " who has " + children.length + " children");		
		for (var i = 0; i < children.length; ++i) {
			debug("child = " + i + ", nodeType = " + children[i].nodeType);
			if (children[i].nodeType == Node.ELEMENT_NODE) {
				children[i].addEventListener("parentresize", defaultDispatchParentResizeEvent, false);
				debug("Added listener to " + children[i].tagName + " (Child #" + i + ")");				
				addDefaultParentResizeEventListener(children[i]);
			}
		}
		debug("Leaving " + node.tagName);
	}
	*/
	addDefaultParentResizeEventListener = function(node) {
		/* Add eventListener */
		if (node.nodeType == Node.ELEMENT_NODE) {
			node.addEventListener("parentresize", defaultDispatchParentResizeEvent, false);				
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
	
	defaultDispatchParentResizeEvent = function(evt) {
		parent = evt.target;
		debug(evt.target.tagName + " hypoteticaly resize here");
		
		var children = parent.childNodes;
		resizeEvent = document.createEvent("Event");
		resizeEvent.initEvent("parentresize", false, false);
		resizeEvent.width = parent.width;
		resizeEvent.height = parent.height;
		for (i in children) {
			if (children[i].nodeType == Node.ELEMENT_NODE) {
				children[i].dispatchEvent(resizeEvent);
			}
		}
	}
	
	H2O.onload = function() {
		addDefaultParentResizeEventListener(document.body);
		window.addEventListener("resize", H2O.onresize, false);
		console.debug("[Peroxide] Loaded");
	}
	
	H2O.onresize = function(evt) {
		debug("WINDOW resize: " + document.width + "x" + document.height);
		resizeEvent = document.createEvent("Event");
		resizeEvent.initEvent("parentresize", false, false);
		resizeEvent.width = document.width;
		resizeEvent.height = document.height;
		document.body.dispatchEvent(resizeEvent);
	}
	
	window.H2O = H2O;
	window.addEventListener("load", H2O.onload, true);
	
})();