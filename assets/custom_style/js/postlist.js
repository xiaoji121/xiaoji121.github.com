/**
 * 控制最近文章列表长度
 */

;(function($) {
	var app = {
		init: function() {
			var post = $('aside .bullet li');
			post.each(function( index, ele ) {
				if ( index > 14 ) {
					$(ele).hide();
				}
			});

			$('aside section').show(300);
		},

		end: 0
	};

	$(function() {
		app.init();
	});
})(jQuery);