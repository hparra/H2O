/**
 * H2O
 */
(function() {
	if (typeof window.H2O === "undefined") {
		var H2O = window.H2O = {};
		
		H2O.CreateRandomID = function() {
			return Math.floor(Math.random()*9999999);
		}
	}
})();