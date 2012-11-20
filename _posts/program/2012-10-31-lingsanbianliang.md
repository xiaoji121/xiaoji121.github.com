---
layout: post
title: "javascript那些事儿——提升：零散变量问题"
category: program
tags: [javascript]
comments: true
keywords: javascript,变量，零散，提升
description: |
 javascript充许在函数的任意地方声明多个变量，无论在哪里声明，效果都等同于在函数顶部进行声明。这就是所谓的“提升”。
---

先看一个例子，当然例子中的全局变量并不被推荐。

<pre class="prettyprint">
	myname = "global";//全局变量

	function func(){
	    alert(myname);
	    var myname = "local";//局部变量
	    alert(myname);
	}
	    
	func();
</pre>

我们先来猜猜上面这段代码的执行结果。我猜是：先弹出"global"警告框，然后弹出"local"对话框。也许你会说：“Bingo!跟我想的一样！”，这是一个合乎情理的猜测，因为在第一个alert中，myname没有声明，因此函数很可能看到全局变量myname。但是结果是先弹出"undefined",然后是"local"。因为myname被看作声明为函数的本地变量（尽管是在后面声明），所有的变量声明都提升到函数的最顶层。不信？<a href="http://jsfiddle.net/xiaoji121/6YDHK/1/" target="_blank">试试这个</a>

所以，为了避免混乱，最好在开始就声明要用的所有变量。

前面的代码等价于下面的代码片段

<pre class="prettyprint">
	myname = "global";//全局变量

	function func(){
		var myname;
	    alert(myname);//undefined
	    myname = "local";
	    alert(myname);//local
	}
	    
	func();
</pre>

当先使用变量再在函数后面声明变量时可能会导致逻辑错误。对javascript而言，只要变量是在同一个范围（同一函数里），就视为已经声明，哪怕是在变量声明前就使用。

参考：《Javascript模式》p17-p18