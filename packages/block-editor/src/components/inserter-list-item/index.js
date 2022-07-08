/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	useCallback,
	memo,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { ENTER } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { InserterListboxItem } from '../inserter-listbox';
import InserterDraggableBlocks from '../inserter-draggable-blocks';

/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window window object by default; used for DI testing.
 *
 * @return {boolean} True if MacOS; false otherwise.
 */
function isAppleOS( _window = window ) {
	const { platform } = _window.navigator;

	return (
		platform.indexOf( 'Mac' ) !== -1 ||
		[ 'iPad', 'iPhone' ].includes( platform )
	);
}

function InserterListItem( {
	rootClientId,
	className,
	isFirst,
	item,
	onSelect,
	onHover,
	isDraggable,
	...props
} ) {
	const [ isInsertComponentVisible, setIsInsertComponentVisible ] =
		useState( false );
	const isDragging = useRef( false );
	const itemIconStyle = item.icon
		? {
				backgroundColor: item.icon.background,
				color: item.icon.foreground,
		  }
		: {};
	const draggableBlocks = useMemo( () => {
		if ( ! isDraggable ) {
			return;
		}

		return [
			createBlock(
				item.name,
				item.initialAttributes,
				createBlocksFromInnerBlocksTemplate( item.innerBlocks )
			),
		];
	}, [
		isDraggable,
		item.name,
		item.initialAttributes,
		item.initialAttributes,
	] );

	const { insert: Insert } = item;

	const onSelectListItem = useCallback(
		( event ) => {
			if ( Insert ) {
				setIsInsertComponentVisible( true );
				onHover( null );
			} else {
				onSelect( item, isAppleOS() ? event.metaKey : event.ctrlKey );
				onHover( null );
			}
		},
		[ item, Insert ]
	);

	return (
		<>
			<InserterDraggableBlocks
				isEnabled={ isDraggable && ! item.disabled }
				blocks={ draggableBlocks }
				icon={ item.icon }
			>
				{ ( { draggable, onDragStart, onDragEnd } ) => (
					<div
						className="block-editor-block-types-list__list-item"
						draggable={ draggable }
						onDragStart={ ( event ) => {
							isDragging.current = true;
							if ( onDragStart ) {
								onHover( null );
								onDragStart( event );
							}
						} }
						onDragEnd={ ( event ) => {
							isDragging.current = false;
							if ( onDragEnd ) {
								onDragEnd( event );
							}
						} }
					>
						<InserterListboxItem
							isFirst={ isFirst }
							className={ classnames(
								'block-editor-block-types-list__item',
								className
							) }
							disabled={ item.isDisabled }
							onClick={ ( event ) => {
								event.preventDefault();
								onSelectListItem( event );
							} }
							onKeyDown={ ( event ) => {
								const { keyCode } = event;
								if ( keyCode === ENTER ) {
									event.preventDefault();
									onSelectListItem( event );
								}
							} }
							onFocus={ () => {
								if ( isDragging.current ) {
									return;
								}
								onHover( item );
							} }
							onMouseEnter={ () => {
								if ( isDragging.current ) {
									return;
								}
								onHover( item );
							} }
							onMouseLeave={ () => onHover( null ) }
							onBlur={ () => onHover( null ) }
							{ ...props }
						>
							<span
								className="block-editor-block-types-list__item-icon"
								style={ itemIconStyle }
							>
								<BlockIcon icon={ item.icon } showColors />
							</span>
							<span className="block-editor-block-types-list__item-title">
								{ item.title }
							</span>
						</InserterListboxItem>
					</div>
				) }
			</InserterDraggableBlocks>
			{ isInsertComponentVisible && (
				<Insert
					rootClientId={ rootClientId }
					item={ item }
					onSelect={ ( block, shouldFocusBlock ) => {
						onSelect( block, shouldFocusBlock );
						onHover( null );
						setIsInsertComponentVisible( false );
					} }
					onCancel={ () => {
						setIsInsertComponentVisible( false );
					} }
				/>
			) }
		</>
	);
}

export default memo( InserterListItem );
