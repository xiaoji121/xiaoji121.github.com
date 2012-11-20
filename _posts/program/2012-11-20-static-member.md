---
layout: post
title: "javascript中的静态成员"
category: program
tags: [javascript]
comments: true
keywords: javascript,静态成员，私有成员，公有静态成员，私有静态成员
description: |
 静态成员是在类的层次上操作，而不是在实例的层次上操作。静态属性和方法也就是那些从一个实例到另一个实例都不会发生改变的属性和方法。
---

在javascript中并没有特殊的语法来表示静态成员。但是可以通过使用构造函数并且向其添加属性这种方式，从而获得与“类式”语言相通的语法。

在基于类的语言中，静态成员是通过特殊的语法创建的，并且在使用过程中如同类本身的成员一样。例如，对于MathUtils类的静态方法max(),其调用形式为MathUtils.max(3,5),这就是一个公有静态成员的例子，而静态方法max()可以在没有创建任何该类的实例时使用。此外也存在私有静态成员，对于该类的用户而言是不可见的，但是仍然可以在类的多个实例间共享。

## 公有静态成员

下面的例子向您展示了如何以静态或非静态方式调用同一个方法。

<pre class="prettyprint">
// ​构造函数
var Gadget = function(price){
	this.price = price;
};

// 静态方法
Gadget.isShiny = function(){
    var msg = "you bet";

    if(this instanceof Gadget){
    	// this only works if called non-statically
    	msg += ", it costs $" + this.price + "!";
    }

    return msg;
};

// 向该原型中添加一个普通的方法
Gadget.prototype.isShiny = function(){
	return Gadget.isShiny.call(this);
}

alert(Gadget.isShiny());// you bet

var a = new Gadget('499.99');
alert(a.isShiny());// you bet, it costs $499.99
</pre>

如果想要运行的话，请到<a href="http://jsfiddle.net/xiaoji121/LmUXD/" target="_blank">这里</a>。

## 私有静态成员

就私有静态成员而言，指的是成员具有如下属性：
	
	以同一个构造函数创建的所有对象共享该成员
	
	构造函数外部不可访问该成员

下面的例子向您展示了私有静态成员的用法：

<pre class="prettyprint">
// 构造函数
var Gadget = (function(){

	// 静态变量/属性
	var counter = 0
		,newGadget;

	// 这将成为新的构造函数的实现
	newGadget = function(){
		counter += 1;
	};

	// 特权方法
	newGadget.prototype.getLastId = function(){
		return counter;
	}

	return newGadget;
})();

var iphone = new Gadget();
alert(iphone.getLastId());// 1

var ipod = new Gadget();
alert(ipod.getLastId());// 2
</pre>

如果想要运行的话，请到<a href="http://jsfiddle.net/xiaoji121/MsafS/" target="_blank">这里</a>。

静态属性（公有和私有）使用会带来很多便利。它们可以包含非实例相关的方法和数据，并且不会为每个实例重新创建静态属性。

要判断一个私有方法是否应该被设计成静态方法，一条经验法则是看它是否需要访问任何实例数据。如果它不需要，那么将其设计为静态方法会更有效率（从内存占用的意义上来说），因为它只会被创建一份。

参考：《javascript模式》p108-111《javascript设计模式》p32-35.