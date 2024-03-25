import type { JSX, ReactElement } from 'react';

import type { IconProps } from '@radix-ui/react-icons/dist/types';

import Link, { type LinkProps } from '~/components/link/link';
import Tooltip, { type TooltipProps } from '~/components/tooltip/tooltip';
import merge from '~/styles/merge';

type PickedIconProps = Pick<IconProps, 'height' | 'width'>;
type PickedLinkProps = Omit<LinkProps, 'variant'>;

/**
 * The props for the `LinkIcon` component.
 */
export interface LinkIconProps extends PickedLinkProps, PickedIconProps {
	/**
	 * The children of the link icon component which should be an icon element. In
	 * fact, this property should only carry one child element which renders an
	 * element via the `Icon` component.
	 *
	 * @example
	 * ```tsx
	 * <LinkIcon>
	 *   <ArrowRightIcon />
	 * </Link>
	 * ```
	 */
	children: ReactElement<IconProps>;
	/**
	 * The content of the tooltip element that wraps the link icon. If not
	 * provided, this property defaults to `null` and is not created in the DOM.
	 *
	 * See {@link TooltipProps.content | `TooltipProps.content`} for more
	 * information on the accepted kinds of values.
	 *
	 * @default null
	 */
	tooltipContent?: TooltipProps['content'];
}

/**
 * The `LinkIcon` is a React component that composes the link element displaying
 * an icon and optionally wrapped in a tooltip.
 *
 * @props {@link LinkProps}
 */
function LinkIcon({
	children,
	className,
	tooltipContent = null,
	...props
}: LinkIconProps): JSX.Element {
	return (
		<Tooltip content={tooltipContent ?? null}>
			<Link
				{...props}
				variant='opaque'
				className={merge('hover:fill-black dark:hover:fill-white', className)}
			>
				{children}
			</Link>
		</Tooltip>
	);
}

export default LinkIcon;
