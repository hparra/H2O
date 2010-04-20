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
			console.debug("[H2O] " + str);
	}
	
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
		
		/* dimensions of parent in pixels */
		resizeEvent.width = parent.offsetWidth;
		resizeEvent.height = parent.offsetHeight;
		
		for (i in children) {
			if (children[i].nodeType == Node.ELEMENT_NODE) {
				children[i].dispatchEvent(resizeEvent);
			}
		}
	}
	
	H2O.onload = function() {
		/* add ParentResizeEvent listeners */
		addDefaultParentResizeEventListener(document.body);
		window.addEventListener("resize", H2O.onresize, false);
		
		/* find H2O Elements and convert them */
		labels = document.getElementsByClassName("H2OLabel");
		for (i = 0; i < labels.length; ++i) {
			debug("Found H2OLabel: " + labels[i].innerHTML);
			H2O.Label(labels[i]);
		}
		
		/* Done */
		debug("[Peroxide] Loaded");
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