function getDomain() {
  var parts = document.location.hostname.toLowerCase().split('.');
  var domain = parts.slice(-2).join('.');

  return domain;
}
gu_deparam = function gu_deparam(querystring) {
  var params = [];
  if (querystring == "" || querystring == "?") {
    return params;
  }
  if (querystring[0] == '?') {
    querystring = querystring.substr(1);
  }
  querystring = querystring.split('&');
  var params = {},
    pair,
    d = decodeURIComponent;
  for (var i = querystring.length - 1; i >= 0; i--) {
    pair = querystring[i].split('=');
    params[d(pair[0])] = d(pair[1]);
  }
  return params;
};

var gu_qs = gu_deparam(document.location.search);
function gu_fire_event(eventName, action, identifier, fbevent, fbargs) {

  var eventProperties = {
    'action': action,
    'identifier': identifier
  };
  for (var e in gu_qs) {
    eventProperties[e] = gu_qs[e]
  }
  eventProperties["url"] = document.baseURI;
  eventProperties["title"] = document.title;
  eventProperties["offer"] = getDomain(); //lpDomain
  eventProperties["domain"] = document.location.hostname;
  eventProperties["page"] = document.location.pathname;
  eventProperties["offerPage"] = document.location.pathname; //constant throught shopify
  // eventProperties["mobileDevice"] = mobileDevice;
  eventProperties["pageType"] = 'LandingPage'; //preSellPage

  // if (gu_amplitudeInitialized) {
  //     if (amplitudeEventQueue.length > 0) {
  //         queueAmplitudeEvent(eventName, eventProperties);
  //     }
  //     else {
  //         amplitude.logEvent(eventName, eventProperties);
  //     }
  //
  //
  // }
  // else {
  //     queueAmplitudeEvent(eventName, eventProperties);
  // }

  if (fbevent !== undefined) {
    if (fbargs !== undefined) {
      fbq('track', fbevent, fbargs);
    } else {
      fbq('track', fbevent);
    }
  }
}

var galleries = document.getElementsByClassName('guGallery');

//id gallery
for (var i = 0; i < galleries.length; i++) {
  var gallery = galleries[i];
  var newID = "guGallery-" + (
  i + 1) + "-thumbnails";
  galleries[i].setAttribute('id', newID);
  var items = gallery.getElementsByTagName('li');

  //id images in galleries
  for (var j = 0; j < items.length; j++) {
    var newId = "guGallery-" + (
    i + 1) + '-thumbnail-' + (
    j + 1)
    var curImg = items[j].getElementsByTagName('img');
    curImg[0].setAttribute('id', newId);
  }
}

var qs = document.location.search;
//console.log("qs: " + qs);

//escape if in VC
if (!qs.includes('vc_editable')) {
  RunGuGallery();
}

function RunGuGallery() {
  var galleries = document.getElementsByClassName('guGallery');
  for (var i = 0; i < galleries.length; i++) {
    BuildGalleries(galleries[i], (i + 1));
  }

}

function BuildGalleries(gallery, num) {
  jQuery(function() {

    var curGallery = "guGallery-" + num;

    //create wrapper
    jQuery(gallery).before('<div id="' + curGallery + '"></div>');

    //create image wrapper
    jQuery("#" + curGallery).append('<div id="' + curGallery + '-imageWrapper" class="imageWrapper"><img class="vc_single_image-img " src=""></div>');
    //jQuery("#"+ curGallery +"-imageWrapper").hide();

    //create video wrapper
    jQuery("#" + curGallery).append('<div id="' + curGallery + '-videoWrapper" class="galleryVideoWrapper videoWrapper"><iframe width="560" height="308" src="" frameborder="0" allowfullscreen></iframe></div>');
    jQuery("#" + curGallery + "-videoWrapper").hide();

    //add thumbnail gallery into wrapper
    jQuery("#" + curGallery).append(gallery);

    //run through thumbnails
    jQuery("#" + curGallery + "-thumbnails li").each(function(index) {

      //run through all images to create giddyBox divs if it's not a vid thumb
      if (jQuery(this).find('img').attr('alt').indexOf("youtube") <= 0) {

        //trim the src to use as giddyBox id
        var parts = jQuery(this).find('img').attr('src').split("/");
        var result = parts.pop();
        result = result.replace(/[|&;$%@"<>()+,]/g, "");
        var trimmedSrc = result.slice(0, result.length - 12);

        //get full src of image to place inside of giddybox
        var ogSrc = jQuery(this).find('img').attr('src');
        var lrgSrc = ogSrc.slice(0, ogSrc.length - 12) + ogSrc.slice(ogSrc.length - 4, ogSrc.length);
        if (ogSrc.indexOf("150") < 0) {
          lrgSrc = ogSrc
          trimmedSrc = result.split(".")[0]
        }
        //generate giddybox div
        jQuery("#" + curGallery + "-thumbnails").after('<div class="hidden"><div id="' + trimmedSrc + '"><img style="max-width:75vw; max-height: 90vh;" src="' + lrgSrc + '" /></img></div></div>');

      }

      //find first to display large
      if (index === 0) {
        //add border to show it is selected
        jQuery(this).find('img').addClass('selectedThumb');

        //first thumb
        if (jQuery(this).find('img').attr('alt').indexOf("youtube") >= 0) {

          //first thumb is vid, load video
          var url = jQuery(this).find('img').attr('alt') + "?";

          //check for autoplay in qs
          canAutoplay = 0;

          //check if default video is set to auto play
          if (canAutoplay == '1') {
            url = url + "autoplay=1&";
          }

        } else {
          var src = jQuery(this).find('img').attr('src');

          LoadImage(src);
        }
      }

      //check all for vids to add play button
      //make all playbuttons visible now that they are in their proper location
      setTimeout(function() {
        jQuery('.playButton').animate({
          opacity: 1
        }, 400);
      }, 500);

    });

    //thumbnail click function
    jQuery("#" + curGallery + "-thumbnails img").on('click', function() {

      //remove selected class from all thumbs
      jQuery("#" + curGallery + "-thumbnails li img").each(function(index) {
        jQuery(this).removeClass('selectedThumb');
      });

      //add border to selected thumb
      jQuery(this).addClass('selectedThumb');

      //capture id for event tracking
      var thumbID = jQuery(this).attr('id');

      //check for youtube alt tag video src

      //no alt tag, replace main image with src of thumbnail
      var src = jQuery(this).attr('src');

      LoadImage(src);

      //throw event of item clicked
      gu_fire_event('GalleryChanged', 'ViewedImage', thumbID);

    });

    //main img click function
    jQuery("#" + curGallery + "-imageWrapper img").on('click', function() {
      //clicked main image, launch proper giddybox
      var srcParts = jQuery(this).attr('src').split("/");
      var endPart = srcParts.pop();
      //strip extension off
      endPart = endPart.slice(0, endPart.length - 4);
      //strip out illegal chars
      endPart = endPart.replace(/[|&;$%@"<>()+,]/g, "");
      giddybox('#' + endPart + '');

    });

    function LoadImage(imgSrc) {
      //a little bit of magic to strip the generated thumbnail dimensions off the images for larger viewing
      var newSrc = imgSrc.slice(0, imgSrc.length - 12) + imgSrc.slice(imgSrc.length - 4, imgSrc.length);

      if (imgSrc.indexOf("150") < 0) {
        newSrc = imgSrc
      }
      jQuery("#" + curGallery + "-imageWrapper img").attr('src', newSrc);

      //make sure video is hidden is visible and image is shown
      if (jQuery("#" + curGallery + "-videoWrapper").is(':visible')) {
        //stop video
        jQuery("#" + curGallery + "-videoWrapper iframe")[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        //jQuery("#"+curSection+ "  .galleryVideoWrapper iframe").attr('src', '');
      }

      //make sure video is hidden and image is shown
      jQuery("#" + curGallery + "-videoWrapper").fadeOut("fast", function() {

        // Animation complete, fade in image
        jQuery("#" + curGallery + "-imageWrapper").fadeIn("fast");
      });
    }

  });
}
