// Nav Scroll To ID
$(document).ready(function() {
    $( '.btn-nav' ).click( function( event ){
        event.preventDefault();

        if($('.btn-nav-animate').length == 0){
            $(this).addClass('btn-nav-animate');

            var currentKey = $(this).attr('href'),
            	currentKey = currentKey.split('#rc'),
    	        currentKey = currentKey[1]*1,
    	        prevKey = currentKey-1,
    	        nextKey = currentKey+1;

            // remove active classes
            $('.btn-nav').removeClass('active');

            if( $(this).attr('id') == "nav-prev" || $(this).attr('id') == "nav-next" )
            	$("#nav-rc" + currentKey).addClass('active');
            else
            	$(this).addClass('active');
            
            // scroll to body id element
            $('html, body').animate({
                scrollTop: $( $(this).attr('href') ).offset().top
            }, {
                duration: 1000,
                complete:  function() { 
                    $('.btn-nav-animate').removeClass('btn-nav-animate'); 
                } 
            });

            // show hide prev/next arrows
            if(prevKey > 0)
            	$('#nav-prev').attr('href', "#rc" + prevKey).css({'visibility':'visible'});
            else
            	$('#nav-prev').attr('href', "#rc" + prevKey).css({'visibility':'hidden'});
            	

            if(nextKey < 5)
            	$('#nav-next').attr('href', "#rc" + nextKey).css({'visibility':'visible'});
           	else
           		$('#nav-next').attr('href', "#rc" + nextKey).css({'visibility':'hidden'});
        }
    });
});

// Navigation Controls
    // window scroll adjustment
    $(window).scroll(function () {
        var currentYPos = $(window).scrollTop();

        if($('.btn-nav-animate').length == 0){
            if ((currentYPos < 800)) {
                $(".btn-nav").removeClass("active");
                $("#nav-rc1").addClass("active");
                $("#nav-prev").attr('href', "#rc0").css({'visibility':'hidden'});
                $("#nav-next").attr('href', "#rc2").css({'visibility':'visible'});
            }
            if ((currentYPos >= 900)) {
                $(".btn-nav").removeClass("active");
                $("#nav-rc2").addClass("active");
                $("#nav-prev").attr('href', "#rc1").css({'visibility':'visible'});
                $("#nav-next").attr('href', "#rc3").css({'visibility':'visible'});
            }
            if ((currentYPos >= 1800)) {
                $(".btn-nav").removeClass("active");
                $("#nav-rc3").addClass("active");
                $("#nav-prev").attr('href', "#rc2").css({'visibility':'visible'});
                $("#nav-next").attr('href', "#rc4").css({'visibility':'visible'});
            }
            if ((currentYPos >= 2600)) {
                $(".btn-nav").removeClass("active");
                $("#nav-rc4").addClass("active");
                $("#nav-prev").attr('href', "#rc3").css({'visibility':'visible'});
                $("#nav-next").attr('href', "#rc5").css({'visibility':'hidden'});
            }
        }
    });
// END: Navigation Controls