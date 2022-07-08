/**
 * WordPress dependencies
 */
import {
	__experimentalHStack as HStack,
	__experimentalHeading as Heading,
	DropdownMenu,
	MenuGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { moreVertical } from '@wordpress/icons';
import {
	usePostPendingStatusCheck,
	usePostLastRevisionCheck,
	usePostTrashCheck,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import PostPendingStatus from './post-pending-status';
import PostLastRevision from './post-last-revision';
import PostTrash from './post-trash';

// todo: should this whole component go in @wordpress/editor?
export default function PostStatusHeader() {
	const hasPostPendingStatus = usePostPendingStatusCheck();
	const hasPostLastRevision = usePostLastRevisionCheck();
	const hasPostTrash = usePostTrashCheck();
	return (
		<HStack className="edit-post-post-status__header">
			<Heading className="edit-post-post-status__heading" level={ 2 }>
				{ __( 'Summary' ) }
			</Heading>
			{ ( hasPostPendingStatus ||
				hasPostLastRevision ||
				hasPostTrash ) && (
				<DropdownMenu
					icon={ moreVertical }
					label={ __( 'Options' ) }
					toggleProps={ { isSmall: true } }
				>
					{ () => (
						<>
							{ ( hasPostPendingStatus ||
								hasPostLastRevision ) && (
								<MenuGroup>
									{ hasPostPendingStatus && (
										<PostPendingStatus />
									) }
									{ hasPostLastRevision && (
										<PostLastRevision />
									) }
								</MenuGroup>
							) }
							{ hasPostTrash && (
								<MenuGroup>
									<PostTrash />
								</MenuGroup>
							) }
						</>
					) }
				</DropdownMenu>
			) }
		</HStack>
	);
}
