---
layout: post
title: "浮动那些事儿"
category: program
tags: [javascript]
comments: true
keywords: css,浮动，float,Block formatting context,hasLayout
description: |
 关于float，看了许多文章，这些文章对自己理解浮动帮助很大，写这篇文章也算是做个总结，方便以后查看，参考。我也会在文章末尾罗列几篇很好的文章，供大家参考。
---

在这篇文章中，我将从以下几个方面探讨浮动的那些事儿：

	1.	为什么需要浮动

	2.	浮动所引起的问题

	3.	解决这些问题的关键是什么

	4.	清除浮动的方法有哪些

	5.	参考文章

## 一、为什么需要浮动

网页中的内容排版时，可能会用到下图中的文字环绕图片的形式，这种场景需要用到浮动。

![web-text-wrap](http://css-tricks.com/wp-content/csstricks-uploads/web-text-wrap.png)

浮动也可以用于浮动布局当中，例如下图中的布局方式。

![web-layout](http://css-tricks.com/wp-content/csstricks-uploads/web-layout.png)

## 二、浮动所引起的问题

我认为浮动引起的问题最典型的有两个：

第一个是浮动布局时，由于浮动引起的元素错位问题，这种问题通常可以通过```clear：both```解决。

![uncleardfooter](http://css-tricks.com/wp-content/csstricks-uploads/unclearedfooter.png)

第二个是父元素塌陷问题，初学前端时也被这个问题困扰过，下图很好地演示了这一问题。我们说要清除浮动，大部分时候也是为了解决塌陷问题。

![collapse](http://css-tricks.com/wp-content/csstricks-uploads/collapse.png)

[这篇文章](http://www.iyunlu.com/view/css-xhtml/55.html)中将解决这两个问题的方法分别叫做```清除浮动```和```闭合浮动```，这种区分比较严谨。

## 三、解决这些问题的关键是什么

那么，要解决这些浮动问题，关键是什么呢？关键在于两个概念：[hasLayout](http://msdn.microsoft.com/en-us/library/ms533776%28VS.85%29.aspx)和
[Block formatting context](https://developer.mozilla.org/en-US/docs/CSS/Block_formatting_context)

### [hasLayout](http://msdn.microsoft.com/en-us/library/ms533776%28VS.85%29.aspx)

> 'Layout'是IE浏览器渲染引擎的一个内部组成部分。在IE浏览器中，一个元素要么自己对自身的内容进行组织和计算大小， 要么依赖于包含块来计算尺寸和组织内容。为了协调这两种方式的矛盾，渲染引擎采用了'hasLayout'属性，属性值可以为true或false。 当一个元素的'hasLayout'属性值为true时，我们说这个元素拥有了一个布局（layout），即成功触发hasLayout。

### [Block formatting context(BFC)](https://developer.mozilla.org/en-US/docs/CSS/Block_formatting_context)

> BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

从概念上来看，hasLayout和Block formatting context很相似，它们都决定了对内容如何定位及大小计算的规则，决定了与其他元素的相互作用的规则。hasLayout和Block formatting context有它们各自的触发方式。在了解它们的触发方式之前，首先要明确一点：

***hasLayout特性仅IE支持，其他浏览器并无此特性。可以依靠计算布局清理浮动的hasLayout特性仅在IE6/7中存在，IE8之后将使用CSS2.1的Block Formatting Contexts定义来达到同样效果。***

### hasLayout的触发方式

有些元素默认已经拥有了hasLayout属性，即该属性为true

	<html>, <body>
	<table>, <tr>, <th>, <td>
	<img>
	<hr>
	<input>, <button>, <select>, <textarea>, <fieldset>, <legend>
	<iframe>, <embed>, <object>, <applet>
	<marquee>

触发方式：

	display: inline-block
	height: (除 auto 外任何值)
	width: (除 auto 外任何值)
	float: (left 或 right)
	position: absolute
	writing-mode: tb-rl
	zoom: (除 normal 外任意值)

IE7 还有一些额外的属性(不完全列表)可以触发hasLayout ：

	min-height: (任意值)
	min-width: (任意值)
	max-height: (除 none 外任意值)
	max-width: (除 none 外任意值)
	overflow: (除 visible 外任意值，仅用于块级元素)
	overflow-x: (除 visible 外任意值，仅用于块级元素)
	overflow-y: (除 visible 外任意值，仅用于块级元素)
	position: fixed

### Block Formatting Contexts的触发方式

	float:(任何值除了none)
	overflow:（任何值除了visible）
	display:(table-cell/table-caption/inline-block)
	position:(任何值除了static/relative)

## 四、清理浮动的方法

有了前面介绍的hasLayout和Block Formatting Contexts的基本概念后，我们清理浮动的方法就有了理论指导。

### 清除浮动

1.手工清理浮动

在所有浮动元素后面增加空标签

<pre class="prettyprint">
	&lt;div class="wraper"&gt;
		...
		...
		&lt;div class="clear-float"&gt;&lt;/div&gt;
	&lt;/div&gt;
	
	.clear-float {
		clear: both;
	}
</pre>

利用```<br>```标签和其自身属性clear

<pre class="prettyprint">
	&lt;div class="wraper"&gt;
		...
		...
		&lt;br clear="all" /&gt;
	&lt;/div&gt;
</pre>

这些方法会增加许多额外的空标签，缺乏语义，可维护性变差。

2.利用:after伪类清理浮动

目前中文站用的清理浮动的类```.fd-clr```。

<pre class="prettyprint">
	.fd-clr {
		zoom: 1;
	}

	.fd-clr:after {
		display: block;
		clear: both;
		height: 0;
		content: "\0020";
	}
</pre>

这种方法类似于添加空标签的方式，只是用了一种委婉的做法，去除了空标签的干扰。

### 闭合浮动

利用触发Block Formatting Contexts，闭合浮动，解决塌陷问题。

1.父元素设置overflow: hidden/auto

利用overflow: hidden方法清除浮动时，可能会引起父元素内部的决定定位元素被隐藏。请注意，这里只是说可能。那么，确切的是什么时候会隐藏绝对定位元素呢？

是否隐藏绝对定位元素实际上取决其包含块（containing block）：

	 If the element has ‘position:absolute’, the containing block is established by the nearest ancestor with a ‘position’ of ‘absolute’, ‘relative’, or ‘fixed’. …

	翻译：如果一个元素有"position:absolute"的定义，则其包含块由最近的拥有"position:absolute|relative|fixed"属性的祖先元素确定......

这意味着一个带有overflow:hidden样式的盒子，它所包含的绝对定位子元素如果溢出，并不会被隐藏——除非该绝对定位元素的包含块（containing block）就是这个盒子本身或位于该盒子内部。也就是说，如果这个绝对定位元素的包含块的层级高于拥有overflow:hidden样式的盒子，那么这个盒子里面的绝对定位元素不会被截断或隐藏。

这里有一个[demo](http://www.tjkdesign.com/lab/clearfix/overflow-and-ap.html)，box1,box2,box3,box4是绝对定位元素，但并没有被#wrapper隐藏，这是因为它们的containing block是html，html并不在#wrapper里面，所以这些绝对定位元素并没有被隐藏。大家可以将#wrapper的position设为relative，再调整box1,box2,box3,box4的绝对定位值看看会发生什么。

在实际工作当中，我也遇到过这样的问题。下面的菜单被包含在一个名为wrapper的div当中，扩展菜单是绝对定位的，当wrapper有overflow:hidden时，扩展菜单会被隐藏。当不设overflow时，扩展菜单不被隐藏。下面是demo。

<iframe width="100%" height="600" src="http://jsfiddle.net/xiaoji121/crP4G/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<iframe width="100%" height="600" src="http://jsfiddle.net/xiaoji121/F3Lwu/embedded/result,css,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

2.父元素设置display: table

3.父元素同样设置float:left/right

IE6/7中触发hasLayout,闭合浮动，解决浮动问题

设置"width/height/zoom"等样式来自动清理浮动

## 参考文章

1. [All About Floats](http://css-tricks.com/all-about-floats/)

2. [清理浮动的几种方法以及对应规范说明](http://w3help.org/zh-cn/casestudies/001)

3. [hasLayout && Block Formatting Contexts](http://www.smallni.com/haslayout-block-formatting-contexts/)

4. [那些年我们一起清除过的浮动](http://www.iyunlu.com/view/css-xhtml/55.html)

5. [clearfix改良及overflow:hidden详解【译】](http://www.ofcss.com/2010/10/20/clearfix-reloaded-overflowhidden-demystified-translation.html)







