/**
* @param options
* H2O Carousel Options:
* options.ID: id for the carousel
* options.data: JSON data
* options.rowAmt: number of rows
* options.columnAmt: number of columns
* options.padding: amount of padding in percent
* options.animSpeed: how fast to slide carousel
* options.autoScroll: on or off
* options.scrollDelay: how long between scrolls
*/
H2O.Carousel = function(options) {
	/** @private H2O.Carousel Object */
	var self = null;
	/** @private {Array} Array storing each "page" of the carousel */
	var pages = null;
	/** @private JSON data */
	var data = null;
	/** @private {Number} Current carousel page */
	var currentPage = 1;
	
	/**
	* Power constructor for H2O.Carousel
	* @constructor
	*/
	(function() { // constructor
				
		// OPTIONS Checking
		// 
		// Checks for undefined parameters and sets default values
		// Default ID: "Carousel"
		// Default data: 
		// Default rowAmt: 1
		// Default columnAmt: 1
		// Default Padding: 5% 
		// Default animSpeed: 500 ms
		if (options.data === undefined) {
			// FIXME: Throw some kind of error?
		}
		if (options.ID === undefined) {
			options.ID = "Carousel"; 
		}
		if (options.rowAmt === undefined) {
			options.rowAmt = 1;
		}
		if (options.columnAmt === undefined) {
			options.columnAmt = 1;
		}
		if (options.padding === undefined) {
			options.padding = 20; // TODO: Figure out whether to use exact pixels or percentage
		}
		if (options.animSpeed === undefined) {
			options.animSpeed = 500;
		}
		if (options.autoScroll === undefined) {
			options.autoScroll = false;
		}
		if (options.scrollDelay === undefined) {
			options.scrollDelay = 5000;
		}
		
		data = options.data // TODO: check data first and handle necessary stuff
		
		// DATA Checking
		//
		// Checks for undefined parameters and sets default values
		// Default Thumbnail:  
		// Default Title: ""
		// Default Length: ?
		size = 0
		for (d in data) {
			if (d.thumb === undefined) {
				d.thumb = "https://armin.calit2.uci.edu/assets/luoa/icons/coolfuzz/8.png"; // TODO: find generic image
			}
			if (d.title === undefined) {
				d.title = "";
			}
			if (d.length === undefined) {
				d.length = "?";
			}
			size = size + 1;					
		}
		
		// HGP: Hmmm... which one of these two should really be _self_?
		
		self = document.createElement('div');
		self.setAttribute('id', options.ID);
		self.setAttribute('style','\
			width: 100%;\
			height: 100%;\
			overflow: hidden;\
		');	
		
		holder = document.createElement('div');
		holder.setAttribute('id', options.ID + 'holder');
		holder.setAttribute('style','\
			height: 100%;\
			left: 0px;\
		');
		// HGP: Isn't this implied by pages.length?
		// ALLEN: The array 'pages' doesn't know how long it should be without calculating based on the formula below. It's initialized as null. 
		self.numOfPages = Math.ceil(size / (options.rowAmt * options.columnAmt)); // TODO: Make this private?

		// pages = []; // pages array
		// for (p = 1; p <= self.numOfPages; p = p + 1) {
		// 	// pages.push() should work
		// 	pages[p] = document.createElement('div');
		// 	pages[p].setAttribute('id', 'page' + p);
		// 	pages[p].setAttribute('class', 'page'); 
		// 	pages[p].setAttribute('style','float: left;');
		// 	holder.appendChild(pages[p]);
		// };
		
		// Not sure if this is how you wanted me to use the stack feature
		pages = []; // pages array
		for (p = 1; p <= self.numOfPages; p = p + 1) {
			x = document.createElement('div');
			x.setAttribute('id', options.ID + 'page' + p);
			x.setAttribute('class', 'page'); 
			x.setAttribute('style','float: left;');
			pages.push(x);
			holder.appendChild(pages[p-1]);
		};

		self.appendChild(holder);
		
		pageNum = 0;
				
		for (i in data) {
			if (i >= (options.rowAmt * options.columnAmt * (pageNum + 1))) {
				pageNum = pageNum + 1;
			};
		
            /* box */
            box = document.createElement('div');
            box.setAttribute('class', 'box');
			box.setAttribute('style','\
				position: static;\
				clear: none;\
				float: left;\
				overflow: hidden;\
				display: block;\
			');
			
			// HGP: I would disregard the Frescolita business
			// this needs to check if a HREF exists in data
			// we may also have an onclick value in the data

            // /* a */
            // a = document.createElement('a');
			// TODO: Make this grab the link and load video and/or do some cool effect
			//a.setAttribute('onclick', "Frescolita.StateManager.states['HOME'].startWidget('" + href + "')");
			// a.setAttribute('style', '\
			// 						position: static;\
			// 						width: 100%;\
			// 						height: 100%;\
			// 						display: block;\
			// 						border: none;\
			// 					');
			
            /* icon */
            icon = document.createElement('div');
            icon.setAttribute('class', 'icon'); // HGP: see above comment.
			icon.setAttribute('style', '\
				position: relative;\
				top: 50%;\
				left: 50%;\
			');
			
			// HGP: they may not be images in the future.
			// they maybe canvases or iframes
			
            /* this loads slowly the first time. should preload. */
            img = document.createElement('img');
            img.setAttribute('alt', data[i].title + " " + data[i].length); 
            img.setAttribute('src', data[i].thumb); 
			img.setAttribute('style', '\
				position: static;\
				border: none;\
				width: 100%;\
				height: 100%;\
			');			
			
			icon.appendChild(img);
			//a.appendChild(icon);
            //box.appendChild(a);
			box.appendChild(icon);
			pages[pageNum].appendChild(box);
		}
	
		self.addEventListener("DOMNodeInserted", function(e) {
			//console.log(self.parentNode);
			if ((self.parentNode.id) === undefined) {
				// the hell? it fires twice and the first time is no good.
				// it's a DocumentFragment, from I don't know where
			} else {
				e.stopPropagation(); // cancel bubble
				self.resize();
				window.addEventListener("resize", self.resize, false);
			}
		}, false);
	})();

	/**
	* grab current page number
	* @function
	* @returns {Number} current page number
	*/
	self.getCurrentPage = function() {
		return currentPage;
	};
	
	/**
	* resizes the image on window resize event
	* @function
	*/
	self.resize = function() {
		box_width_ratio = 1 / options.columnAmt; // Width / # of Columns = Box Width
		box_height_ratio = 1 / options.rowAmt; // Height / # of Rows = Box Height

        boxWidth = self.parentNode.offsetWidth * box_width_ratio;
        boxHeight = self.parentNode.offsetHeight * box_height_ratio;
		boxList = document.getElementsByClassName('box');
		for (b = 0; b < boxList.length; b = b + 1) {
			boxList[b].style.width = boxWidth + "px";
			boxList[b].style.height = boxHeight + "px";
		};

		iconWidth = 0;
		iconHeight = 0;
		if (boxWidth >= boxHeight) {
		    /* Landscape */
		    iconWidth = boxHeight;
		    iconHeight = boxHeight;
		} else {
		    /* Portrait */
		    iconWidth = boxWidth;
		    iconHeight = boxWidth;
		};
		
		// HGP: we should make this an option of some kind. I'm not yet sure how I feel about it.
		// Where do you think we can use margin/padding appropriately without breaking other things?
		// Good branch later.
		/* Padding */
		// iconWidth = iconWidth * (1 - 0.25);
		// iconHeight = iconHeight * (1 - 0.25);
		
		iconWidth = iconWidth - (1 * options.padding);
		iconHeight = iconHeight - (1 * options.padding);
		
		/* Centering */
		iconList = document.getElementsByClassName('icon');
		for (i = 0; i < iconList.length; i = i + 1) {
			iconList[i].style.width = iconWidth + "px";
			iconList[i].style.height = iconHeight + "px";
			iconList[i].style.marginLeft = -iconWidth / 2 + "px";
			iconList[i].style.marginTop = -iconHeight / 2 + "px";
		};

		/* Reset each page size */
		for (p in pages) {
			pages[p].style.width = self.parentNode.offsetWidth + "px";
			pages[p].style.height = self.parentNode.offsetHeight + "px";
		};
		
		/* Reset Holder width */
		holder.style.width = self.parentNode.offsetWidth * self.numOfPages + "px";
		holder.style.marginLeft = ((currentPage - 1) * -self.parentNode.offsetWidth) + "px";
	};
	
	/**
	* Jump to specified page number
	* @function
	* @param {Number} page The desired page to jump to
	*/
	self.jumpToPage = function(page) {
		if (page != currentPage) {
			if (page < 1) {
				// Shake Animation
			} else if (page > self.numOfPages) {
				// Shake Animation
				self.jumpToPage(1);
			} else {
				
				// HGP: This is going to be a challenge...
				// we may end up having to create our own transition library :P
				// which makes sense because we can standardize them
				// 
				$('#' + options.ID + 'holder').animate({
					"marginLeft" : ((page - 1) * -self.parentNode.offsetWidth)+"px"
				}, options.animSpeed);

				//holder.style.marginLeft = ((page - 1) * -self.parentNode.offsetWidth) + "px";
				currentPage = page; // Change Page "State"
			};
		} else if (page === currentPage) {
			// Shake Animation
		}
		console.log(currentPage);
	};
	
	/**
	* go forward a number of pages
	* @function
	* @param {Number} interval The number of pages to jump forward
	*/
	self.nextPage = function(interval) { // Go forward interval number of pages
		if (interval === undefined) {
			interval = 1;
		}
		self.jumpToPage(currentPage + interval);
	};
	
	/**
	* go backward a number of pages
	* @function
	* @param {Number} interval The number of pages to jump backward
	*/
	self.prevPage = function(interval) { // Go backward interval number of pages
		if (interval === undefined) {
			interval = 1;
		}
		self.jumpToPage(currentPage - interval);
	};
	/**
	* automatically scrolls forward 1 page every options.scrollDelay number of seconds
	* @function
	*/
	self.autoScroll = function() { // Go forward interval number of pages
		console.log(currentPage);
		self.jumpToPage(currentPage + 1);
	};
	
	/**
	* takes care of the autoscrolling
	*/
	if (options.autoScroll === true) {
		setInterval(self.autoScroll, options.scrollDelay);		
	}
		
	return self;
};