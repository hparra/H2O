/**
* H2O.ListItem is the H2O-compliant version of <li>, HTMLLIElement.
*///
(function() {
	if (window.H2O.ListItem) return;

	/**
	* Contructs an H2O ListItem (<li>) element
	*///
	var ListItem = function() {
		return ListItem.extend(document.createElement("li"));
	}
	
	/**
	* Extends an <li> to have H2O features 
	*///
	ListItem.extend = function(node) {
		node.isH2O = true;
		return node;
	}
	
	window.H2O.ListItem = ListItem;
})();