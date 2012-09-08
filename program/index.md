---
layout: default
title: "我的工作，也是另外一种生活"
---
{% include JB/setup %}

<div class="category Coding">
  <div class="wrapper">程序似猿</div>
</div>

<div class="mainContent wrapper fd-clr">
  <div class="content cell c66">
    <div class="side_bg"></div>
    {% assign posts_all = site.posts %}
    {% include custom/posts_program %}
  </div>

  <aside class="cell c32 last">
      {% include custom/aside %}
  </aside>
</div>