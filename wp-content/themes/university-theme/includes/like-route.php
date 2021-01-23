<?php

function createLike($data) {
  // if (current_user_can('publish_note')) {
  if (is_user_logged_in()) {
    $professorId = sanitize_text_field($data['professorId']);
    $existLike = new WP_Query([
      'author' => get_current_user_id(),
      'post_type' => 'like',
      'meta_query' => [
        [
          'key' => 'liked_professor_id',
          'compare' => '=',
          'value' => $professorId
        ]
      ]
    ]);
    if ($existLike->found_posts == 0 && get_post_type($professorId) == 'professor') {
      return wp_insert_post([
        'post_type' => 'like',
        'post_status' => 'publish',
        'post_title' => 'another test',
        'meta_input' => [
          'liked_professor_id' => $professorId
        ]
      ]);
    } else {
      die('invalid professor id');
    }
  } else {
    die('Only logged in users can like.');
  }
}

function deleteLike($data) {
  $likeId = sanitize_text_field($data['like']);
  if (get_current_user_id() == get_post_field('post_author', $likeId) && get_post_type($likeId) == 'like') {
    wp_delete_post($likeId, true);
    return 'congrats. like deleted';
  } else {
    die('You do not have permission to delete this');
  }
}

function likeRoutes() {
  register_rest_route('university/v1', 'like', [
    'methods' => 'POST',
    'callback' => 'createLike'
  ]);

  register_rest_route('university/v1', 'like', [
    'methods' => 'DELETE',
    'callback' => 'deleteLike'
  ]);
}

add_action('rest_api_init', 'likeRoutes');