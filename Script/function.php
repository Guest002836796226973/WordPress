<?php
/*!
 * Theme name:
 * Theme URI:
 * Description: Thème de Petitpoids
 * Author: Petitpoids
 * Author URI: petitdoigts.fr
 * Version: 1.0.0
 * License: Projet GNU
 * Requires PHP: 8.3
 * Text Domain:
 *//* --- F O N C T I O N --- */



/* patch youtube */
add_filter('embed_oembed_html', 'html_youtube_replace', 10, 6);
function html_youtube_replace( $html, $cached_html, $url, $content, $post_id, $attr) {
    if (str_contains($html, $strings_to_replace)) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $html = str_replace( $strings_to_replace, 'youtube-nocookie.com', $html);
    } else if ( str_contains($cached_html, $strings_to_replace) ) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $cached_html = str_replace( $strings_to_replace, 'youtube-nocookie.com', $cached_html);
	} else if ( str_contains($url, $strings_to_replace) ) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $url = str_replace( $strings_to_replace, 'youtube-nocookie.com', $url);
	} else if ( str_contains($content, $strings_to_replace) ) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $content = str_replace( $strings_to_replace, 'youtube-nocookie.com', $content);
	} else if ( str_contains($post_id, $strings_to_replace) ) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $post_id = str_replace( $strings_to_replace, 'youtube-nocookie.com', $post_id);
	} else if ( str_contains($attr, $strings_to_replace) ) {
       $strings_to_replace = array( 'youtube.com', 'youtu.be' );
       $attr = str_replace( $strings_to_replace, 'youtube-nocookie.com', $attr);
	}	
    return $strings_to_replace;
}

?>
