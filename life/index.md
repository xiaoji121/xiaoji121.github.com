---
layout: splash
title: "It's My Life"
---
{% include JB/setup %}

## 我的日记

<ul class="thumbnails">
  {% assign pages_icons = site.tags.diary %}
  {% include custom/pages_reversed %}
</ul>

## 骑行日志

<ul class="thumbnails">
  {% assign pages_icons = site.tags.ride %}
  {% include custom/pages_reversed %}
</ul>

## 旅途见闻

<ul class="thumbnails">
  {% assign pages_icons = site.tags.traval %}
  {% include custom/pages_reversed %}
</ul>