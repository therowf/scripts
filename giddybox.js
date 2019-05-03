
        /*
        *
        * Giddybox Alpha 0.99
        * © 2017 The GiddyUp Group, LLC ALL RIGHTS RESERVED
        *
        * How to use:
        * giddybox('id','loading','borderless');                                                                                                                        —— Standard mode
        * giddybox('youtube-id','autoplay','controls');                                                                                                                 —— YouTube mode
        *
        */

        // Prepare the canvas - hide referenced elements
        jQuery(function(){

            // Hide .hidden
            jQuery('.hidden').hide();

            // Check anchor tags for giddyboxes
            jQuery('a').each(function() {
                if ( jQuery(this).attr('href') != null ) { // If contains href
                    var href = jQuery(this).attr('href');
                    if ( ~href.indexOf('giddybox-') ) { // If href contains giddybox
                        href = href.split('giddybox-')[1];
                        if ( ~href.indexOf('?') ) { href = href.split('?')[0]; }
                        jQuery(this).removeAttr('href');
                        jQuery(this).attr('onclick','giddybox("'+href+'");');
                    }
                }
            });

            // If onclick contains giddybox
            /*jQuery('[onclick]').each(function() {
                var id = jQuery(this).attr('onclick');
                if (~id.indexOf('#')) { id = id.replace('#',''); }                                                                                                      // If id/el contains #
                if (~id.indexOf("giddybox")) { id = id.split("'")[1]; jQuery('#'+id).hide(); }
            });*/
        });

        // Kickstart the Giddybox
        function giddybox(el, loading, border) {
            jQuery(function(){

                // Build the Giddybox (if it doesn't exist)
                if( !jQuery('#giddybox').length ) {
                    jQuery('body').append('<div id="giddybox"><div id="giddybox-wrapper" class="animated"><div id="giddybox-innerWrapper"></div></div></div>');         // Create a Giddybox
                    jQuery('#giddybox-wrapper').wrap('<div class="center-giddybox"><div class="center-anchor"></div></div>');                                           // Center the content
                    jQuery('#giddybox-wrapper').append('<a class="giddybox-closeBtn">X</a>');                                                                           // Create the close button
                } else {
                    jQuery('#giddybox').removeClass('fullwidth fullheight youtube'); }                                                                                  // Clean up

                var                 // Define all variables
                giddybox        =   jQuery('#giddybox'),
                wrapper         =   jQuery('#giddybox-wrapper'),
                innerWrapper    =   jQuery('#giddybox-innerWrapper');

                // Show the Giddybox
                giddybox.fadeIn();
                setTimeout(function() {                                                                                                                                 // Added time needed to finish processes
                    if ( giddybox.find('iframe').length ) {                                                                                                             // — If iframe is detected —
                        if ( loading == 'loading' || loading == 'true' || loading == 1 ) {                                                                                              // If it has loading option
                            innerWrapper.css('overflow','hidden');                                                                                                      // Remove scrollbars
                            // Loading animation
                            giddybox.prepend('<div class="loading"><div class="center"><div class="center-anchor"><div class="bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div></div></div></div>');
                            jQuery('#giddybox .loading').fadeIn();
                            // After loaded
                            giddybox.find('iframe').on('load', function(){                                                                                              // Wait for iframe to load
                                if ( giddybox.find('iframe').height() > 1000 ) { wrapper.height('1000px'); }                                                            // If iframe is too tall
                                wrapper.addClass('fadeInUp').css('opacity','1');                                                                                        // Fade in
                                setTimeout(function() { jQuery('#giddybox .loading').remove(); }, 1000);                                                                // Remove loading animation
                            });
                        } else if ( giddybox.find('iframe').attr('src').indexOf('youtube') !== -1 ) {                                                                   // — If iframe contains youtube
                            var wWidth = jQuery(window).width() - 40;
                            wrapper.addClass('fadeInUp').css('opacity','1');                                                                                            // Fade in
                            innerWrapper.css('overflow','hidden');                                                                                                      // Remove scrollbars
                            giddybox.addClass('youtube');

                            if ( giddybox.find('iframe').width() > wWidth ) { giddybox.find('iframe').attr('width',wWidth); }                                           // — If iframe is larger than window —
                        } else {                                                                                                                                        // — Or else —
                            wrapper.addClass('fadeInUp').css('opacity','1');                                                                                            // Fade in
                            innerWrapper.css('overflow','hidden');                                                                                                      // Remove scrollbars
                        }
                        if ( border == 'borderless' || border == 'false' ) {
                            wrapper.addClass('borderless');
                        }
                    } else { wrapper.addClass('fadeInUp').css('opacity','1'); }
                }, 300);

                // Close the Giddybox
                function closeGiddybox() {
                    giddybox.fadeOut();
                    if ( innerWrapper.find('iframe').length ) { jQuery('body').css('overflow','auto'); }                                                                // Re-enable scroll on iframe
                    setTimeout(function() {
                        // Clean up
                        var content = innerWrapper.html();

                        if ( !jQuery('#giddybox-storage').length && !innerWrapper.find('iframe').length ) {
                            jQuery('#giddybox').after('<div id="giddybox-storage">'+content+'</div>');
                        } else if ( !innerWrapper.find('iframe').length ) {
                            jQuery('#giddybox-storage').append(content); }

                        innerWrapper.empty();

                        // Reset
                        giddybox.removeClass('fullsize youtube');
                        wrapper.removeClass('fadeInUp').css('opacity','0');

                        wrapper.removeAttr('style');                                                                                                                    // Reset attributes
                        innerWrapper.removeAttr('style');
                    }, 500);
                }

                // Close the Giddybox btn
                jQuery('.giddybox-closeBtn').on('click',function() { closeGiddybox(); });

                // Close if click outside of wrapper
                // jQuery(document).on('mouseup touchstart',function(e) { if (!wrapper.is(e.target) && wrapper.has(e.target).length === 0 && wrapper.is(':visible') ) { closeGiddybox(); } });

                // Add inline content to Giddybox
                jQuery.fn.outerHTML = function() { return jQuery('<div />').append(this.eq(0).clone()).html(); };                                                       // OuterHTML Fn

                if (~el.indexOf('#')) {                                                                                                                                 // If el contains #
                    var content = jQuery(el).outerHTML();
                    jQuery(el).remove();
                } else {                                                                                                                                                // If it doesn't contain # add it in
                    var content = jQuery('#'+el).outerHTML();
                    jQuery('#'+el).remove(); }

                innerWrapper.empty().append(content);                                                                                                                   // Add content

                // YouTube player
                if (~el.indexOf('youtube')) {
                    var autoplay = 0,
                        controls = 0,
                        id = el.toString().split(/-(.+)/)[1];                                                                                                               // Get YouTube Video ID

                    // Set GiddyBox in YouTube mode
                    giddybox.addClass('youtube');

                    // Set params
                    if ( loading == 'true' || loading == 'autoplay' ) { autoplay = 1; }
                    if ( border == 'true' || loading == 'controls' ) { controls = 1; }

                    // Add Video
                    innerWrapper.empty().append('<iframe id="' + id + '" enablejsapi="1" width="800" height="450" src="https://www.youtube.com/embed/'+id+'?rel=0&controls='+controls+'&showinfo=0&autoplay='+autoplay+'" frameborder="0" allowfullscreen></iframe>');

                    // Hook up analytics event generation to the video
                    if (gu_youtubeAPILoaded) {
                        gu_initvideo(id);
                    } else {
                        gu_uninitializedYoutubeVideos.push(id);
                    }
                }

                // Resize if wider than window
                setTimeout(function() {
                    var ogWidth = parseInt(wrapper.width());

                    jQuery(window).on('resize',function() {
                        var wWidth = parseInt(jQuery(window).width()) - 60,
                            gWidth = parseInt(wrapper.width());

                        if ( wWidth <= gWidth && wWidth <= ogWidth ) {
                            giddybox.addClass('fullwidth');
                        } else if ( wWidth >= ogWidth ) {
                            giddybox.removeClass('fullwidth');
                        }
                    }).resize();
                }, 500);

                // Resize if taller than window
                setTimeout(function() {
                    var ogHeight = parseInt(wrapper.height());

                    jQuery(window).on('resize',function() {
                        var wHeight = parseInt(jQuery(window).height()) - 60,
                            gHeight = parseInt(wrapper.height());

                        if ( wHeight <= gHeight && wHeight <= ogHeight ) {
                            giddybox.addClass('fullheight');
                        } else if ( wHeight >= ogHeight ) {
                            giddybox.removeClass('fullheight');
                        }
                    }).resize();
                }, 500);

                // Prevent scroll
                innerWrapper.on('DOMMouseScroll mousewheel scroll touchmove', function(ev) {
                    var $this = jQuery(this), scrollTop = this.scrollTop, scrollHeight = this.scrollHeight, height = $this.height(), delta = (ev.type == 'DOMMouseScroll' ? ev.originalEvent.detail * -40 : ev.originalEvent.wheelDelta), up = delta > 0,
                    prevent = function() { ev.stopPropagation(); ev.preventDefault(); ev.returnValue = false; return false; }

                    // When reached bottom of element
                    if (!up && -delta > scrollHeight - height - scrollTop) { $this.scrollTop(scrollHeight); return prevent();

                    // When reached top of element
                    } else if (up && delta > scrollTop) { $this.scrollTop(0); return prevent(); }
                });

                // Prevent scroll on iframe
                if ( innerWrapper.find('iframe').length ) { jQuery('body').css({'width':'100%','height':'100%','overflow':'hidden'}); }

            }); // end jQuery block
        } // end giddybox fn
