// Pagecreate will fire for each of the pages in this demo
// but we only need to bind once so we use "one()"

var bands = []

$( document ).one( "pagecreate", ".demo-page", function() {
	// Initialize the external persistent header and footer
	$( "#header" ).toolbar({ theme: "b" });
	$( "#footer" ).toolbar({ theme: "b" });

	// Handler for navigating to the nope page
	function navNextRight( next) {

		$( ":mobile-pagecontainer" ).pagecontainer( "change", next + ".html", {
			transition: "slide",
            reverse: true
		});
		playAudio()
	}

    // Handler for navigating to the nope page
    function navNextLeft( next ) {

        $( ":mobile-pagecontainer" ).pagecontainer( "change", next + ".html", {
            transition: "slide"
        });
        playAudio()
    }

	function storeLike( thePage ) {
        bands.push(thePage.jqmData( "title" ))
    }

    function playAudio() {
        var audio = $("#audio-player");
        audio[0].play();
    }

	// Navigate to the next page on swipeleft
	$( document ).on( "swipeleft", ".ui-page", function( event ) {
		// Get the filename of the next page. We stored that in the data-next
		// attribute in the original markup.
		var next = $( this ).jqmData( "next" );

		// Check if there is a next page and
		// swipes may also happen when the user highlights text, so ignore those.
		// We're only interested in swipes on the page.
		if ( next && ( event.target === $( this )[ 0 ] ) ) {
			navNextLeft( next, "reverse" );
		}

	});

	// Navigate to the nope page when the "nope" button in the footer is clicked
	$( document ).on( "click", ".nope", function() {
		var next = $( ".ui-page-active" ).jqmData( "next" );

		// Check if there is a nope page
		if ( next ) {
			navNextRight( next );
		}
	});

	// The same for the navigating to the like page
	$( document ).on( "swiperight", ".ui-page", function( event ) {
		var next = $( this ).jqmData( "next" );
        storeLike($( this ))
		if ( next && ( event.target === $( this )[ 0 ] ) ) {

			navNextRight( next );
		}
	});

	$( document ).on( "click", ".like", function() {
		var next = $( ".ui-page-active" ).jqmData( "next" );

		storeLike($( ".ui-page-active" ))
		if ( next ) {
			navNextLeft( next );
		}
	});

    $( document ).on( "click", ".mute", function() {
        var audio = $("#audio-player");
        audio[0].pause();
    });

    $( document ).on( "click", ".play", function() {
        playAudio();
    });

});

$( document ).on( "pageshow", "#result", function() {

    for (var i = 0; i < bands.length; i++) {

        $( ".ui-body #band_"+ i ).text( bands[i] );
    }

	$( ".nope" ).addClass( "ui-state-hide" );
    $( ".like" ).addClass( "ui-state-hide" );

});

$( document ).on( "pageshow", ".demo-page", function() {

	var thePage = $( this ),
		title = thePage.jqmData( "title" ),
		next  = thePage.jqmData( "next" ),
    	song  = thePage.jqmData( "song" )

    function playSong(sourceUrl) {

        var audio = $("#audio-player");
        var source = $("#mpeg-src")
		var oldUrl = source.attr("src")

        if (sourceUrl !=  oldUrl){

            source.attr("src", sourceUrl);

        	audio[0].pause();
        	audio[0].load();//suspends and restores all audio element
        	audio[0].oncanplaythrough = function() { audio[0].play();}
        }
    }

    playSong(song)

	// Point the "Trivia" button to the popup for the current page.
	$( "#trivia-button" ).attr( "href", "#" + thePage.find( ".trivia" ).attr( "id" ) );

	// We use the same header on each page
	// so we have to update the title
	$( "#header h1" ).text( title );


	// Prefetch the nope page
	// We added data-dom-cache="true" to the page so it won't be deleted
	// so there is no need to prefetch it
	if ( next ) {
		$( ":mobile-pagecontainer" ).pagecontainer( "load", next + ".html" );
	}

	// We disable the nope or likeious buttons in the footer
	// if there is no nope or likeious page
	// We use the same footer on each page
	// so first we remove the disabled class if it is there
	$( ".nope.ui-state-disabled, .like.ui-state-disabled" ).removeClass( "ui-state-disabled" );

});
