<?php
require get_theme_file_path('includes/search-route.php');
require get_theme_file_path('includes/like-route.php');

function pageBanner($args = null) {
  if (!$args['title']) {
    $args['title'] = get_the_title();
  }
  if (!$args['subtitle']) {
    $args['subtitle'] = get_field('page_banner_subtitle');
  }
  if (!$args['photo']) {
    if (get_field('page_banner_background_image')) {
      $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
    } else {
      $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }

  ?>
    <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>);"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title']; ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle']; ?></p>
        </div>
      </div>  
    </div>
  <?php
}

function university_files() {
  // wp_enqueue_script('main-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
  wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  // wp_enqueue_style('university_main_styles', get_stylesheet_uri());

  wp_enqueue_script('google-map', '//maps.googleapis.com/maps/api/js?key=AIzaSyCa4v2yhco6vB34OXV2lCp2k5z-Bh6HLJ4', NULL, '1.0', true);

  if (strstr($_SERVER['SERVER_NAME'], 'localhost')) {
    wp_enqueue_script('main-js', 'http://localhost:3000/bundled.js', NULL, '1.0', true);
  } else {
    wp_enqueue_script('our-vendors-js', get_theme_file_uri('/bundled-assets/vendors.js'), NULL, '1.0', true);
    wp_enqueue_script('main-js', get_theme_file_uri('/bundled-assets/scripts.js'), NULL, '1.0', true);
    wp_enqueue_style('our-main-style', get_theme_file_uri('/bundled-assets/styles.css'));
  }

  wp_localize_script('main-js', 'universityData', [
    'root_url' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest')
  ]); 
}

function university_features() {
  // register_nav_menu('headerMenuLocation', 'Header Menu Location');
  // register_nav_menu('footerMenuLocationOne', 'Footer Menu Location One');
  // register_nav_menu('footerMenuLocationTwo', 'Footer Menu Location Two');
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  // add_image_size('professorLandscape', 400, 260, ['left', 'top']);
  add_image_size('professorLandscape', 400, 260, true);
  add_image_size('professorPortrait', 480, 650, true);
  add_image_size('pageBanner', 1500, 350, true);
}

function university_adjust_queries($query) {
  if (!is_admin() && is_post_type_archive('event') && $query->is_main_query()) {
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', [
      [
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      ]
    ]);
  }

  if (!is_admin() && is_post_type_archive('program') && $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }

  if (!is_admin() && is_post_type_archive('campus') && $query->is_main_query()) {
    $query->set('posts_per_page', -1);
  }
}

function universityMapKey($api) {
  $api['key'] = 'AIzaSyCa4v2yhco6vB34OXV2lCp2k5z-Bh6HLJ4';
  return $api;
}

function custom_rest() {
  register_rest_field('post', 'authorName', [
    'get_callback' => function() {return get_the_author();}
  ]);

  register_rest_field('note', 'noteCount', [
    'get_callback' => function() {return count_user_posts(get_current_user_id(), 'note');}
  ]);
}

function redirectSubsToFrontend() {
  $currentUser = wp_get_current_user();
  if (count($currentUser->roles) == 1 && $currentUser->roles[0] == 'subscriber') {
    wp_redirect(site_url('/'));
    exit;
  }
}

function noSubsAdminBar () {
  $currentUser = wp_get_current_user();
  if (count($currentUser->roles) == 1 && $currentUser->roles[0] == 'subscriber') {
    show_admin_bar(false);
  }
}

function ourHeaderUrl() {
  return esc_url(site_url('/'));
}

function ourLoginCSS() {
  wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');

  if (strstr($_SERVER['SERVER_NAME'], 'localhost')) {
    wp_enqueue_script('main-js', 'http://localhost:3000/bundled.js', NULL, '1.0', true);
  } else {
    wp_enqueue_script('our-vendors-js', get_theme_file_uri('/bundled-assets/vendors.js'), NULL, '1.0', true);
    wp_enqueue_script('main-js', get_theme_file_uri('/bundled-assets/scripts.js'), NULL, '1.0', true);
    wp_enqueue_style('our-main-style', get_theme_file_uri('/bundled-assets/styles.css'));
  }
}

function ourLoginTitle() {
  return get_bloginfo('name');
}

function makeNotePrivate($data, $postarr) {
  if ($data['post_type'] == 'note') {
    if (count_user_posts(get_current_user_id(), 'note') > 4 && !$postarr['ID']) {
      die('You have reached your note limit');
    }

    $data['post_content'] = sanitize_textarea_field($data['post_content']);
    $data['post_title'] = sanitize_text_field($data['post_title']);
  }

  if ($data['post_type'] == 'note' && $data['post_status'] != 'trash') {
    $data['post_status'] = 'private';
  }
  return $data;
}

function ignoreCertainFiles($exclude_filters) {
  $exclude_filters[] = 'themes/university-theme/node_modules';
  return $exclude_filters;
}

add_action('wp_enqueue_scripts', 'university_files');
add_action('after_setup_theme', 'university_features');
add_action('pre_get_posts', 'university_adjust_queries');
add_action('rest_api_init', 'custom_rest');
add_action('admin_init', 'redirectSubsToFrontend');
add_action('wp_loaded', 'noSubsAdminBar');
add_action('login_enqueue_scripts', 'ourLoginCSS');

add_filter('acf/fields/google_map/api', 'universityMapKey');
add_filter('login_headerurl', 'ourHeaderUrl');
add_filter('login_headertitle', 'ourLoginTitle');
add_filter('wp_insert_post_data', 'makeNotePrivate', 10, 2);
add_filter('ai1wm_exclude_content_from_export', 'ignoreCertainFiles');