// Fullsize Video Image - get height of window and update position of body content
$(document).ready(function() {
	$( '#video-img' ).css( { 'max-width': '100%', 'max-height': ($(window).height()-70) + 'px' } );
});