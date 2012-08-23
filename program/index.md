---
layout: splash
title: "我的工作，也是另外一种生活"
---
{% include JB/setup %}

## HTML/CSS

<ul class="thumbnails">
  {% assign pages_icons = site.tags.css %}
  {% include custom/pages_reversed %}
</ul>

## JavaScript

<ul class="thumbnails">
  {% assign pages_icons = site.tags.javascript %}
  {% include custom/pages_reversed %}
</ul>

## Git

<ul class="thumbnails">
  {% assign pages_icons = site.tags.git %}
  {% include custom/pages_reversed %}
</ul>