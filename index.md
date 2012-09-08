---
layout: page
title: 前端开发_前端技术博客_生活感悟博客
keywords: 前端开发,css,js,less,javascript,git,python
description: 专注前端开发，喜欢jQuery，喜欢less，喜欢python，爱生活
---
{% include JB/setup %}

<div class="category Home">
  <div class="wrapper">躺着看书，站着做人</div>
</div>

<div class="mainContent wrapper fd-clr">
  <div class="content cell c66">
    <div class="side_bg"></div>
    {% assign posts_all = site.posts %}
    {% include custom/posts_all %}
  </div>

  <aside class="cell c32 last">
      {% include custom/aside %}
  </aside>
</div>




