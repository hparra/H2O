/*
* H2O
* http://www.w3.org/TR/DOM-Level-3-Events/
* Terminal tags: Hx, IMG, VIDEO
* Non-terminal tags: DIV, SPAN, UL, TABLE
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
		
		/* traverse all potential H2O Elements and convert them */
		elements = document.getElementsByClassName("H2O");
		for (i = 0; i < elements.length; ++i) {
			debug("Found H2OElement: " + elements[i].tagName);
			switch (elements[i].tagName) {
			case "IMG": /* terminal */
				H2O.Image(elements[i]); break;
			case "H6": /* terminal */
				H2O.Label(elements[i]); break;
			case "DIV":
			case "SPAN":
			case "VIDEO":
				/* DO NOTHING */ break;
			}
		}
		
		/* find H2O Elements and convert them */
		/*
		labels = document.getElementsByClassName("H2OLabel");
		for (i = 0; i < labels.length; ++i) {
			debug("Found H2OLabel: " + labels[i].innerHTML);
			H2O.Label(labels[i]);
		}
		*/
		
		/* find H2O Elements and convert them */
		/*
		images = document.getElementsByClassName("H2OImage");
		for (i = 0; i < images.length; ++i) {
			debug("Found H2OImage: " + images[i]);
			H2O.Image(images[i]);
		}
		*/
		
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