---
layout: default
title: "Shape Of My Life"
---
{% include JB/setup %}

<div class="category Life">
  <div class="wrapper">生活剪影</div>
</div>

<div class="mainContent wrapper fd-clr">
  <div class="content cell c66">
    <div class="side_bg"></div>
    {% assign posts_all = site.posts %}
    {% include custom/posts_life %}
  </div>

  <aside class="cell c32 last">
      {% include custom/aside %}
  </aside>
</div>