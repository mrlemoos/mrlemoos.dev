import type { JSX, ReactElement } from 'react';

import type { IconProps } from '@radix-ui/react-icons/dist/types';

import Link, { type LinkProps } from '~/components/link/link';
import Tooltip, { type TooltipProps } from '~/components/tooltip/tooltip';
import merge from '~/styles/merge';

type PickedIconProps = Pick<IconProps, 'height' | 'width'>;
type PickedLinkProps = Omit<LinkProps, 'variant'>;

export interface LinkIconProps extends PickedLinkProps, PickedIconProps {
	children: ReactElement<IconProps>;
	tooltipContent?: TooltipProps['content'];
}

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
