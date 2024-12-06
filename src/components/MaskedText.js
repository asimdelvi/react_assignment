import React, { useState } from 'react';

const MaskedText = ({ text, mask = '***' }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<span
			className='relative cursor-pointer'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onFocus={() => setIsHovered(true)} // For keyboard accessibility
			onBlur={() => setIsHovered(false)}
			tabIndex='0' // Make the span focusable
			aria-label='Sensitive information'
		>
			<span
				className={`transition-opacity duration-300 ${
					isHovered ? 'opacity-0' : 'opacity-100'
				}`}
			>
				{mask}
			</span>

			<span
				className={`absolute inset-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 rounded transition-opacity duration-300 ${
					isHovered ? 'opacity-100' : 'opacity-0'
				}`}
			>
				{text}
			</span>
		</span>
	);
};

export default MaskedText;
