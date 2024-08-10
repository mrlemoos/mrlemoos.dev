import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { Slot } from '@radix-ui/react-slot';

import merge from '~/styles/merge';
import styled, { type VariantProps } from '~/styles/styled';

/**
 * @internal The `createButtonStyles()` function is a factory function that
 *           defines the class names for the different variants of the button.
 */
const createButtonStyles = styled(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

/**
 * The `ButtonForwardedReferenceType` is the type of the forwarded reference for
 * the root element of the `Button` React Client Component.
 */
export type ButtonForwardedReferenceType = HTMLButtonElement;

/**
 * The `ButtonProps` interface is an object that represents the props of the
 * `Button` React component.
 */
export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof createButtonStyles> {
	/**
	 * The `asChild` property is a boolean that determines whether the properties
	 * of the button should be applied to a slottable child element.
	 *
	 * @default false
	 */
	asChild?: boolean;
}

const Button = forwardRef<ButtonForwardedReferenceType, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const RootElement = asChild ? Slot : 'button';

		return (
			<RootElement
				className={merge(createButtonStyles({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';

export default Button;
