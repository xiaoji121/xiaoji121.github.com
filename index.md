---
layout: page
title: xiaoji121的个人博客
description: 前端开发|程序员
---
{% include JB/setup %}

<div class="content clear">
  <p class="motto">躺着看书，站着做人</p>

  <div class="leftContent">
    {% assign posts_all = site.posts %}
    {% assign count = 10 %}
    {% include custom/posts_all %}
  </div>

  <div class="rightContent">
    <div class="weiboArea">
      {% include custom/weibo %}
    </div>
  </div>
</div>




