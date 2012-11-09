---
layout: post
title: "css3线性渐变"
category: program
tags: [chrome,extension]
comments: true
keywords: css3,渐变，线性渐变
description: |
 随着浏览器对css3的越来越强大的支持，很多以前想都不敢想的效果可以在浏览器上通过css3实现了，这是我翻译的一篇介绍css3线性渐变的英文文章。当然了，经过我的翻译，它变成了蹩脚的中文了。
---

英文原文：<a href="http://www.webdirections.org/blog/css3-linear-gradients/" target="_blank">CSS3 Linear Gradients</a>

距离上次我们在web directions上发表特殊技术博客已经有一段时间了，但是那些技术都是在不断地变化着。这篇是关于CSS3特性的一系列技术文章中的第一篇（同时附带了一些工具帮助你学习和使用它们）。

我们就从线性渐变开始吧。我将介绍它们从何而来，怎样使用它们和现阶段浏览器对它们的支持情况。具有讽刺意味的是，尽管webkit推荐了渐变，但直到5.1版本，Safari才用和下面我们要描述的不一样的语法支持它。所以，如果你正在用Safari其他版本而不是5.1（目前处于beta阶段）你将不能实际运行这里的例子。

## 一段简短的历史

<a href="http://www.webkit.org/blog/175/introducing-css-gradients/" target="_blank">webkit第一次推荐css3渐变特性</a>要追溯到2008年，使浏览器生成渐变成为可能，过去的渐变使用图片加CSS生成——最常见的有背景图片，当然也有列表项图片，边框图片，还有生成的内容。Firefox3.6如法炮制，但是也引进了几个挑战，它介绍了一种不同的语法（现在已经作为CSS3渐变的推荐语法而被接受），并且渐变仅可以作为背景图使用（这个限制直到今天仍然存在）。莫惊慌，基于chrome的webkit支持渐变，Opera从11.1版本也支持了（尽管目前只有线性渐变（很快会有更多）被支持）。你要问IE如何？好吧，<a target="_blank" href="http://blogs.msdn.com/b/ie/archive/2011/05/04/css3-gradients-in-ie10-platform-preview-1.aspx">IE10会支持渐变的</a>！

对于两种不同的语法也不要太恐慌——webkit和其他浏览器，像Safari5.1都支持同样的语法（我们也在密切关注着怎样保证浏览器的最大兼容性）。

## 他们如何工作

关于历史，我们说的够多了，让我们现在就试试它们。实际上，加上上面提到的一共有两种渐变（线性的和径向的）。在这篇文章里，我们把焦点放在线性渐变上。下一篇文章里我们会介绍径向渐变。

渐变不是像color这样的属性，但它是可计算的CSS值，有时你可能对它不太熟悉。比较典型的是，用一个url指向一个图像（通常是background-image）时我们会用到它们。实际上，浏览器生成了一张图像并且使用它。

下面是一个实际的例子

<p><button type="submit" id="tweetThis" value="Tweet Me" style="	background-image: -moz-linear-gradient(top , #EFF6FB, #d3e4f3 68%); background-image: -webkit-linear-gradient(top , #EFF6FB, #d3e4f3 68%); background-image: -o-linear-gradient(top , #EFF6FB, #d3e4f3 68%); background-image: -ms-linear-gradient(top , #EFF6FB, #d3e4f3 68%); background-image: linear-gradient(top , #EFF6FB, #d3e4f3 68%); padding: 0 1em; margin-top: 0; font-size: .9em; height: 3em; border: solid #97bfe1 1px; color: #1d84c5; -webkit-border-radius: .6em; -moz-border-radius: .6em; -o-border-radius: .6em; -ms-border-radius: .6em; border-radius: .6em; background-color: #d3e4f3; text-shadow: 0 1px 1px #fff; font-size: larger; width: 10em; text-align: center;"><span style="line-height: 3em">Don't Panic!</span></button></p>

好的，我耍了一点小把戏并且增加了一点点样式，但是那个平滑的渐变是使用CSS完成的。试着增加文字的尺寸（作者的意思可能是增加button的高度，因为这个高度是固定的，增加文字的字号没有用处）——观察背景的渐变是怎样填充元素的。

CSS代码是这样的：

<pre class="prettyprint">
background-image: linear-gradient(top, #eff6fb, #d3e4f3 68%);
</pre>

（我说过不要为了一个理由而苦恼——如果你对底层的概念感兴趣，继续读下去。但是，如果你是一个乐于动手的学习者，那就试试我开发的<a target="_blank" href="http://westciv.com/tools/gradientsnustyle">渐变工具</a>吧。）

线性渐变开始于元素顶部（很快我们就会看到它也可以从其他位置开始）并且垂直向下延伸直到元素底部。顶部，初始颜色是#eff6fb。到元素的68%的位置时，颜色是#d3e4f3，并且浏览器会生成一张从#eff6fb平滑过渡到#d3e4f3的渐变图。从68%的位置向下，直到底部，颜色保持#d3e4f3不变。

<p><img src="http://webdirections.org/images/gradient1.png" alt="gradient in action" height="200px"></p>

顺便提一下，“#d3e4f3 68%”被称为color stop——并且渐变可能会有多个这样的stops.

在我们继续之前，还是先回顾一下。一个渐变是以linear-gradient这个关键字开始的值，并且用括号包裹着几个值。这些值定义了渐变的方向（刚才那个例子中的方向是自上而下的），一个起始颜色，随后是一个或多个color stops.一个color stop是一个颜色值，跟着一个可选的长度或是百分值（例如，我们可以设置一个stop在1em,20px等位置）。

这里有一个包含多个stops的例子：

<p><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(%20left,%20%23FF0000,%20%23FFA500%2013.0%25,%23FFFF00%2026.0%25,%230000FF%2039.0%25,%23008000%2052.0%25,%234B0082%2065.0%25,%23EE82EE%2078.0%25)">background-image: linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%)</a></p>

<div class="example" style="width: 80%; height: 6em; margin: 0 auto; background-color:#FF0000;background-image: -moz-linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%);background-image: -webkit-linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%);background-image: -o-linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%);background-image: -ms-linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%);background-image: linear-gradient( left, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%)"></div>

## 渐变方向

我们会用两种方法中的一种来定义渐变的方向。我们可以用关键字left和right定义水平方向的渐变，也可以用关键字top和bottom定义垂直方向的渐变。让我们逐个来看看这些定义（点击下面的链接就可以看到它们中的每一个的效果）。

<ul><li><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(top%20,%20#FFFFFF,%20#000000%20)">background-​​image: linear-gradient(top , #<span class="caps">FFFFFF</span>, #000000 )</a></li><li><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(bottom%20,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-gradient(bottom , #<span class="caps">FFFFFF</span>, #000000 )</a></li><li><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(%20left,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-​​gradient( left, #<span class="caps">FFFFFF</span>, #000000 )</a></li><li><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(%20right,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-​​gradient( right, #<span class="caps">FFFFFF</span>, #000000 )</a></li></ul>

我们也可以合并关键字来创建从左上角，左下角，右上角，右下角开始的对角线渐变：

<ul>
	<li>
		<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(top%20left,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-gradient(top left, #<span class="caps">FFFFFF</span>, #000000 )
		</a>
	</li>
	<li>
		<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(bottom%20left,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-gradient(bottom left, #<span class="caps">FFFFFF</span>, #000000 )
		</a>
	</li>
	<li>
		<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(top%20right,%20#FFFFFF,%20#000000%20)">background-​​image: linear-gradient(top right, #<span class="caps">FFFFFF</span>, #000000 )
		</a>
	</li>
	<li>
		<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(bottom%20right,%20%23FFFFFF,%20%23000000%20)">background-​​image: linear-gradient(bottom right, #<span class="caps">FFFFFF</span>, #000000 )</a>
	</li>
</ul>

但是如果渐变只能支持垂直或是水平方向或是对角线方向岂不是很单调，所以第二种定义渐变方向的方法就是角度。（你可以用关键字或角度其中的一种，不能两种方法同时使用）。

为了定义渐变角度，我们采用90deg这种格式（0deg的渐变从左边开始，90deg到底部，180deg到右边，270deg到上面。因此，我们可以把角度想象成从9点钟方向（0deg）逆时针旋转。）

照例，理解这个最好的方式就是动手实践——所以让我们回到我特意为这个准备的工具上，改变角度看看会发生什么吧。

<p><a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(126deg,%20#FF0000,%20#FFA500%2013.0%25,#FFFF00%2026.0%25,#0000FF%2039.0%25,#008000%2052.0%25,#4B0082%2065.0%25,#EE82EE%2078.0%25)">background-image: linear-gradient(126deg, #FF0000, #FFA500 13.0%,#FFFF00 26.0%,#0000FF 39.0%,#008000 52.0%,#4B0082 65.0%,#EE82EE 78.0%)</a></p>

## 重复渐变

你的脑子是不是已经活浆糊了呢？color stops,渐变角度，等等。那好，让我们再加点儿料——重复渐变。没错，你可以重复一个渐变。它是这么工作的，如果你的最后一个color stop在元素的“末尾”之前（比如有一个从左到右的渐变，最后一个stop比这个元素的100%宽度要短），那么渐变就会从最后一个color stop的位置开始重复。

如果我们有一个简单的渐变像下面这样：

<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20linear-gradient(0deg,%20%23FF0000,%20%23FFA500%2050%25)">background-image: linear-gradient(0deg, #FF0000, #FFA500 50%)</a>

随后我们将渐变的名字从linear-gradient改成repeating-linear-gradient，那么我们就能得到一个从50%到100%的位置重复他本身的渐变，像这样

<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/#background-image:%20repeating-linear-gradient(0deg,%20%23FF0000,%20%23FFA500%2050%25)">background-image: repeating-linear-gradient(0deg, #FF0000, #FFA500 50%)</a>

## 忘掉公式吧，现在就用这个工具

像我上面提到的那样，没有必要记住所有的语法和概念——基于此我们开发了<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/index.html">线性渐变的工具</a>来使你的生活变得更美好。（实际上，我彻底检查了我两年前开发的这个版本，来提供多浏览器的支持，并且更全面地支持了新的语法。）

还有一些其他的优秀的渐变工具，包括<a target="_blank" href="http://www.colorzilla.com/gradient-editor/">ColorZilla</a>.我设计这个（还有<a target="_blank" href="http://westciv.com/tools/">其他的CSS3工具</a>）是为了紧跟CSS渐变的发展脚步。对工具了解的越多，就越能制作出漂亮的渐变。

这个工具还有几个你可能会喜欢的附加特性：

	* 你可以将你刚刚创建的渐变发布到微博上，代价只是点击一下按钮而已。
	* 你可以复制你创建的渐变的URL,通过电子邮件将它发送给别人，把他放入一个链接（像我在例子中那样）或者分享它。
	* 通过神奇的HTML5的本地存储功能，它可以记录下你最近创建的渐变和其他设置，方便你下次访问。
	* 作为一个可选项，它提供了所有现代浏览器供应商的前缀.
	* 对于不支持渐变的老版本浏览器，它会将起始颜色设为背景色.
	* 它提供了最新的浏览器兼容信息.
	* 它看起来是那么的漂亮，这一切多亏了CSS渐变.

所以，快试试它吧，并且<a target="_blank" href="http://twitter.com/johnallsopp">给我一些反馈</a>。

## 向后兼容

现在，你可能有个疑问，这对老版本的浏览器向后兼容性如何，渐变的使用有没有门槛？幸运的是，渐变的使用非常简单，只要你时刻记住两件事就可以跨浏览器使用它。

首先，确保你有一个背景颜色（或者是图片）和文字形成对比。在不支持渐变的地方，浏览器会忽略它，改为采用你设置好的颜色或是图片。

目前，所有的浏览器都需要在渐变值里加入提供商定义的扩展。渐变工具会自动为你创建好。确保你包含了一个没有供应商前缀的渐变值，并且将它放在你定义的CSS属性的最后（众所周知，在css中，最后一个属性将覆盖之前的属性），举个例子：

<pre class="prettyprint">
background-color:#AB1364;
background-image: -moz-linear-gradient(114deg, #AB1364, #52FF26 11%);
background-image: -webkit-linear-gradient(114deg, #AB1364, #52FF26 11%);
background-image: -o-linear-gradient(114deg, #AB1364, #52FF26 11%);
background-image: -ms-linear-gradient(114deg, #AB1364, #52FF26 11%);
background-image: linear-gradient(114deg, #AB1364, #52FF26 11%)
</pre>

针对老版本的Safari，我们需要定义一个不同的background-image属性。不仅是语法不同，概念也不同，所以你可能要使用我的<a target="_blank" href="http://westciv.com/tools/gradientsnustyle/webkit-old-style.html">这个老的css3线性渐变生成器</a>来帮助你。

还有，渐变仅用于backgrounds，webkit是个例外，（webkit支持所有用到图片的地方。）

## 浏览器支持情况备注

一个关于目前浏览器对线性渐变支持情况的简短总结。

	* Safari4 引入了线性渐变，尽管使用了与刚才讨论的不同的语法。需要供应商前缀-webkit-.
	* Safari5.1引入了这里介绍的语法，同时支持老的语法。同样，需要-webkit-前缀。
	* Firefox3.6时第一个支持现在的渐变语法的。需要-moz-前缀，并且现在只支持backgrounds.
	* Chrome10及以上支持这里的渐变语法。需要-webkit-。
	* Opera11.1引入了线性渐变，需要-o-前缀。
	* IE10支持CSS渐变，用-ms-前缀

为了使生活变得更美好，W3C CSS工作组又改变了语法

## 更多链接，例子

<ul><li><a target="_blank" href="http://leaverou.me/">Lea Verou</a> has some great presentations on Gradients, including one at our recent @media conference, which you can <a target="_blank" href="http://www.webdirections.org/resources/lea-verou-mastering-css3-gradients/">watch the slides of and listen to</a></li><li>Lea has also put together a <a target="_blank" href="http://leaverou.me/css3patterns/"><span class="caps">CSS</span> pattern gallery</a>, showcasing some amazing designs using <span class="caps">CSS</span> gradients</li><li>Estelle Weyl also has a great <a target="_blank" href="http://www.standardista.com/cssgradients/">gallery of gradient patterns</a></li><li>Detailed support information for css gradients, and many other modern <span class="caps">HTML5</span>, <span class="caps">CSS3</span> and <span class="caps">DOM</span> features is available at <a target="_blank" href="http://caniuse.com/#search=gradients">When Can I Use?</a></li></ul>











