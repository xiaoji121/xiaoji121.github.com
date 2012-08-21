---
layout: post
title: "FireFox下的table-layout:fixed"
category: program
tags: [css]
comments: true
description: |
 几次项目中，使用表格时都遇到了设置table-layout属性的表格单元格宽度和其他浏览器的差异性问题，今天终于搞明白了。
---

### 背景知识

	“auto”（自动算法）适用于任何表格布局，CSS规范并没有明确规定用户端在表格布局时必须遵守何种算法，此种算法反映了传统HTML表格的特征，每列的宽度是由各列单元格中没有折行的最宽的内容设定的，自动算法有时会较慢，因为它需要在下载完整个表格并访问表格中所有的内容后才能决定表格的最终布局。

	'fixed'（固定布局算法）适用于固定表格布局，这是一种快速算法，表格的水平布局不依赖于单元格的内容，而只依赖于表格的宽度，列的宽度以及边框或单元格的间隔。使用固定布局算法，用户端在下载完第一行后就可以开始表格布局，后续行的单元格不影响列宽。

### 问题描述

我遇到的问题是：

给一个table设置```table-layout:fixed```属性，并且给table一个宽度。比如说这个table有一行三列，每一列我都设置了宽度，并且保证它们的总宽度不超过table的宽度。与此同时，我给每个td一个padding值,这个table的cellpadding和cellspacing都是0.

按理说，单元格的内容宽度加上它的padding值就应该是我设置的单元格宽度啊。对啊，除去firefox，其他浏览器的确是这样的。firefox显示的是，单元格内容宽度就是我设置的单元格宽度，而padding值被排除在我设置的单元格宽度之外了，也就是说，单元格宽度变宽了，宽出了padding值的宽度。

可能没有说清楚，直接上代码吧：


	<table style="width:200px; table-layout:fixed; background:darkkhaki;" cellpadding="0" cellspacing="0">
	  <tr>
		<td style="width:50px; background:plum;"> <!--  【TD1】  -->
		  <div style="background:pink;">AAA</div>
		</td>
		<td style="width:100px; background:dodgerblue; padding-left:20px;"> <!--  【TD2】  -->
		  <div style="background:lightblue;">BBB</div>
		</td>
		<td style="background:crimson;"> <!--  【TD3】  -->
		  <div style="background:gold;">CCC</div>
		</td>
	  </tr>
	</table>

第二列设置了```padding-left:20px```，在除firefox的浏览器中第二列的宽度是100px,firefox下第二列的宽度是120px,大家可以打开这个[demo0](/demo/table-layout/layout0.html)，自己在firefox和其他浏览器下验证一下。

这是因为火狐在计算单元格宽度的算法上与其他浏览器的算法不太一样。具体的算法和解释以及各种情况下的说明，在w3help的<a href="http://w3help.org/zh-cn/causes/RE8001" target="_blank">一篇文章</a>中已经写的很详细了，作者的学术精神，我着实佩服，自己也就不班门弄斧了。

在我的这篇文章里，我也只是将上面文章作者提到的用百分比设置表格宽度时，Firefox和其他浏览器的算法做了个总结，以便进行其他分析时做个参考，也是做个备忘。同时，略过繁琐的算法，直接回归解决问题的方法上。

### 算法总结

列的可用宽度的计算方法：

IE Chrome Safari Opera中：

列的可用内容宽度之和 = 表格的可用宽度 - 列的左右边框之和 - 单元格间距之和 

列的实际宽度 = 列的可用内容宽度之和 * 列的百分比宽度

列的内容宽度 = 列的实际宽度 - 列的padding

FireFox中：

列的可用内容宽度之和 = 表格的可用宽度 - ```列的左右边白之和``` - 列的左右边框之和 - 单元格间距之和

列的实际宽度 = 列的可用内容宽度之和 * 列的百分比宽度 + 列的 padding

列的内容宽度 = 列的实际宽度 - 列的 padding

这里的```列的左右边白之和```指的是cellpadding值，或者单元格的padding值，当一个单元格既有从table上得来的cellpadding又有padding的时候，以padding值为准。

### 解决方案

* 在 'table-layout:fixed' 这种固定布局算法下的表格中，可以为表格最后一列不设置宽度，尽量消除由算法差异带来的列的宽度差异。

* 最好不要给td设置padding值，如果一定要有的话，再嵌套一层标签，或div,或p，或者什么都行，给这些标签设置padding.