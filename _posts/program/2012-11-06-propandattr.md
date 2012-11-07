---
layout: post
title: "javascript那些事儿——properties和attributes"
category: program
tags: [chrome,extension]
comments: true
keywords: javascript,property，attribute，ie
description: |
 很多人对Javascript中的properties和attributes都很迷惑，在英文中这两个词属同义词。不光是我们，浏览器中的IE8之前的版本包括IE8的兼容模式，对它们同样很迷惑，这是我的一篇翻译文章。
---

英文原文请看<a href="http://javascript.info/tutorial/attributes-and-custom-properties" target="_blank">Attributes and custom properties</a>。这篇文章中的代码示例在原文中都可以运行。需要运行代码看结果的同学们，请到原文中运行。

```注：我在这篇文章里将attribute翻译成属性，将property翻译成特性，自认为这是严谨的。```

一个DOM节点可能既有属性也有特性。人们经常混淆这两个概念，因为它们相互关联但的确又是两个不同的东西。

## 特性

### DOM节点也是个对象，所以它能像Javascript的对象一样，存储一些自定义的特性和方法。

下面这个例子将myData这个对象作为一个特性赋给了document.body。

<pre class="prettyprint">
document.body.myData = { 
  name: 'John'
}

alert(document.body.myData.name) // John

document.body.sayHi = function() { 
  alert(this.nodeName)
}
 
document.body.sayHi()  // BODY

</pre>

自定义的特性和方法只在javascript中可见，不影响HTML。

与此同时，自定义的特性可以用for...in遍历到，它们和原生的特性混在一起。

<pre class="prettyprint">
document.body.custom = 5

var list = []
for(var key in document.body) {
  list.push(key)
}

alert(list.join('\n'))
</pre>

自定义的DOM对象特性有以下特点:

* 可能有任意值，特性名是大小写敏感的
* 不影响HTML

## 属性

DOM节点提供以下获取HTML属性的标准方法：

	* elem.hasAttribute(name)-----检查属性是否存在
	* elem.getAttribute(name)-----获取属性值
	* elem.setAttribute(name,value)-----设置属性
	* elem.removeAttribute(name)-----移除属性

	敬告：这些属性在IE<8和IE8的兼容模式下是被误解的：
	* 只存在getAttribute和setAttribute方法
	* 这些方法实际上修改的是DOM对象的特性，而不是属性
	* 属性和特性在IE<8的环境中是被合并了的。有时这引发奇怪的结果，但是我们在这里讨论的管理属性的方法工作良好。

相对于特性，属性有以下特点：

	* 可能只接受字符串
	* 名字大小写不敏感，因为HTML的属性就是大小写不敏感的
	* 它们可以出现在innerHTML里（除了更老版本的IE）
	* 你可以通过元素的attributes伪数组特性列举所有属性

举个例子，让我们看看下面的HTML片段：

<pre class="prettyprint lang-html">
	&lt;body&gt;
		&lt;div about="Elephant" class="smiling"&gt;&lt;/div&gt;
	&lt;/body&gt;
</pre>

下面的这个例子设置属性。

<pre class="prettyprint">
&lt;body&gt;
  &lt;div about="Elephant" class="smiling"&gt;&lt;/div&gt;

  &lt;script&gt;
    var div = document.body.children[0]
    alert( div.getAttribute('ABOUT') ) // (1)
    
    div.setAttribute('Test', 123)   // (2)
    alert( document.body.innerHTML )   // (3)
  &lt;/script&gt;
&lt;/body&gt;

</pre>

当你运行上面的代码的时候，请注意下面几点：

	* ```getAttribute('ABOUT')```用大写的属性名，不过这没有关系
	* 你可以试着给属性赋除字符串外的其他基本类型值，但它们都会被转化成字符串。如果是对象的话，也会被自动转化成字符串。但在IE下对象可能会有问题，所以还是坚持用基本类型值。
	*innerHTML中包含了新加的"test"属性

## 特性和属性的同步性

每种类型的DOM节点都有其标准的特性。

例如，'A'标签：<a href="http://www.w3.org/TR/REC-DOM-Level-1/level-one-html.html#ID-48250443">Interface HTMLAnchorElement</a>

它有"href"和"accessKey"还有其他特殊的属性。它从<a href="http://www.w3.org/TR/REC-DOM-Level-1/level-one-html.html#ID-58190037">HTMLElement</a>继承了"id"和其他属性。

### 标准的DOM特性和属性是同步的

#### id

比如，浏览器同步了"id"属性和"id"特性

<pre class="prettyprint">
&lt;script&gt;
  document.body.setAttribute('id','la-la-la')
  alert(document.body.id) // la-la-la
&lt;/script&gt;
</pre>

#### href

<strong>同步性并没有保证值的一致</strong>，让我们一"href"为例。

<pre class="prettyprint">
&lt;a href="#"&gt;&lt;/a&gt;
&lt;script&gt;
  var a  = document.body.children[0]

  a.href = '/'
  alert( 'attribute:' + a.getAttribute('href') ) // '/'
  alert( 'property:' + a.href )  // IE: '/', others: full URL

&lt;/script&gt;

</pre>

这是因为，href<a href="http://www.w3.org/TR/REC-html40/struct/links.html#adef-href">根据W3C的定义</a>必须是格式良好的链接。

有一些其他的属性，是同步的，但值却不同。例如，input.checked：

<pre class="prettyprint">
&lt;input type="checkbox" checked&gt;

&lt;script&gt;
  var input  = document.body.children[0]

  alert( input.checked ) // true
  alert( input.getAttribute('checked') ) // empty string
&lt;/script&gt;
</pre>

input.checked特性的值要么是true要么是false，但是这个属性的值就是你赋给它的值。

#### value

<strong>也有内建特性是单向同步的</strong>

比如说，input.value可以从属性上同步过来：

<pre class="prettyprint">
&lt;input type="checkbox" checked&gt;

&lt;script&gt;
&lt;body&gt;
  &lt;input type="text" value="markup"&gt;
  &lt;script&gt;
    var input = document.body.children[0]

    input.setAttribute('value', 'new')

    alert( input.value ) // 'new', input.value changed
  &lt;/script&gt;
&lt;/body&gt;

</pre>

但是，这个属性却不能从特性那同步过来：

<pre class="prettyprint">
&lt;body&gt;
  &lt;input type="text" value="markup"&gt;
  &lt;script&gt;
    var input = document.body.children[0]

    input.value = 'new'

    alert(input.getAttribute('value')) // 'markup', not changed!
  &lt;/script&gt;
&lt;/body&gt;
</pre>

当特性的值更新后属性还是保持着原始的值。比如当一个客户输入些东西的时候，原始的值可以被用来检车input标签的值是否发生了变化，或者用于重置的时候。

#### class/className

<strong>命名异常："class"属性和className特性的联系</strong>

因为，在Javascript中"class"是一个保留字，与"class"属性相关联的特性是className.

<pre class="prettyprint">
&lt;body&gt;
  &lt;script&gt;
    document.body.setAttribute('class', 'big red bloom')

    alert( document.body.className )  // ^^^
  &lt;/script&gt;
&lt;/body&gt;

</pre>

注意，上面的例子在IE<9中不好用，因为在它们中特性和属性被混淆了。

但是，我们也能和它和平共处，方法就是总是用className特性管理classes，而不是属性。

### 和老版本IE玩出乐趣来

<strong>首先，IE<9中，同步了所有特性和属性</strong>

<pre class="prettyprint">
document.body.setAttribute('try-in-ie', 123)

alert( document.body['try-in-ie'] === 123 )  // true in IE<9
</pre>

注意，这里的123没有被转化成字符串。

<strong>第二，在IE<8(或者在处于IE7兼容模式的IE8中)特性和属性是同一个</strong>这样就引发了一个可笑的结果。

比如，特性名是大小写敏感的，而属性不是。如果浏览器认为它们是同一个值的话，那么下面这段代码的结果又如何呢？

<pre class="prettyprint">
document.body.abba = 1 // assign property (now can read it by getAttribute)
document.body.ABBA = 5 // assign property with another case

// must get a property named 'ABba' in case-insensitive way.
alert( document.body.getAttribute('ABba') ) // ??

</pre>

浏览器会跳过这个陷阱而默认采用第一个值。它也为getAttribute提供了第二个可选的只有IE支持的参数，这个参数标示了是不是大小写敏感。具体请看<a href="http://msdn.microsoft.com/en-us/library/ms536429(v=vs.85).aspx">MSDN getAttribute</a>。

在所有的浏览器中，除了ie<9,"class"属性可用来更改class。所以，任何时候都不要用attribute,要用className.

	为了与IE和平相处，要正确地使用属性。

	换句话说，尽量使用特性，除非你真的需要属性的时候。

	仅限以下情况，你可能真的需要属性：

	* 为了获取一个HTML自定义属性，因为它和DOM的特性不同步
	* 为了获取标准HTML属性的初始值，像<input value="...">

### 作为DOM节点的Attributes

属性同样可以通过elem.attributes集合获得。

在attributes集合中，每个属性都被<a href="http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-637646024">一个特殊的DOM节点</a>代表。它有名字，值和其他特性。

比如：

<pre class="prettyprint">
&lt;span style="color:blue" id="my"&gt;text&lt;/span&gt;

&lt;script&gt;
  var span = document.body.children[0]
  alert( span.attributes['style'].value )  // "color:blue;"
  alert( span.attributes['id'].value )  // "my"
&lt;/script&gt;
</pre>

对了，在IE<8和IE8的兼容模式中"style"属性 会暴走，猜猜为什么？

属性的DOM节点不是文档树的一部分，它们只能通过它们的元素获得。

## 总结

attributes和properties都是DOM模型的特性。

<table class="bordered">
<tbody><tr>
<th>Properties</th>
<th>Attributes</th>
</tr>
<tr>
<td>Any value</td>
<td>String</td>
</tr>
<tr>
<td>Names are case-sensitive</td>
<td>not case-sensitive</td>
</tr>
<tr>
<td>Don’t show up in <code>innerHTML</code></td>
<td>Visible in <code>innerHTML</code></td>
</tr>
<tr>
<td colspan="2">Standard DOM properties and attributes are synchronized, custom are not.</td>
</tr>
<tr>
<td colspan="2">Attributes are mixed with properties and screwed up in IE&lt;8, IE8 compat. mode.</td>
</tr>
</tbody></table>

如果你想在HTML中使用自定义属性，记得data-*属性在HTML5中可用。详情查看HTML5标准<a href="http://dev.w3.org/html5/spec/Overview.html#custom-data-attribute">Custom data attributes</a>。

现实中，98%我们都在用DOM对象的特性。

只有两种情况，你应该用属性

	* 一个自定义的HTML属性，因为它和DOM特性不同步
	* 为了获得一个内奸的HTML属性，这个属性和它特性不同步，并且你确定需要这个属性。

例如，value in input.
