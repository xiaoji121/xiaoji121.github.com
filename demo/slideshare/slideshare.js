/**
 * slideshare
 * @author dongming.jidm
 * @date 2012-12-03
 */

jQuery.namespace('QingCheng.util');

;(function($,Q){

	var configs = {

	};
		
	Q.SlideShare =  function(cfg) {
		this.init(cfg);
	}
	
	$.extend(Q.SlideShare.prototype,{
				
			init:function(cfg){
				this.config = $.extend(true, {}, configs, cfg);
				this.middleImgIndex = 0; 		
				this.__createShim();
				this.__getItemInfo();
				this.__setSlideShareContainer();
				this.__setImgOrder( this.middleImgIndex );
				this.__bindEvent();
			},

			__bindEvent: function() {
				var self = this;

				$(window).bind("resize.SlideShare",function() {
					self.__createShim();
					self.__resizeMiddleImg();
					self.__resizeLeftandRightImg();
				});

				$("div.right","#slideShare_container").bind("click.SlideShare",function() {
					self.__viewNext();
				});

				$("div.left","#slideShare_container").bind("click.SlideShare",function() {
					self.__viewPrev();
				});

				$(document).bind('keydown.SlideShare',function(e){
					self.__keydownHandler(e);
				});
			},

			__getItemInfo: function() {
				var imgInfoArray = [];

				$("img","#slideShare_item").each(function( i, e ) {
					var imgInfoObj = {};
					imgInfoObj.orginalWidth = $(e).width();
					imgInfoObj.originalHeight = $(e).height();
					imgInfoObj.imgSrc = $(e).attr("src");
					imgInfoArray.push(imgInfoObj);
				});

				this.imgInfoArr = imgInfoArray;
				// console.log(imgInfoArray)
			},

			__createShim: function() {
				var shim = '';

				this.viewportWidth = $(window).width();
				this.viewportHeight = $(window).height();

				if( !$("#shim_layer").length ){
					$('<div id="shim_layer"></div>').css({
						width: this.viewportWidth,
						height: this.viewportHeight
					}).appendTo("body");
				}else {
					$("#shim_layer").css({
						width: this.viewportWidth,
						height: this.viewportHeight
					});
				}

			},

			__setImgOrder: function( middleImgIndex ) {
				var mIndex,lIndex,rIndex,imgMiddle;

				mIndex = middleImgIndex ? middleImgIndex : 0;
				lIndex = (mIndex - 1) < 0 ? -1 : (mIndex - 1);
				rIndex = (mIndex + 1) > (this.imgInfoArr.length - 1) ? -1 : (mIndex + 1);

				var imgMiddle = '<img src="' + this.imgInfoArr[mIndex].imgSrc + '">';
				
				$("div.middle","#slideShare_container").html(imgMiddle);

				if( lIndex !== -1 ) {
					$("div.left","#slideShare_container").css({
						background: 'url(' + this.imgInfoArr[lIndex].imgSrc + ') 50% 50%',
						width: 100,
						height: 200,
						top: this.viewportHeight / 2 - 100,
						left: 0
					});
				} else {
					$("div.left","#slideShare_container").css({
						background: 'none',
						width: 0,
						height: 0
					});
				}

				if( rIndex !== -1 ) {
					$("div.right","#slideShare_container").css({
						background: 'url(' + this.imgInfoArr[rIndex].imgSrc + ') 50% 50%',
						width: 100,
						height: 200,
						top: this.viewportHeight / 2 - 100,
						right: 0
					});
				} else {
					$("div.right","#slideShare_container").css({
						background: 'none',
						width: 0,
						height: 0
					});
				}
				

				this.__resizeMiddleImg();
			},

			__resizeMiddleImg: function() {
				var imgMiddleHeight = this.imgInfoArr[this.middleImgIndex].originalHeight,
					imgMiddleWidth = this.imgInfoArr[this.middleImgIndex].orginalWidth;

				if( imgMiddleHeight > this.viewportHeight ) {
					// 如果图片高度大于窗口可视高度
					imgMiddleHeight = this.viewportHeight - 50;
					imgMiddleWidth = (this.imgInfoArr[this.middleImgIndex].orginalWidth / this.imgInfoArr[this.middleImgIndex].originalHeight) * imgMiddleHeight;
					$("div.middle img","#slideShare_container").css({
						width: imgMiddleWidth,
						height: imgMiddleHeight
					});

					$("div.middle","#slideShare_container").css({
						top: this.viewportHeight / 2 - imgMiddleHeight / 2,
						left: this.viewportWidth / 2 - imgMiddleWidth / 2
					});
				} else {
					$("div.middle","#slideShare_container").css({
						top: this.viewportHeight / 2 - this.imgInfoArr[this.middleImgIndex].originalHeight / 2,
						left: this.viewportWidth / 2 - this.imgInfoArr[this.middleImgIndex].orginalWidth / 2
					});
				}
			},

			__resizeLeftandRightImg: function() {
				$("div.left","#slideShare_container").css({
					top: this.viewportHeight / 2 - 100,
					left: 0
				});

				$("div.right","#slideShare_container").css({
					top: this.viewportHeight / 2 - 100,
					right: 0
				});
			},

			__setSlideShareContainer: function() {
				var slideShareContainer = '<div class="slideshareContainer" id="slideShare_container">\
										      <div class="left"></div>\
										      <div class="middle"></div>\
										      <div class="right"></div>\
										    </div>';

				$(slideShareContainer).appendTo('body');
			},

			__viewNext: function() {
				var self = this;
				$(document).unbind("keydown.SlideShare");
				$("div.middle","#slideShare_container").clone().appendTo('#slideShare_container').animate({
					width: 100,
					height: 200,
					left: 0,
					top: this.viewportHeight / 2 - 100
				},200,function() {
					$(this).remove();
				});

				$("div.middle","#slideShare_container").animate({
					opacity: 0
				},200,function(){
					self.middleImgIndex++;
					self.__setImgOrder( self.middleImgIndex );
					$("div.middle","#slideShare_container").animate({
						opacity: 1
					},200,function(){
						$(document).bind('keydown.SlideShare',function(e){
							self.__keydownHandler(e);
						});
					});
				});

			},

			__viewPrev: function() {
				var self = this;
				$(document).unbind("keydown.SlideShare");
				$("div.middle","#slideShare_container").clone().appendTo('#slideShare_container').animate({
					width: 100,
					height: 200,
					left: $("div.right","#slideShare_container").offset().left,
					top: this.viewportHeight / 2 - 100,
					opacity: "toggle"
				},200,function() {
					$(this).remove();
				});

				$("div.middle","#slideShare_container").animate({
					opacity: 0
				},200,function(){
					self.middleImgIndex--;
					self.__setImgOrder( self.middleImgIndex );
					$("div.middle","#slideShare_container").animate({
						opacity: 1
					},200,function(){
						$(document).bind('keydown.SlideShare',function(e){
							self.__keydownHandler(e);
						});
					});
				});
			},

			__keydownHandler: function(e) {
				var self = this;
				if( e.which === 39 && self.middleImgIndex < self.imgInfoArr.length - 1 ) {
					self.__viewNext();
				}

				if( e.which === 37 && self.middleImgIndex > 0 ) {
					self.__viewPrev();
				}
			},

			__test: function() {
				var firstImg = $("img:first","#slideShare_item");

				console.log(firstImg.width());
				console.log(firstImg.height());
			},

			end:0
	});
	
})(jQuery,QingCheng.util);


