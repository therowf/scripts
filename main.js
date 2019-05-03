(function($) {
  "use strict";
  $(function() {
    var msie6 = $.browser == 'msie' && $.browser.version < 7;
    try {
      if (!msie6) {
        var top = $('#comment').offset().top - parseFloat($('#comment').css('margin-top').replace(/auto/, 0));
        $(window).scroll(function(event) {
          var y = $(this).scrollTop();
          if (y >= top) {
            $('#comment').addClass('fixed');
          } else {
            $('#comment').removeClass('fixed');
          }
        });
      }
    } catch (error) {}
  });
  $(document).ready(function() {
    setTimeout(function() {
      var thisUrl = window.location.href;
      try {
        if (thisUrl.indexOf('voluumdata') > -1) {
          $('a').each(function() {
            var url = $(this).attr('href');
            if (url != '' && url != undefined && url != '#') {
              try {
                if (url.indexOf('value') > -1) {
                  var url_value = $.urlParam('voluumdata');
                  url = url.replace('{value}', url_value);
                  $(this).attr('href', url);
                }
              } catch (error) {}
            }
          });
        }else if(thisUrl.indexOf('aff_sub') > -1){
          $('a').each(function(){
            var url = $(this).attr('href');

            if(url != '' && url != undefined && url != '#'){
              try{
                if(url.indexOf('value') > -1){
                  var url_value = $.urlParam('aff_sub');
                  url = url.replace('{value}',url_value);
                  $(this).attr('href',url);
                }
              } catch(error){}
            }
          });
				}
      } catch (error) {}
    }, 100);
    try {
      new WOW().init();
    } catch (error) {}
    $.urlParam = function(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results[1] || 0;
    }
  });
})(jQuery);
