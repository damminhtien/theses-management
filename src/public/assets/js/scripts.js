jQuery(document).ready(function() {
	
	/*
	    Navigation
	*/
	// toggle "navbar-no-bg" class
	$('.top-content .text').waypoint(function() {
		$('nav').toggleClass('navbar-no-bg');
	});
	
    /*
        Background slideshow
    */
    $('.top-content').backstretch(
        [
            "/assets/img/book.jpg",
            "/assets/img/book1.jpg",
            "/assets/img/book2.jpg"
        ],
        {
            transition:'pushLeft',
            fade: 1000, 
            overlay: {
                init: true,
                background: "#000",
                opacity: 0.7
            }
        }
    );
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$('.top-content').backstretch("resize");
    });
    
    /*
        Wow
    */
    new WOW().init();

    $("#inputSearch").focusin(function() {
        $(this).css("background-color", "rgba(255, 255, 255, 0.6)");
        $("#div_search_tool form").css("border", "1px solid white");
        $("#div_search_tool form").css({ "width": "70%", "transition": "2s" });
        $("#btnSearch").css("background-color", "rgba(255, 255, 255, 0.8)");

    })

    $("#inputSearch").focusout(function() {
        $(this).css("background-color", "transparent");
        $("#div_search_tool form").css("border", "none");
        $("#div_search_tool form").css({ "width": "60%", "transition": "2s" });
        $("#btnSearch").css("background-color", "transparent");
    })
	
    $('div.column, div.col-sm-3').hover(
        function() {
            $(this).find("p").css({"height": "100%", "transition": "1.5s" })
        }, function() {
             $(this).find("p").css({"height": "15%", "transition": "1.5s" })
        }
    );
});
