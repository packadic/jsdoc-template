define([ 'jquery', 'string' ], function( $, s ){

    var sb = {};

    var width = 650,
        height = 450;

    var urls = {
        twitter    : 'https://twitter.com/share?&text=Share Buttons Demo&via=sunnyismoi&url=',
        facebook   : 'https://www.facebook.com/sharer/sharer.php?u=',
        google     : 'https://plus.google.com/share?url=',
        reddit     : 'http://www.reddit.com/submit?url=',
        tumblr     : 'http://www.tumblr.com/share/link?url=',
        linkedin   : 'https://www.linkedin.com/shareArticle?mini=true&url=',
        pinterest  : 'https://www.pinterest.com/pin/create/button/?url=',
        stumbleupon: 'http://www.stumbleupon.com/submit?url=',
        delicious  : 'https://delicious.com/save?v=5&noui&jump=close&url='
    };

    var ce = function( tag ){
        return $(document.createElement(tag))
    };

    var createButton = function( site ){
        var $a = ce('a'),
            $si = ce('span'),
            $st = ce('span');

        $a.append(
            $si.addClass('share-btn-icon')
        ).append(
            $st.addClass('share-btn-text').text(s.capitalize(site.toLowerCase()))
        );

        $a.addClass('share-btn')
            .addClass('share-btn-' + site)
            .attr('href', urls[ site ] + window.location.href); //.attr('href', urls[site] + window.location.href)

        $a.on('click', function( e ){
            e.preventDefault();
            window.open(this.href, 'Share Dialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width +
                                                   ',height=' + height + ',top=' + (screen.height / 2 - height / 2) +
                                                   ',left=' + (screen.width / 2 - width / 2));
        });

        return $a;
    };

    sb.applyTo = function( selector ){
        var $els = $(selector);
        $els.each(function(){
            var $e = $(this);
            var sites = $e.data('share-buttons').split(",");
            var classes = $e.data('share-buttons-class');

            $.each(sites, function( i, site ){
                var b = createButton(site);
                b.addClass(classes);
                $e.append(b).append('&nbsp;')
            })
        });
    };


    return sb;
});
/*
 <a title="Share on twitter" data-share-site="twitter">Twitter</a>

 <div data-share-buttons="" data-share-buttons-class="share-btn-branded"></div>
 */
