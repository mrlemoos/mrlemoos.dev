import type { HTMLAttributes, JSX } from 'react';

import merge from '~/styles/merge';
import styled, { type VariantProps } from '~/styles/styled';

/**
 * @internal The `createBadgeVariants()` is a function that generates the badge
 *           variants based on the variant prop.
 */
const createBadgeVariants = styled(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				outline: 'text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

/**
 * @internal The `BadgeVariantProps` is an object that represents the props of
 *           the `Badge` React component with the variant prop.
 */
type BadgeVariantProps = VariantProps<typeof createBadgeVariants>;

/**
 * The `BadgeProps` is an object that represents the props of the `Badge` React
 * component.
 */
export interface BadgeProps
	extends HTMLAttributes<HTMLDivElement>,
		BadgeVariantProps {}

/**
 * The `Badge` is a React component that is used to render a badge with a
 * specific variant.
 *
 * @props {@link BadgeProps}
 */
function Badge({ className, variant, ...props }: BadgeProps): JSX.Element {
	return (
		<div
			className={merge(createBadgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export default Badge;
