/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	symbolFilled as templatePartIcon,
	header as headerIcon,
	footer as footerIcon,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import NewTempatePart from './new-template-part';
import NewHeader from './new-header';
import NewFooter from './new-footer';

export default [
	{
		id: 'new-template-part',
		title: __( 'New Template Part' ),
		icon: templatePartIcon,
		flow: NewTempatePart,
	},
	{
		id: 'new-header',
		title: __( 'New Header' ),
		icon: headerIcon,
		flow: NewHeader,
	},
	{
		id: 'new-footer',
		title: __( 'New Footer' ),
		icon: footerIcon,
		flow: NewFooter,
	},
];
