/**
 *	@name:�����㣬ģ��title����
 *	@author:jidongming
 *	@describe:��껮��ĳԪ�أ��ڸ�Ԫ������ʾ������
 *	@method:renderDataToLayer
 *			�˷������ⲿ���ã������򸡳�������Ⱦ����
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
		'offset': [3,5],					//��������뻮��Ԫ�ص�ƫ����
		'triggerElement': '',				//��Ҫ�󶨻�����ʾ�������¼���Ԫ��ѡ����
		'rootId':'',						//triggerElement�ĸ��ڵ�id,���Բ�ָ��,�����ָ����Ĭ��Ϊbody
		'width': 100,						//������Ŀ��
		'showArrow': true,					//���������Ƿ�Ҫ�м�ͷ
		'arrowPosition':'topLeftArrow',     //�������ϵļ�ͷλ��
		'adaptPopLayerPostion': true,		//�Ƿ�Ҫ������Ļ��С�Զ�����������λ��
		'needLoadingImg':false,				//�Ƿ���Ҫ�������е�loadingͼ�꣨�첽��Ⱦ���ݿ�����Ҫ��				
		end: 0
	};
		
	Q.OverflowLayer =  function(cfg) {
		this.init(cfg);
	}
	
	$.extend(Q.OverflowLayer.prototype,{
				
			init:function(cfg){
				this.config = $.extend(true, {}, configs, cfg);
				this.isPop = false;													//�������Ƿ��Ѿ�����
				this.popLayerClass = 'div.sw-ui-overflowLayer';						//������class
						
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
				
				/*�������ĸ�������¼�*/
				
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

				/*mouseenterʱ���������㣬mouseoutʱ����*/

				var enterCallBack = function(){
					var	hoverEl = $(this),
						position = hoverEl.offset();

					if($(self.popLayerClass).length){
						$(self.popLayerClass).remove();
					}

					position.left = position.left + self.config.offset[0];
					position.top = position.top - self.config.offset[1];
						
					self.timer = setTimeout(function(){//��껮��Ŀ��Ԫ����ͣ��300ms�Ŵ���������,��ֹ������⻮��ʱ�ʹ�������
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

			/*���ⲿ���õķ������򸡳�������Ⱦ����*/
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
						// ����������������Ļ�ұ߿������
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
						// ����������������Ļ�ױ߿������
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

