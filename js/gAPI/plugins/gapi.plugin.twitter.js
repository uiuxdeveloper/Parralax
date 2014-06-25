////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TWITTER SHARE BUTTON                                                                                                 		  //
//																																  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	// Twitter Share Button
    $('#twitter-share').click(function(e){
        e.preventDefault();

        var title   = 'Mabinogi - Aces',
            url     = window.location;

        window.open('http://twitter.com/share?url=' + url + '&text=' + title + ' - ' + url + ' - via @twitter', 'twitterwindow', 
            'height=436, width=626'
        );
    });
});