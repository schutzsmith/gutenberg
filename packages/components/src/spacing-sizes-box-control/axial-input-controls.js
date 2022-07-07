/**
 * Internal dependencies
 */
import { parseQuantityAndUnitFromRawValue } from '../unit-control/utils';
import SpacingRangeControl from './spacing-range-control';
import { LABELS } from './utils';
import { Layout } from './styles/box-control-styles';

const groupedSides = [ 'vertical', 'horizontal' ];

export default function AxialInputControls( {
	onChange,
	onFocus,
	onHoverOn,
	onHoverOff,
	values,
	sides,
	...props
} ) {
	const createHandleOnFocus = ( side ) => ( event ) => {
		if ( ! onFocus ) {
			return;
		}
		onFocus( event, { side } );
	};

	const createHandleOnHoverOn = ( side ) => () => {
		if ( ! onHoverOn ) {
			return;
		}
		if ( side === 'vertical' ) {
			onHoverOn( {
				top: true,
				bottom: true,
			} );
		}
		if ( side === 'horizontal' ) {
			onHoverOn( {
				left: true,
				right: true,
			} );
		}
	};

	const createHandleOnHoverOff = ( side ) => () => {
		if ( ! onHoverOff ) {
			return;
		}
		if ( side === 'vertical' ) {
			onHoverOff( {
				top: false,
				bottom: false,
			} );
		}
		if ( side === 'horizontal' ) {
			onHoverOff( {
				left: false,
				right: false,
			} );
		}
	};

	const createHandleOnChange = ( side ) => ( next ) => {
		if ( ! onChange ) {
			return;
		}
		const nextValues = { ...values };
		const nextValue = next;

		if ( side === 'vertical' ) {
			nextValues.top = nextValue;
			nextValues.bottom = nextValue;
		}

		if ( side === 'horizontal' ) {
			nextValues.left = nextValue;
			nextValues.right = nextValue;
		}

		onChange( nextValues );
	};

	// Filter sides if custom configuration provided, maintaining default order.
	const filteredSides = sides?.length
		? groupedSides.filter( ( side ) => sides.includes( side ) )
		: groupedSides;

	const first = filteredSides[ 0 ];
	const last = filteredSides[ filteredSides.length - 1 ];
	const only = first === last;

	return (
		<Layout
			gap={ 0 }
			align="top"
			className="component-box-control__vertical-horizontal-input-controls"
		>
			{ filteredSides.map( ( side ) => {
				const [ parsedQuantity ] = parseQuantityAndUnitFromRawValue(
					side === 'vertical' ? values.top : values.left
				);
				return (
					<SpacingRangeControl
						{ ...props }
						isFirst={ first === side }
						isLast={ last === side }
						isOnly={ only === side }
						value={ [ parsedQuantity ].join( '' ) }
						onChange={ createHandleOnChange( side ) }
						onFocus={ createHandleOnFocus( side ) }
						label={ LABELS[ side ] }
						key={ `box-control-${ side }` }
						withInputField={ false }
					/>
				);
			} ) }
		</Layout>
	);
}
