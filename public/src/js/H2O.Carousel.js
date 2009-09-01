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
	/** @private {Number} Total number of items in the carousel */
	var carouselLength = 0;
	/** @private {Number} Current page */
	var pageNum = 0;
	/** @private {Object} */
	var holder;
	/** @private {Object} */
	var box;
	/** @private {Object} */
	var icon;
	/** @private {Object} */
	var automaticscroll;
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
		
		data = options.data; // TODO: check data first and handle necessary stuff
		
		// DATA Checking

		size = 0;
		for (d in data) {
			if (d.imgsrc === undefined) {
				d.imgsrc = "https://armin.calit2.uci.edu/assets/luoa/icons/coolfuzz/8.png"; // TODO: find generic image
			}
			size = size + 1;					
		}
		
		self = document.createElement('div');
		self.setAttribute('id', options.ID);
		self.setAttribute('style','\
			width: 100%;\
			height: 100%;\
			overflow: hidden;\
		');	
		
		holder = document.createElement('div');
		holder.setAttribute('id', self.id + '_holder');
		holder.setAttribute('style','\
			height: 100%;\
			left: 0px;\
		');

		self.numOfPages = 0; // total number of pages initialized to 0
		pages = []; // pages array
		
		self.addpage = function() {
			x = document.createElement('div');
			x.setAttribute('id', options.ID + 'page' + self.numOfPages);
			x.setAttribute('class', 'page'); 
			x.setAttribute('style','float: left;');
			pages.push(x);
			holder.appendChild(pages[self.numOfPages]);
			self.numOfPages = self.numOfPages + 1;
		};
		
		self.addpage();
		self.appendChild(holder);
		
		//carouselLength = 0;
	 	pageNum = 0;

		self.carouselAppend = function(jsonobject) {
			if (carouselLength >= (options.rowAmt * options.columnAmt * (pageNum + 1))) {
				pageNum = pageNum + 1;
				self.addpage();
			}
			
			/* box */
            box = document.createElement('div');
            box.setAttribute('class', self.id + '_box');
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
            icon.setAttribute('class', self.id + '_icon'); // HGP: see above comment.
			icon.setAttribute('style', '\
				position: relative;\
				top: 50%;\
				left: 50%;\
			');
			
			if (jsonobject.imgsrc === undefined) { // Non-Images
				item = jsonobject;
				item.setAttribute('style', '\
					position: static;\
					border: none;\
					width: 100%;\
					height: 100%;\
				');
			} else { // Images
				item = document.createElement('img');
				item.setAttribute('src', jsonobject.imgsrc); 
				item.setAttribute('style', '\
					position: static;\
					border: none;\
					width: 100%;\
					height: 100%;\
				');			
			}
			
			
			icon.appendChild(item);
			//a.appendChild(icon);
            //box.appendChild(a);
			box.appendChild(icon);
			pages[pageNum].appendChild(box);
			carouselLength = carouselLength + 1;
		}
		
		if (data !== undefined) {
			for (i in data) {
				self.carouselAppend(data[i]);
			}
		}
		
		self.addEventListener("DOMNodeInserted", function(e) {
			if (self.parentNode.id !== undefined) {
				// console.debug("DOMNodeInserted: " + self.id);
				e.stopPropagation(); // cancel bubble
				window.addEventListener("resize", self.resize, false);
				self.resize();
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
	* grab current carousel size
	* @function
	* @returns {Number} number of items in carousel
	*/
	self.getCarouselLength = function() {
		return carouselLength;
	};
	
	/**
	* grab total number of pages
	* @function
	* @returns {Number} number of pages in carousel
	*/
	self.getNumOfPages = function() {
		return pageNum;
	}
	
	/**
	* resizes the image on window resize event
	* @function
	*/
	self.resize = function() {
		// console.debug(self.id + ".resize()");
		
		box_width_ratio = 1 / options.columnAmt; // Width / # of Columns = Box Width
		box_height_ratio = 1 / options.rowAmt; // Height / # of Rows = Box Height

        boxWidth = self.parentNode.offsetWidth * box_width_ratio;
        boxHeight = self.parentNode.offsetHeight * box_height_ratio;

		// ONLY GRAB SELF's child 'box'
		boxList = document.getElementsByClassName(self.id + '_box');

		for (b = 0; b < boxList.length; b = b + 1) {
			boxList[b].style.width = boxWidth + "px";
			boxList[b].style.height = boxHeight + "px";
		}

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
		}
		
		// HGP: we should make this an option of some kind. I'm not yet sure how I feel about it.
		// Where do you think we can use margin/padding appropriately without breaking other things?
		// Good branch later.
		/* Padding */
		// iconWidth = iconWidth * (1 - 0.25);
		// iconHeight = iconHeight * (1 - 0.25);
		
		iconWidth = iconWidth - (1 * options.padding);
		iconHeight = iconHeight - (1 * options.padding);
		
		/* Centering */
		iconList = document.getElementsByClassName(self.id + '_icon');
		for (i = 0; i < iconList.length; i = i + 1) {
			iconList[i].style.width = iconWidth + "px";
			iconList[i].style.height = iconHeight + "px";
			iconList[i].style.marginLeft = -iconWidth / 2 + "px";
			iconList[i].style.marginTop = -iconHeight / 2 + "px";
		}

		/* Reset each page size */
		for (p in pages) {
			pages[p].style.width = self.parentNode.offsetWidth + "px";
			pages[p].style.height = self.parentNode.offsetHeight + "px";
		}
		
		/* Reset Holder width */
		holder.style.width = self.parentNode.offsetWidth * self.numOfPages + "px";
		holder.style.marginLeft = ((currentPage - 1) * -self.parentNode.offsetWidth) + "px";
	};
	
	/**
	* takes an object directly or through jsonobject.imgsrc
	* @function
	* @param {Object} Object to be held in carousel
	*/
	self.addToCarousel = function(object) {
		self.carouselAppend(object);
		self.resize();
	}
	
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
				$('#' + self.id + '_holder').animate({
					"marginLeft" : ((page - 1) * -self.parentNode.offsetWidth)+"px"
				}, options.animSpeed);

				//holder.style.marginLeft = ((page - 1) * -self.parentNode.offsetWidth) + "px";
				currentPage = page; // Change Page "State"
			}
		} else if (page === currentPage) {
			// Shake Animation
		}
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
		clearTimeout(automaticscroll);
		self.jumpToPage(currentPage + 1);
		self.restartTimer();
	};
	
	self.restartTimer = function() {
		automaticscroll = setTimeout(self.autoScroll, options.scrollDelay);
	}
	
	document.onmousemove = function() {
		clearTimeout(automaticscroll);
		self.restartTimer();
	}
	
	document.onclick = function() {
		clearTimeout(automaticscroll);
		self.restartTimer();
	}
	
	/**
	* takes care of the autoscrolling
	*/
	if (options.autoScroll === true) {
		self.restartTimer();	
	}
		
	return self;
};