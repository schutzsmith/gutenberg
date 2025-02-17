/**
 * External dependencies
 */
import { unescape as unescapeString, flatMap, compact } from 'lodash';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
/**
 * Internal dependencies
 */
import { SelectControl } from '../select-control';
import type { TreeSelectProps, Tree, SelectOptions } from './types';

function getSelectOptions( tree: Tree[], level = 0 ): SelectOptions {
	return flatMap( tree, ( treeNode ) => [
		{
			value: treeNode.id,
			label:
				'\u00A0'.repeat( level * 3 ) + unescapeString( treeNode.name ),
		},
		...getSelectOptions( treeNode.children || [], level + 1 ),
	] );
}

/**
 * TreeSelect component is used to generate select input fields.
 *
 * @example
 * ```jsx
 * import { TreeSelect } from '@wordpress/components';
 * import { useState } from '@wordpress/element';
 *
 * const MyTreeSelect = () => {
 * 	const [ page, setPage ] = useState( 'p21' );
 *
 * 	return (
 * 		<TreeSelect
 * 			label="Parent page"
 * 			noOptionLabel="No parent page"
 * 			onChange={ ( newPage ) => setPage( newPage ) }
 * 			selectedId={ page }
 * 			tree={ [
 * 				{
 * 					name: 'Page 1',
 * 					id: 'p1',
 * 					children: [
 * 						{ name: 'Descend 1 of page 1', id: 'p11' },
 * 						{ name: 'Descend 2 of page 1', id: 'p12' },
 * 					],
 * 				},
 * 				{
 * 					name: 'Page 2',
 * 					id: 'p2',
 * 					children: [
 * 						{
 * 							name: 'Descend 1 of page 2',
 * 							id: 'p21',
 * 							children: [
 * 								{
 * 									name: 'Descend 1 of Descend 1 of page 2',
 * 									id: 'p211',
 * 								},
 * 							],
 * 						},
 * 					],
 * 				},
 * 			] }
 * 		/>
 * 	);
 * }
 * ```
 */
export function TreeSelect( {
	label,
	noOptionLabel,
	onChange,
	selectedId,
	tree = [],
	...props
}: TreeSelectProps ) {
	const options = useMemo( () => {
		return compact( [
			noOptionLabel && { value: '', label: noOptionLabel },
			...getSelectOptions( tree ),
		] );
	}, [ noOptionLabel, tree ] );

	return (
		<SelectControl
			{ ...{ label, options, onChange } }
			value={ selectedId }
			{ ...props }
		/>
	);
}

export default TreeSelect;
