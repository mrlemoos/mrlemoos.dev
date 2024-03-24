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

type PickedRadix$TooltipProviderProps = Pick<
	Radix$TooltipProviderProps,
	'delayDuration' | 'disableHoverableContent' | 'skipDelayDuration'
>;

export interface TooltipProps
	extends Omit<Radix$TooltipContentProps, 'content'>,
		PickedRadix$TooltipProviderProps {
	content: JSX.Element | string | null;
	isArrow?: boolean;
}

export type TooltipForwardedReferenceType = ElementRef<
	typeof Radix$PrimitiveContent
>;

const Tooltip = forwardRef<TooltipForwardedReferenceType, TooltipProps>(
	(
		{
			children,
			className,
			sideOffset = 4,
			content,
			delayDuration,
			disableHoverableContent,
			skipDelayDuration,
			isArrow = false,
			...props
		},
		ref,
	) => {
		const isTriggerAsChild = typeof children !== 'string';

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
						sideOffset={sideOffset}
						className={merge(
							'z-50 overflow-hidden rounded-lg px-3 py-1.5 text-sm bg-black text-white shadow-lg animate-in fade-in-0 zoom-in-95',
							'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
							className,
						)}
						{...props}
					>
						{content}
						{isArrow && <Radix$PrimitiveArrow className='w-6 h-6 text-black' />}
					</Radix$PrimitiveContent>
				</Radix$PrimitiveRoot>
			</Radix$PrimitiveProvider>
		);
	},
);
Tooltip.displayName = 'Tooltip';

export default Tooltip;
