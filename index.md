---
layout: page
title: 前端开发_前端技术博客_生活感悟博客
keywords: 前端开发,css,js,less,javascript,git,python
description: 专注前端开发，喜欢jQuery，喜欢less，喜欢python，爱生活
---
{% include JB/setup %}

<div class="content clear">
  <p class="motto">躺着看书，站着做人</p>

  <div class="leftContent">
    {% assign posts_all = site.posts %}
    {% include custom/posts_all %}
  </div>

  <div class="rightContent">
    <div class="archive">
      <h1>文章归档</h1>
      {% assign posts_collate = site.posts %}
      {% include JB/posts_collate %}
    </div>
  </div>
</div>




