---
layout: post
title: "用javascript实现浮出层"
category: program
tags: [javascript]
comments: true
keywords: javascript,浮出层
description: |
 前段时间做需求时。积累下一个小组件，这个小组件是实现类似title提示的功能。它支持同步和异步地向浮出层中渲染数据。
---

## 它支持的配置都有哪些

<pre class="prettyprint">
	var configs = {
		'offset': [3,5],					
		'triggerElement': '',				
		'rootId':'',						
		'width': 100,						
		'showArrow': true,					
		'arrowPosition':'topLeftArrow',     
		'adaptPopLayerPostion': true,		
		'needLoadingImg':false					
	};
</pre>

### offset

微调浮出层的位置

### triggerElement

需要绑定划过显示浮出层事件的元素选择器

### rootId

triggerElement的父节点选择器,可以不指定,如果不指定，默认为body

### width

浮出层的宽度，默认为100

### showArrow

是否显示浮出层上的箭头，默认显示

### arrowPosition

如果要显示浮出层上的箭头，那么箭头的方向是什么（左上角，右上角，左下角，右下角）？默认左上角

### adaptPopLayerPostion

是否要自适应浮出层的位置，如果要自适应的话，箭头的位置就是默认的左上角了，当浮出层自动调整了位置后，箭头的位置也会自动调整，用户设置的箭头位置并不起作用。

### needLoadingImg

浮出层中是否需要Loading图标，这是为了异步地请求数据时，等待数据返回并渲染这段时间时显示正在加载的图标，当数据返回时，会用返回的数据替换这个图标。

## 一个供外部调用的方法

```renderDataToLayer```这个方法供创建好浮出层的实例后调用，像刚刚创建的浮出层中渲染数据。

## 用法

<pre class="prettyprint">
	var popLayer = new XiaoJiUtil.OverflowLayer({
      'offset': [0,20],
      'triggerElement': 'a.moreInformation',
      'rootId': '#content',
      'width': 300
    });

    $('a.moreInformation','#content').mouseenter(function(){
      popLayer.renderDataToLayer('<p>hello world!</p>');
    });
</pre>

## Demo

大家可以到<a href="/demo/overflowlayer/demo.html" target="_blank">这里</a>查看实例。大家可以缩小浏览器的窗口，然后再看浮出层的位置，看看有哪些变化。