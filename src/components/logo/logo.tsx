import type { HTMLAttributes, JSX } from 'react';

import merge from '~/styles/merge';
import styled, { type VariantProps } from '~/styles/styled';

/**
 * @internal The `createLogoStyles()` is a function that creates the styles for
 *           the `Logo` component.
 */
const createLogoStyles = styled(
	merge(
		'bg-gradient-to-br rounded-lg w-8 h-8 shadow-2xl relative border',
		'from-zinc-50 to-zinc-200 text-black border-zinc-100',
		'dark:from-black dark:to-gray-900 dark:text-white dark:border-gray-800',
	),
	{
		variants: {
			size: {
				sm: 'w-6 h-6 text-base',
				md: 'w-8 h-8 text-xl',
				lg: 'w-12 h-12 text-2xl',
			},
			backdrop: {
				shadow: 'shadow-2xl',
				none: '',
			},
		},
	},
);

/**
 * The `LogoProps` interface defines the props for the `Logo` component.
 */
export interface LogoProps
	extends HTMLAttributes<HTMLElement>,
		VariantProps<typeof createLogoStyles> {
	/**
	 * @ignore
	 */
	children?: never;
}

/**
 * @internal The class names for HTML span element when the size is "sm".
 */
const CHAR_SIZE_SM_CLASS_NAME = 'data-[size="sm"]:font-normal' as const;
/**
 * @internal The class names for HTML span element when the size is "md".
 */
const CHAR_SIZE_MD_CLASS_NAME = 'data-[size="md"]:font-medium' as const;
/**
 * @internal The class names for HTML span element when the size is "lg".
 */
const CHAR_SIZE_LG_CLASS_NAME = 'data-[size="lg"]:font-semibold' as const;

const charSizesClassName = [
	CHAR_SIZE_SM_CLASS_NAME,
	CHAR_SIZE_MD_CLASS_NAME,
	CHAR_SIZE_LG_CLASS_NAME,
].join(' ');

/**
 * The `Logo` is a React component which renders the logo of the website.
 *
 * @props {@link LogoProps}
 */
function Logo({
	className,
	role = 'img',
	'aria-label': ariaLabel = 'Two letters L - one rotated 90 degrees and other 270 degrees',
	size = 'md',
	backdrop = 'shadow',
	...props
}: LogoProps): JSX.Element {
	return (
		<div
			{...props}
			role={role}
			aria-label={ariaLabel}
			className={merge(createLogoStyles({ size, backdrop, className }))}
		>
			<span
				data-size={size}
				className={merge(
					'rotate-90 absolute left-1/2 -translate-x-1/2',
					'data-[size="sm"]:-top-[3px]',
					'data-[size="md"]:-top-0.5',
					'data-[size="lg"]:-top-1',
					charSizesClassName,
				)}
			>
				L
			</span>
			<span
				data-size={size}
				className={merge(
					'-rotate-90 absolute left-1/2 -translate-x-1/2',
					'data-[size="sm"]:-bottom-[3px]',
					'data-[size="md"]:-bottom-0.5',
					'data-[size="lg"]:-bottom-1',
					charSizesClassName,
				)}
			>
				L
			</span>
		</div>
	);
}

export default Logo;
