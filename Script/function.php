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
add_filter('embed_oembed_html', 'remplace_youtube', 10, 6);
function remplace_youtube( $html, $cached_html, $url, $content, $post_id, $attr) {
    $i = 1;
    do {
	echo $i;
	// $i++; // compte à rebours;
    $fragmenter = parse_url($url);
	$you_t = preg_match('/^((m|www)\.)?youtube\.com|youtu\.be$/i', $fragmenter['host']);
	if ( !$you_t ) {
        $html = str_replace( $you_t, 'youtube-nocookie.com', $html );
    }	
    $iframe_yt = preg_match( '/<iframe[^>]*>/', $html );
    $replace = array( 'youtube.com', 'youtu.be' ); 
    if ( !$iframe_yt ) {
        $iframe_yt = str_replace( $replace, 'youtube-nocookie.com', $html );
    } else if (str_contains($html, $replace)) {
       $html = str_replace( $replace, 'youtube-nocookie.com', $html);
    } else if ( str_contains($cached_html, $replace) ) {
       $cached_html = str_replace( $replace, 'youtube-nocookie.com', $cached_html);
	} else if ( str_contains($url, $replace) ) {
       $url = str_replace( $replace, 'youtube-nocookie.com', $url);
	} else if ( str_contains($content, $replace) ) {
       $content = str_replace( $replace, 'youtube-nocookie.com', $content);
	} else if ( str_contains($post_id, $replace) ) {
       $post_id = str_replace( $replace, 'youtube-nocookie.com', $post_id);
	} else if ( str_contains($attr, $replace) ) {
       $attr = str_replace( $replace, 'youtube-nocookie.com', $attr);
	}
    }
	while ($i < 2); // tourne en boucle
}
