---
layout: post
title: "你不知道的EcmaScript5数组方法"
category: program
tags: [javascript]
comments: true
keywords: javascript,数组,EcmaScript5
description: |
 这篇文章通过一个简单到只能实现四则预算的计算器例子，让大家了解一下EcmaScript5中的数组方法的特殊用法。
---

先看一下我做的一个<a href="/demo/calculater/calculater.html" target="_blank">计算器</a>的例子吧。

我们把那些在EcmaScript5中才被引入的数组方法叫做```Array Extras```,例如下面这些方法：

<ul>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map" target="_blank">
			Array.prototype.map
		</a>
	</li>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce" target="_blank">
			Array.prototype.reduce
		</a>
	</li>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight" target="_blank">
			Array.prototype.reduceRight
		</a>
	</li>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter" target="_blank">
			Array.prototype.filter
		</a>
	</li>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach" target="_blank">
			Array.prototype.forEach
		</a>
	</li>
		
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every" target="_blank">
			Array.prototype.every
		</a>
	</li>
	<li>
		<a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some" target="_blank">
			Array.prototype.some
		</a>
	</li>
</ul>

看到这儿，你可能要问了：这些方法谁不知道啊？是啊，这些方法大家或多或少知道些，但下面这个函数中的某些用法，你未必知道了，看看吧！

这个函数是我上面那个计算器中的一个核心函数。

<pre class="prettyprint">
function calculate( calculation ) {
  var parts = calculation.match(/(?:\-?[\d\.]+)|[-\+\*\/]|\s+/g);
  
  if( calculation !== parts.join("") ) {
    throw new Error("Couldn't parse calculation");
  }

  parts = parts.map(Function.prototype.call,String.prototype.trim);
  parts = parts.filter(Boolean);

  var nums = parts.map(parseFloat);
  var processed = [];

  for( var i = 0; i < parts.length; i++ ) {
    if( nums[i] === nums[i] ) {
      processed.push( nums[i] );
    } else {
      switch( parts[i] ) {
        case "+":
          continue;
        case "-":
          processed.push(nums[++i] * -1);
          break;
        case "*":
          processed.push(processed.pop() * nums[++i]);
          break;
        case "/":
          processed.push(processed.pop() / nums[++i]);
          break;
        default:
          throw new Error("unknown operation: " + parts[i]);
      }
    }
  }

  return processed.reduce(function(result,elem) {
    return result + elem;
  });
}
</pre>

这段短短的函数有几处可圈可点：

1.短短的代码中用到了3个Array Extras:

map: ```parts = parts.map(Function.prototype.call,String.prototype.trim)```

filter: ```parts = parts.filter(Boolean)```

reduce: 

<pre class="prettyprint">
return processed.reduce(function(result,elem) {
	return result + elem;
});
</pre>

2.Array Extras的用法很特别：

```parts = parts.map(Function.prototype.call,String.prototype.trim)```

这段代码如果让我们写，我们可能这样写：

<pre class="prettyprint">
parts = parts.map(function( elem, index, arr ) {
	return elem.trim();
});
</pre>

同样，```parts = parts.filter(Boolean)```,我们可能写成：

<pre class="prettyprint">
parts = parts.filter(function( elem, index, arr ) {
	return Boolean( elem );
})
</pre>

3.巧妙地利用```NaN !== NaN```判断运算符：

<pre class="prettyprint">
if( nums[i] === nums[i] ) {
  processed.push( nums[i] );
}
</pre>

关于Array Extras的更多沁人心脾的用法，请参考<a href="http://net.tutsplus.com/tutorials/javascript-ajax/what-they-didnt-tell-you-about-es5s-array-extras/" target="_blank">这里</a>
