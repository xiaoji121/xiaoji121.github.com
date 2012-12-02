/**
 *	@name:浮出层，模仿title功能
 *	@author:jidongming
 *	@describe:鼠标划过某元素，在该元素下显示浮出层
 *	@method:renderDataToLayer
 *			此方法供外部调用，用来向浮出层中渲染数据
 *  @example: var popLayer = new XiaojiUtil.OverflowLayer({
				'offset': [0,0],
				'triggerElement': 'a.moreInformation',
				'rootId': '#content',
				'width': 300
 			});

 			popLayer.renderDataToLayer('<p>hello world!</p>');
 **/
window.XiaojiUtil = {};

;(function($,Q){

	var configs = {
		'offset': [3,5],					//浮出层距离划过元素的偏移量
		'triggerElement': '',				//需要绑定划过显示浮出层事件的元素选择器
		'rootId':'',						//triggerElement的父节点id,可以不指定,如果不指定，默认为body
		'width': 100,						//浮出层的宽度
		'showArrow': true,					//浮出层上是否要有箭头
		'arrowPosition':'topLeftArrow',     //浮出层上的箭头位置
		'adaptPopLayerPostion': true,		//是否要根据屏幕大小自动调整浮出层位置
		'needLoadingImg':false,				//是否需要浮出层中的loading图标（异步渲染数据可能需要）				
		end: 0
	};
		
	Q.OverflowLayer =  function(cfg) {
		this.init(cfg);
	}
	
	$.extend(Q.OverflowLayer.prototype,{
				
			init:function(cfg){
				this.config = $.extend(true, {}, configs, cfg);
				this.isPop = false;													//浮出层是否已经创建
				this.popLayerClass = 'div.sw-ui-overflowLayer';						//浮出层class
						
				this._createLayerAndBindEvent();
				
			},

			_createWrap:function(){
				var self = this;
				var	layerWrap = $('<div class="sw-ui-overflowLayer"><div class="sw-ui-overflowLayer-body"></div></div>'),
					loddingState = $('<div class="sw-ui-overflowLayer-loading"><img src="http://img.china.alibaba.com/cms/upload/search/searchweb/common/loading.gif" /></div>')
									.css({
										height: '40px',
										textAlign: 'center',
										paddingTop: '20px'
									}),
					arrowPosition = self.config.adaptPopLayerPostion ? "topLeftArrow" : self.config.arrowPosition;

				if(self.config.showArrow){
					layerWrap.append('<div id="pop_arrow" class="'+ arrowPosition +'"><div class="top"></div><div class="bottom"></div></div>');
				}
				if(self.config.needLoadingImg){
					loddingState.appendTo(layerWrap);
				}
				layerWrap.appendTo('body');
				
				/*给创建的浮出层绑定事件*/
				
				$(self.popLayerClass).bind({
					mouseenter: function(){
						self.isPop = true;
					},
					mouseleave: function(){
						self.isPop = false;
						if($(this)){
							$(this).remove();		
						}
					}
				});

				return layerWrap;
			},

			_createLayerAndBindEvent: function() {
				var self = this;

				var rootId = self.config.rootId || 'body';

				/*mouseenter时创建浮出层，mouseout时销毁*/

				var enterCallBack = function(){
					var	hoverEl = $(this),
						position = hoverEl.offset();

					if($(self.popLayerClass).length){
						$(self.popLayerClass).remove();
					}

					position.left = position.left + self.config.offset[0];
					position.top = position.top - self.config.offset[1];
						
					self.timer = setTimeout(function(){//鼠标划到目标元素上停留300ms才创建浮出层,防止鼠标无意划过时就创建浮层
						self._createWrap().css({
							top: self.config.adaptPopLayerPostion ? -999 : position.top,
							left: self.config.adaptPopLayerPostion ? -999 : position.left,
							width: self.config.width
						});

						self.isPop = true;
					},300);


					self.position = position;

					self.hoverElemet = hoverEl;
				};

				var leaveCallBack = function(){
					var	leaveEl = $(this);
				
					self.isPop = false;
					
					clearTimeout(self.timer);
					
					if($(self.popLayerClass).length){
						$(self.popLayerClass).delay(200).promise().then(function(){
							if(!self.isPop){
								$(self.popLayerClass).remove();
							}	
						});
					}
				};
				
				$(rootId).unbind("mouseenter.OverflowLayer");
				$(rootId).unbind("mouseleave.OverflowLayer");
				
				$(rootId).on("mouseenter.OverflowLayer",self.config.triggerElement,function(){
					enterCallBack.call(this);
				});
				
				$(rootId).on("mouseleave.OverflowLayer",self.config.triggerElement,function(){
					leaveCallBack.call(this);
				});
			},

			/*供外部调用的方法，向浮出层中渲染数据*/
			renderDataToLayer: function(templateData){
				var self = this;

				var wait = function(dtd){
					var dtd = $.Deferred();

					var task = function(){
						if($('div.sw-ui-overflowLayer-loading').length){
							$('div.sw-ui-overflowLayer-loading').remove();
						}
						if($('div.sw-ui-overflowLayer-body').length){
							$('div.sw-ui-overflowLayer-body').html(templateData);
						}

						dtd.resolve();
					};

					setTimeout(task,500);

					return dtd.promise();
				};

				$.when(wait()).done(function(){
					if(!$('div.sw-ui-overflowLayer-body').length){
						return;
					}

					if( self.config.adaptPopLayerPostion ) {
						self._adaptPosition();
					}
					
				});			
			},

			_adaptPosition: function(){
				var self = this,
					position = {},
					popLayer = $("div.sw-ui-overflowLayer");

				var adaptXPosition = function() {
					var viewpointWidth = $(window).width(),
						elementWidth = self.hoverElemet.outerWidth();

					if( self.position.left + self.config.width > viewpointWidth ) {
						// 如果浮出层相对于屏幕右边框有溢出
						position.left = self.position.left - ( self.config.width - elementWidth );
						position.top = self.position.top;

						popLayer.css({
							top: position.top,
							left: position.left
						});

						if( self.config.showArrow ) {
							$("." + self.config.arrowPosition,popLayer).addClass("topRightArrow")
																	.removeClass(self.config.arrowPosition);
						}
						
					} else {
						position.top = self.position.top;
						position.left = self.position.left;

						popLayer.css({
							top: position.top,
							left: position.left
						});
					}
				};

				var adaptYPosition = function() {
					var viewpointHeight = $(window).height(),
						elementHeight = self.hoverElemet.outerHeight(),
						popLayerHeight = popLayer.outerHeight();

					if( self.position.top + popLayerHeight > viewpointHeight ) {
						// 如果浮出层相对于屏幕底边框有溢出
						position.top = self.position.top - ( elementHeight + popLayerHeight ) - 10;

						popLayer.css({
							top: position.top,
							left: position.left
						});

						if( self.config.showArrow ) {
							var oldClass = $("#pop_arrow")[0].className,
								nowClass = oldClass.replace("top","bottom");

							$("#pop_arrow").addClass(nowClass).removeClass(oldClass);
						}

					} else {
						popLayer.css({
							top: position.top,
							left: position.left
						});
					}
				};

				adaptXPosition();
				adaptYPosition();

			},

			end:0
	});
	
})(jQuery,window.xiaojiUtil);

