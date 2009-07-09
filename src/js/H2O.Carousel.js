H2O.Carousel = function(options) {
	var self = null;
	var pages = null;
	var data = null;
	var currentPage = 1;
	
	(function() { // constructor
		
		data = options.JSON // TODO: check data first and handle necessary stuff
		
		size = 0;
		for (i in data) {
			size = size + 1;
		}
		
		self = document.createElement('div');
		self.setAttribute('id', options.id);
		self.setAttribute('class', 'page'); 
		self.setAttribute('style','\
			width: 100%;\
			height: 95%;\
			overflow: hidden;\
		');	
		
		holder = document.createElement('div');
		holder.setAttribute('id', 'holder');
		holder.setAttribute('style','\
			height: 100%;\
			left: 0px;\
		');
		
		self.numOfPages = Math.ceil(size / (options.rowAmt * options.columnAmt)); // TODO: Make this private?

		pages = []; // pages array
		for (p = 1; p <= self.numOfPages; p = p + 1) {
			x = document.createElement('div');
			x.setAttribute('id', 'page' + p);
			x.setAttribute('class', 'page'); 
			x.setAttribute('style','float: left;');
			pages[p] = x;
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
            box.setAttribute('class', 'box');

			//             /* a */
			//             a = document.createElement('a');
			// 	
			// // TODO: Make this grab the link and load video and/or do some cool effect
			// //a.setAttribute('onclick', "Frescolita.StateManager.states['HOME'].startWidget('" + href + "')");

            /* icon */
            icon = document.createElement('div');
            icon.setAttribute('class', 'icon');

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
		
		/* Padding */
		iconWidth = iconWidth * (1 - 0.25);
		iconHeight = iconHeight * (1 - 0.25);

		/* Centering */
		iconList = document.getElementsByClassName('icon');
		for (i = 0; i < iconList.length; i = i + 1) {
			iconList[i].style.width = iconWidth;
			iconList[i].style.height = iconHeight;
			iconList[i].style.marginLeft = -iconWidth / 2;
			iconList[i].style.marginTop = -iconHeight / 2;
		};

		/* Reset each page size */
		for (p in pages) {
			pages[p].style.width = self.parentNode.offsetWidth;
			pages[p].style.height = self.parentNode.offsetHeight;
		};
		
		/* Reset Holder width */
		holder.style.width = self.parentNode.offsetWidth * self.numOfPages;
		holder.style.marginLeft = (self.currentPage - 1) * -self.parentNode.offsetWidth;
	};
	
	self.jumpToPage = function(page) {	
		if (page != currentPage) {
			if (page < 1) {
				alert("That page doesn't exist -> " + page);
			} else if (page > self.numOfPages) {
				alert("That page doesn't exist -> " + page);
			} else {
				// $('#Holder').animate({
				// 					"marginLeft" : ((page - 1) * -self.parentNode.offsetWidth)+"px"
				// 				}, 800);
				holder.style.marginLeft = ((page - 1) * -self.parentNode.offsetWidth)+"px";
				currentPage = page; // Change Page "State"
			};
		} else if (page === currentPage) {
			// TODO: find better way to notify this
			alert("You're already here!");
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

