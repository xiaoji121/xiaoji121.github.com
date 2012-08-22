---
layout: post
title: "Less在实践中的应用"
category: program
tags: [less,css]
comments: true
keywords: less,less实践，用less写css
description: |
 刚刚接触到LESS的时候，看到它的名字，马上就想到了jQuery的那句口号“write less,do more”。看了它的介绍就让人感觉这东西一定很有用，我用less写css后，确有此感。
---

#### 1. LESS带给我的惊喜

它可以设置全局的变量，例如页面的风格颜色

它可以设置全局的class，例如定义文字超过一行/两行时隐藏

它可以定义函数，并且可以给函数默认的参数

它可以......它可以做的太多，具体请看<a href="http://lesscss.org/" target="_blank">Less官方网站</a>

#### 2. 项目背景

工作中遇到很多页面的排版布局都是相似的，只是风格的变换。行业网站那边提出了栅格系统，所谓栅格系统就是网页的骨架。栅格系统就像是这样一个书架：它有N层，每一层被分成了不同宽度的窗格，这些格格框框就是栅格，我们要做的就是将每个格子填满书。

整体的大布局规定好后，剩下的就是去编写适应不同窗格的组件，我们将它称为Widget。将这些Widget的边框，背景，文字的颜色设置成与网页整体风格一致，然后塞到相应的框里就形成了整个网页。栅格系统保证了所有行业的大布局的统一性，Widget保证网页内容的丰富性和展示的多样性。<a href="/demo/qingchengwidget/widget.html" target="_blank">项目demo</a>

正如<a href="/demo/qingchengwidget/widget.html" target="_blank">项目demo</a>中所呈现的，网页的每一个区块儿都很明显。这里面包含的Widget就有：SN、市场动态、热销商品、排行榜、优质供应商、offer展示区域、TAB等等。其中还有相同模块儿的不同版本。这个页面是所有Widget的集合。

#### 3. Less在项目中的作用

必须提到的是LESS有效地加快了项目的进度，提高了开发效率。

本项目的特点是，相同Widget的不同版本之间区别不大，这样就特别适合用面向对象的思想去做，less将css中的继承和覆盖的思想体现的淋漓尽致。而且比起普通的css书写方式更像是在写程序，下面会有示例。

本项目还有一个特点就是，当Widget够丰富以后，搭建页面变得特别容易，只需要在配置文件中更改相应的配置项的值即可，下面也会有介绍。

#### 4. Less走马上任

先看一段代码：

<pre class="prettyprint">
.tabs-v1(@width: @tabsWidthOffer){
	color: @contentColor;
	ul{
		border: 1px solid @tabsBorderColor;
		border-width: 0 0 0 1px;
		li{
			width: @width;
			height: 30px;
			font-size: 12px;
			line-height: 30px;
			float: left;
			text-align: center;
			border: 1px solid @tabsBorderColor;
			border-width: 1px 1px 0 0;
			background-color: @tabsBgColor;
			cursor: pointer;
			position: relative;
			&.cur{
				color: @floorHeadMoreColor;
				border-bottom-color: white;
				background-color: white;
				font-weight: bold;
				top: 1px;
				height: 32px;
				margin-top: -2px;
			}
			&.last{
				width: @width+3;
			}
		}
	}
}
</pre>

这段代码就是<a href="/demo/qingchengwidget/widget.html" target="_blank">项目demo</a>中看到的控制tab样式的代码。我们可以看到这里定义了一个叫做```.tabs-v1```的函数，没错！我说过了less可以写函数。这个函数有一个变量叫```@width```，它的默认值是```@tabsWidthOffer```。我们可以从这段代码中看出它显得很整洁，层次结构非常清晰。相比普通的css来说整洁是一个优点，另一个优点就是它不用像普通的css那样每次都要在子元素的class前面加上父元素的class。例如，你再也不用这样写了：

<pre class="prettyprint">
.tabs-v1{
	......
}
.tabs-v1 ul{
	......
}
.tabs-v1 ul li{
	......
}
</pre>

是不是很酷？还有更酷的呢！我们看到代码中有许多以```@```开头的属性值，这就是less中的变量，我这里用到的都是```配置文件```里定义好的，如果哪天需要更改页面的风格了，只需要更改配置文件即可。```.tabs-v1```中为什么传入```@width```这个变量呢？这是因为我在offer区域用到的tab宽度与排行榜中用到的宽度不一样。这样我就可以通过传宽度值来控制不同的tab而不必重写代码了。例如，控制offer中的tab样式的文件我取名叫做```offertab.less```，内容如下:

<pre class="prettyprint">
.offerTab{
	.tabs-v1(@tabsWidthOffer);
}
</pre>

可以看到，我只需要调用一下```.tabs-v1```这个函数传入我想要的宽度就行了，这个宽度我也在配置文件中事先配置好了。

再比如说，排行榜的tab要比offer区域的tab短一些，控制排行榜的tab样式文件我取名为：```ranktab.less```,内容如下：

<pre class="prettyprint">
.rankTab{
	.tabs-v1(@tabsWidthRank);
	ul{
		li{
			color: #444;
			font-weight: normal;
			&.cur{
				color: #444;
			}
		}
	}
}
</pre>

从上面的代码可以看出我仍然调用了```.tabs-v1```函数，但是下面还有一行代码，这就体现了面向对象的思想。因为排行榜的样式跟offer区域的样式有些不同，我就覆盖了部分样式以达到要求。

好了，该说说```配置文件```了，我的配置文件取名为```config_xxx.less```:

<pre class="prettyprint">
@titleColor: #333;
@contentColor: #444;
@linkHoverColor: #ff7300;
@numberColor: #cc0000;
@assistColor: #888;


@styleColor: #3d86c8;
@tabsWidthOffer: 193px;
@tabsWidthRank: 97px;
@tabsWidthOfferV2: 130px;
@tabsBorderColor: #e1e1e1;
@tabsBgColor: #f8f8f8;
@backgroundImg: "http://img.china.alibaba.com/cms/upload/2012/736/183/381637_261003913.png";
@snHeadBgColor: #edf7ff;
@snMoreBgColor: #f6f6f6;
@snHeadBottomColor: #d5e3ee;

@floorHeadBgColor: #eff5fb;
@floorHeadBreakLineColor: #c6dae8;
@floorHeadMoreColor: #397ebe;

.Title{
	color: @titleColor;
	font-size: 14px;
	font-weight: bold;
	height: 30px;
	line-height: 30px;
}
.Rank{
	width: 14px;
	height: 14px;
	line-height: 14px;
	font-size: 10px;
	font-weight: bold;
	text-align: center;
	font-family: Tahoma;
	color: #fff;
	background-color: #999;
}
.floorMoreBtn{
	color: @floorHeadMoreColor;
	width: 67px;
	height: 30px;
	float: left;
	padding-left: 26px;
	background: url("@{backgroundImg}") right 8px no-repeat; 
}

.catMoreBtn{
	color: @styleColor;
	float: right;
	margin: 0 9px 0 0;
	height: 22px;
	padding-right: 19px;
	font-weight: bold;
	background: url("@{backgroundImg}") right 8px no-repeat; 
}
.BreakWord(@row:1){
	height: 18px*@row;
	line-height: 18px;
	overflow: hidden;
	word-wrap: break-word;
	word-break: break-all;
}

.AStatus(@color: @contentColor){
	color: @color;
	&:hover{
		color: @linkHoverColor;
	}
}
</pre>

配置文件中我定义了tab的背景色```@tabsBgColor```,整个页面用到的背景图地址```@backgroundImg```,大家一看就明白了，这里就不多说了。

LESS给CSS的书写带来了一次革命性的改变，也带来了另外一种编程享受，I LOVE LESS!