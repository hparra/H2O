var rows = 2;
var columns = 2;
var JSON;

function FCarouselHeight() {
	return document.getElementById("FCarousel").offsetHeight;
}

function FCarouselWidth() {
	return document.getElementById("FCarousel").offsetWidth;
}

function carouselElements(input) {
	size = 0;
	for (i in input) {
		size = size + 1;
	}
	return size;
}

function carouselPages(input) {
	size = carouselElements(input);
	return Math.ceil(size / (rows * columns));
}

function buildpages() {
	htmlstring = '\n';
	pages = carouselPages(JSON);
	for (p = 1; p <= pages; p = p + 1) {
		htmlstring = htmlstring + '<div id="page' + p + '" class="page"></div>';
	}
	return htmlstring;
}

var FCarousel = {
	/* initialize at 1 page */
	numOfPages: 1,
	/* initialize at page 1 */
	currentPage: 1, 
	
	preinitialize: function(JSONobject) {
		/* grab data from JSON file */
		JSON = JSONobject;
		FCarousel.numOfPages = carouselPages(JSON);
		/* build html */
		$('#Holder').html(buildpages());
		FCarousel.initialize();
		FCarousel.resize();	
	},
    
	initialize: function() {
		
		/* Page number the item will live on*/
		pageNum = 1;

        for (i in JSON) {
			
			/* if page is full, go to next page */
			if (i >= (rows * columns * pageNum)) {
				pageNum = pageNum + 1;
			}

            /* box */
            box = document.createElement('div');
            box.setAttribute('class', 'box');

            /* a */
            a = document.createElement('a');
			
			// TODO: Make this grab the link and load video and/or do some cool effect
			//a.setAttribute('onclick', "Frescolita.StateManager.states['HOME'].startWidget('" + href + "')");

            /* icon */
            icon = document.createElement('div');
            icon.setAttribute('class', 'icon');

            /* this loads slowly the first time. should preload. */
            img = document.createElement('img');
            img.setAttribute('alt', JSON[i].title + " " + JSON[i].length); 
            img.setAttribute('src', JSON[i].thumb); 

            icon.appendChild(img);
            a.appendChild(icon);
            box.appendChild(a);
			if (pageNum > 1) {
				//$('#page'+pageNum).append(box).hide();
				$('#page'+pageNum).append(box);
			} else {
				$('#page'+pageNum).append(box);
			}
        };

		$('.page').css({
			'width' : FCarouselWidth(),
			'height' : FCarouselHeight()
		});
		
		$('#Holder').css("width",FCarouselWidth() * FCarousel.numOfPages);
    },

    resize: function() {

		box_width_ratio = 1 / columns; // Width / # of Columns = Box Width
		box_height_ratio = 1 / rows; // Height / # of Rows = Box Height

        boxWidth = FCarouselWidth() * box_width_ratio;
        boxHeight = FCarouselHeight() * box_height_ratio;
        $(".box").width(boxWidth);
        $(".box").height(boxHeight);

        iconWidth = 0;
        iconHeight = 0;
        if (boxWidth >= boxHeight) {
            /* Landscape */
            iconWidth = boxHeight;
            iconHeight = boxHeight;
        }
        else {
            /* Portrait */
            iconWidth = boxWidth;
            iconHeight = boxWidth;
        }

        /* Padding */
        iconWidth = iconWidth * (1 - 0.25);
        iconHeight = iconHeight * (1 - 0.25);

        /* Centering */
        $(".icon").css("width", iconWidth);
        $(".icon").css("height", iconHeight);
        $(".icon").css("marginLeft", -iconWidth / 2);
        $(".icon").css("marginTop", -iconHeight / 2);
		
		/* Reset each page size */
		$('.page').css({
			'width' : FCarouselWidth(),
			'height' : FCarouselHeight()
		});
		/* Reset Holder width */
		$('#Holder').css("width", FCarouselWidth() * FCarousel.numOfPages);
		/* Reset Holder marginLeft */
		$('#Holder').css("marginLeft", (FCarousel.currentPage - 1) * -FCarouselWidth());
    },
	
	jumpToPage: function(page) {	
		if (page != FCarousel.currentPage) {
			if (page < 1) {
				alert("That page doesn't exist -> " + page);
			} else if (page > FCarousel.numOfPages) {
				alert("That page doesn't exist -> " + page);
			} else {
				$('#Holder').animate({
					"marginLeft" : ((page - 1) * -FCarouselWidth())+"px"
				}, 800);
			};
		} else if (page === FCarousel.currentPage) {
			// TODO: find better way to notify this
			alert("You're already here!");
		}
		FCarousel.currentPage = page; // Change Page "State"
	},
	
	nextPage: function(interval) { // Go forward interval number of pages
		FCarousel.jumpToPage(FCarousel.currentPage + interval);
	},
	
	prevPage: function(interval) { // Go backward interval number of pages
		FCarousel.jumpToPage(FCarousel.currentPage - interval);
	}
};