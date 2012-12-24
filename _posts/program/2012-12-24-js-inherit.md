---
layout: post
title: "javascript中的继承"
category: program
tags: [javascript]
comments: true
keywords: javascript,继承，原型链
description: |
 这篇文章将介绍javascript中的继承，原型链和继承的几种模式以及这些模式存在的问题，最后得到一个相对完美的继承模式。
---

## 原型链

原型链是实现继承的主要方法。

简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。

那么，假如我们让原型对象等于另一个类型的实例，结果会怎样呢？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系仍然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型的基本概念。

<pre class="prettyprint">
function SuperType() {
	this.property = true;
}

SuperType.prototype.getSuperValue = function() {
	return this.property;
}

function SubType() {
	this.subproperty = false;
}

// 继承了SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function() {
	return this.subproperty;
}

var instance = new SubType();
alert(instance.getSuperValue());       	//true

alert(instance instanceof Object);		//true
alert(instance instanceof SuperType);	//true
alert(instance instanceof SubType);		//true

alert(Object.prototype.isPrototypeOf(instance));	//true
alert(SuperType.prototype.isPrototypeOf(instance));	//true
alert(SubType.prototype.isPrototypeOf(instance));	//true
</pre>

<img src="/images/jsinherit/1.JPG" alt="">

instance指向SubType.prototype,SubType.prototype又指向了SuperType.prototype。getSuperValue()方法仍然还在Supertype.prototype中，但property则位于SubType.prototype中。这是因为property是一个实例属性，而getSuperValue()则是一个原型方法。

所有函数的默认原型都是Object的实例，所以完整的原型链如下：

<img src="/images/jsinherit/3.JPG" alt="">

---未完待续