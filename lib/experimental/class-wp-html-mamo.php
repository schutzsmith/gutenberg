<?php

/**
 * Matches HTML and modifies matched content.
 */
class WP_HTML_MaMo {
	/**
	 * @var {string} The document being matched
	 */
	public $input;

	/**
	 * @var {string} Name of HTML tag to match.
	 */
	public $tag_name;

	/**
	 * @var {int} Offset into match results for find.
	 */
	public $match_offset;

	/**
	 * @var {string|null} CSS class name required for match, if any.
	 */
	public $containing_class;

	/**
	 * @var {[string, string|Callable]|string|null} HTML `data-` attribute required for match, if any.
	 */
	public $matching_data_attribute;

	//
	// Internal state for searching
	//

	/**
	 * @var {int|null} byte index into input document or null if no matches.
	 */
	public $start_at;

	/**
	 * @var {boolean} set if we know we can't match and should abort further processing
	 */
	public $match_already_failed;

	public function __construct( $input ) {
		$this->input = $input;
	}

	public function find( $descriptor ) {
		$parsed = self::parse_descriptor( $descriptor );
		$this->tag_name = $parsed['tag_name'];
		$this->match_offset = $parsed['match_offset'];
		$this->containing_class = $parsed['containing_class'];
		$this->matching_data_attribute = $parsed['matching_data_attribute'];

		$this->start_at = 0;
		$this->match_already_failed = false;

		$this->match( 0 );
	}

	/**
	 * @param $found_matches
	 * @return void
	 */
	public function match( $found_matches ) {
		if ( $found_matches === $this->match_offset + 1 ) {
			return;
		}

		/*
		 * Find the tag. This could fail if we have malformed HTML where there
		 * is a tag name inside an attribute value, e.g. `title="How to properly create a <div> tag"`
		 * These attribute values are invalid HTML but browsers do allow then and render them.
		 * If and when we want to fix this we would have to start scanning the document and
		 * track parsing state to know if we're in a tag or in an attribute, otherwise without
		 * that accounting we won't know if we're starting our matching from inside an attribute value.
		 */
		$matches = null;
		if ( 1 !== preg_match(
			// We could have no attributes <tag>, a void tag <tag/>, or a tag with spacing <tag a=b> / <tag /> / ...
			"~<{$this->tag_name}(?P<INSIDE_TAG>|/|[\u{09}\u{0a}\u{0c}\u{0d} ][^>]?*)>~i",
			$this->input,
			$matches,
			PREG_OFFSET_CAPTURE,
			$this->start_at
		) ) {
			$this->match_already_failed = true;
			return;
		}

		if ( null === $this->containing_class && null === $this->matching_data_attribute ) {
			$this->match( $found_matches + 1 );
			return;
		}

		list( 'INSIDE_TAG' => list( $inside_tag, $input_offset ) ) = $matches;
		$next_attribute = "~[\u{09}\u{0a}\u{0c}\u{0d} ]*(?P<NAME>[a-z][-a-z0-9]*)(?P<VALUE>)~"i;

		// Narrow on match
	}

	public static function parse_descriptor( $descriptor ) {
		$parsed = [];

		$tag_name = $descriptor['tag_name'];
		$parsed['tag_name'] = self::comparable( $tag_name );

		$match_offset = isset( $descriptor['match_index'] ) ? $descriptor['match_index'] : 0;
		if ( is_integer( $match_offset ) ) {
			$parsed['match_offset'] = $match_offset;
		} else {
			$parsed['match_offset'] = 0;
		}

		$containing_class = isset( $descriptor['class_name'] ) ? $descriptor['class_name'] : null;
		if ( is_string( $descriptor ) ) {
			$parsed['containing_class'] = self::comparable( $containing_class );
		} else {
			$parsed['containing_class'] = null;
		}

		$data_attribute = isset( $descriptor['data_attribute'] ) ? $descriptor['data_attribute'] : null;
		if ( is_string( $data_attribute ) ) {
			$parsed['matching_data_attribute'] = $data_attribute;
		} elseif ( is_array( $data_attribute ) && is_string( $data_attribute[0] ) && ( is_callable( $data_attribute[1] ) || function_exists( $data_attribute[1] ) ) ) {
			$parsed['matching_data_attribute'] = $data_attribute;
		} else {
			$parsed['matching_data_attribute'] = null;
		}

		return $parsed;
	}

	public static function comparable( $input ) {
		return strtolower( trim( $input ) );
	}
}
