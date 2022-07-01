/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import BlockTypesList from '../block-types-list';

function Workflow( props ) {
	const { flow: Component } = props.workflow;
	return <Component { ...props } />;
}

export default function WorkflowsList( props ) {
	const [ activeWorkflow, setActiveWorkflow ] = useState();
	const { rootClientId, onSelect } = props;

	return (
		<>
			<BlockTypesList
				{ ...props }
				onSelect={ ( workflow ) => {
					setActiveWorkflow( workflow );
				} }
				isDraggable={ false }
			/>
			{ !! activeWorkflow && (
				<Workflow
					rootClientId={ rootClientId }
					workflow={ activeWorkflow }
					onSelect={ onSelect }
					onFinish={ () => setActiveWorkflow( undefined ) }
				/>
			) }
		</>
	);
}
