H2O.Carousel = function(options) {
	var self = null; // H2O.Carousel Object
	var pages = null; // Array storing each "page" of the carousel
	var data = null; // JSON data
	var currentPage = 1; // Current Carousel State
	
	(function() { // constructor

		data = options.data // TODO: check data first and handle necessary stuff
		
		size = 0;
		for (i in data) {
			size = size + 1;
		}
		
		// HGP: Hmmm... which one of these two should really be _self_?
		
		self = document.createElement('div');
		self.setAttribute('id', options.id);
		//self.setAttribute('class', 'page'); // HGP: if anything, this should be 'H2O_Carousel' 
		self.setAttribute('style','\
			width: 100%;\
			height: 100%;\
			overflow: hidden;\
		');	
		
		holder = document.createElement('div');
		holder.setAttribute('id', 'holder');
		holder.setAttribute('style','\
			height: 100%;\
			left: 0px;\
		');
		// HGP: Isn't this implied by pages.length?
		// ALLEN: The array 'pages' doesn't know how long it should be without calculating based on the formula below. It's initialized as null. 
		self.numOfPages = Math.ceil(size / (options.rowAmt * options.columnAmt)); // TODO: Make this private?

		pages = []; // pages array
		for (p = 1; p <= self.numOfPages; p = p + 1) {
			// pages.push() should work
			pages[p] = document.createElement('div');
			pages[p].setAttribute('id', 'page' + p);
			pages[p].setAttribute('class', 'page'); 
			pages[p].setAttribute('style','float: left;');
			holder.appendChild(pages[p]);
		};
		
		self.appendChild(holder);
		
		pageNum = 1;
		
		for (i in data) {
			if (i >= (options.rowAmt * options.columnAmt * pageNum)) {
				pageNum = pageNum + 1;
			};
		
            /* box */
            box = document.createElement('div');
            box.setAttribute('class', 'box');  // HGP: don't use external CSS, at least not yet. See note.

			// HGP: I would disregard the Frescolita business
			// this needs to check if a HREF exists in data
			// we may also have an onclick value in the data

			//             /* a */
			//             a = document.createElement('a');
			// 	
			// // TODO: Make this grab the link and load video and/or do some cool effect
			// //a.setAttribute('onclick', "Frescolita.StateManager.states['HOME'].startWidget('" + href + "')");

            /* icon */
            icon = document.createElement('div');
            icon.setAttribute('class', 'icon'); // HGP: see above comment.

			// HGP: they may not be images in the future.
			// they maybe canvases or iframes

            /* this loads slowly the first time. should preload. */
            img = document.createElement('img');
            img.setAttribute('alt', data[i].title + " " + data[i].length); 
            img.setAttribute('src', data[i].thumb); 

            icon.appendChild(img);
            //a.appendChild(icon);
            //box.appendChild(a);
			box.appendChild(icon);
			pages[pageNum].appendChild(box);
		}
	
		self.addEventListener("DOMNodeInserted", function(e) {
			console.log(self.parentNode);
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

	self.getCurrentPage = function() {
		return currentPage;
	};
	
	self.resize = function() {
		box_width_ratio = 1 / options.columnAmt; // Width / # of Columns = Box Width
		box_height_ratio = 1 / options.rowAmt; // Height / # of Rows = Box Height

        boxWidth = self.parentNode.offsetWidth * box_width_ratio;
        boxHeight = self.parentNode.offsetHeight * box_height_ratio;
		boxList = document.getElementsByClassName('box');
		for (b = 0; b < boxList.length; b = b + 1) {
			boxList[b].style.width = boxWidth;
			boxList[b].style.height = boxHeight;
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
		iconWidth = iconWidth * (1 - 0.25);
		iconHeight = iconHeight * (1 - 0.25);

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
	
	self.jumpToPage = function(page) {
		// HGP: alerts are very bad! Take out.
		if (page != currentPage) {
			if (page < 1) {
				// Shake Animation
			} else if (page > self.numOfPages) {
				// Shake Animation
			} else {
				
				// HGP: This is going to be a challenge...
				// we may end up having to create our own transition library :P
				// which makes sense because we can standardize them
				// 
				// $('#Holder').animate({
				// 					"marginLeft" : ((page - 1) * -self.parentNode.offsetWidth)+"px"
				// 				}, 800);

				holder.style.marginLeft = ((page - 1) * -self.parentNode.offsetWidth) + "px";
				currentPage = page; // Change Page "State"
			};
		} else if (page === currentPage) {
			// Shake Animation
		}
		console.log(currentPage);
	};
	
	self.nextPage = function(interval) { // Go forward interval number of pages
		console.log(interval);
		if (interval === undefined) {
			interval = 1;
		}
		self.jumpToPage(currentPage + interval);
	};
	
	self.prevPage = function(interval) { // Go backward interval number of pages
		console.log(interval);
		if (interval === undefined) {
			interval = 1;
		}
		self.jumpToPage(currentPage - interval);
	};
	
	return self;
};

