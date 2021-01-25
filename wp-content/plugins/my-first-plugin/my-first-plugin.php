<?php

/*
Plugin Name: My Plugin
Description: This plugin will change the world
*/

function amazingContentEdits($content) {
  $content = $content . '<p>All content belongs to fictional university</p>';
  $content = str_replace('Lorem', '****', $content);
  return $content;
}

function programCountFunction() {
  $likeCount = new WP_Query([
    'post_type' => 'program'
  ]);
  return $likeCount->found_posts;
}

add_filter('the_content', 'amazingContentEdits');

add_shortcode('programCount', 'programCountFunction');
