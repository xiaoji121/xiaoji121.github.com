---
layout: page
title: 前端开发_猿来如此_xiaoji121的个人博客
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
    <div class="weiboArea">
      {% include custom/weibo %}
    </div>
  </div>
</div>




