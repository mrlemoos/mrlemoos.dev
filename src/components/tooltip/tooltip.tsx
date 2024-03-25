'use client';

import {
	Arrow as Radix$PrimitiveArrow,
	Content as Radix$PrimitiveContent,
	Provider as Radix$PrimitiveProvider,
	Root as Radix$PrimitiveRoot,
	Trigger as Radix$PrimitiveTrigger,
	type TooltipContentProps as Radix$TooltipContentProps,
	type TooltipProviderProps as Radix$TooltipProviderProps,
} from '@radix-ui/react-tooltip';
import { type ElementRef, type JSX, forwardRef } from 'react';

import merge from '~/styles/merge';

/**
 * @internal
 */
type PickedRadix$TooltipProviderProps = Pick<
	Radix$TooltipProviderProps,
	'delayDuration' | 'disableHoverableContent' | 'skipDelayDuration'
>;

/**
 * @internal
 */
type PickedRadix$TooltipContentProps = Omit<
	Radix$TooltipContentProps,
	'content' | 'align' | 'side'
>;

/**
 * @internal
 */
type Radix$TooltipContentAlignProp = NonNullable<
	Radix$TooltipContentProps['align']
>;

/**
 * @internal
 */
type Radix$TooltipContentSideProp = NonNullable<
	Radix$TooltipContentProps['side']
>;

/**
 * The `TooltipPosition` type is a string literal type that represents the
 * position of the tooltip content relative to the trigger node.
 */
export type TooltipPosition =
	`${Radix$TooltipContentSideProp}-${Radix$TooltipContentAlignProp}`;

/**
 * The `TooltipProps` interface defines the props for the `Tooltip` component.
 */
export interface TooltipProps
	extends PickedRadix$TooltipContentProps,
		PickedRadix$TooltipProviderProps {
	/**
	 * The `content` property is the JSX element or string (typography) which will
	 * be displayed inside the tooltip when the user hovers over the trigger node
	 * tree provided via the children of this component.
	 *
	 * This property may also be `null` if the tooltip should not be displayed.
	 */
	content: JSX.Element | string | null;
	/**
	 * The `isArrow` property determines whether the tooltip should have an arrow
	 * or not.
	 *
	 * @default false
	 */
	isArrow?: boolean;
	/**
	 * The `TooltipPosition` property determines the position of the tooltip
	 * relative to the trigger node.
	 *
	 * @see {@link TooltipPosition}
	 *
	 * @default 'top-center'
	 */
	position?: TooltipPosition;
}

/**
 * The `TooltipForwardedReferenceType` is the type of the forwarded reference
 * passed down to the native HTML element.
 */
export type TooltipForwardedReferenceType = ElementRef<
	typeof Radix$PrimitiveContent
>;

/**
 * The `Tooltip` is a React Client Component (RCC) that wraps the content with
 * an floating tooltip that appears when the user hovers over the trigger.
 *
 * @props {@link TooltipProps}
 */
const Tooltip = forwardRef<TooltipForwardedReferenceType, TooltipProps>(
	(
		{
			children,
			className,
			sideOffset = 2,
			content,
			delayDuration,
			disableHoverableContent,
			skipDelayDuration,
			isArrow = false,
			position = 'top-center',
			...props
		},
		ref,
	) => {
		const [side, align] = position.split('-') as [
			Radix$TooltipContentSideProp,
			Radix$TooltipContentAlignProp,
		];
		const isTriggerAsChild =
			// NOTE: This is a type guard to check if the children is not a string.
			typeof children !== 'string';

		if (content === null) {
			return children;
		}

		return (
			<Radix$PrimitiveProvider
				delayDuration={delayDuration}
				disableHoverableContent={disableHoverableContent}
				skipDelayDuration={skipDelayDuration}
			>
				<Radix$PrimitiveRoot>
					<Radix$PrimitiveTrigger asChild={isTriggerAsChild}>
						{children}
					</Radix$PrimitiveTrigger>
					<Radix$PrimitiveContent
						ref={ref}
						side={side}
						align={align}
						sideOffset={sideOffset}
						className={merge(
							'z-50 overflow-hidden rounded-md px-2 py-1 text-sm shadow-lg animate-in fade-in-0 zoom-in-95 backdrop-blur-lg',
							'bg-black/80 dark:bg-white/80 text-white dark:text-black',
							'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
							'data-[side=bottom]:slide-in-from-top-2',
							'data-[side=left]:slide-in-from-right-2',
							'data-[side=right]:slide-in-from-left-2',
							'data-[side=top]:slide-in-from-bottom-2',
							className,
						)}
						{...props}
					>
						{content}

						{isArrow && (
							<Radix$PrimitiveArrow
								className='fill-black dark:fill-white'
								width={10}
								height={5}
							/>
						)}
					</Radix$PrimitiveContent>
				</Radix$PrimitiveRoot>
			</Radix$PrimitiveProvider>
		);
	},
);
Tooltip.displayName = 'Tooltip';

export default Tooltip;
