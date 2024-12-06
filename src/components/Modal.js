import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, children }) => {
	const modalRef = useRef();

	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			modalRef.current.focus();
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
			aria-modal='true'
			role='dialog'
			aria-labelledby='modal-title'
		>
			<div
				className='bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 overflow-y-auto max-h-full relative'
				tabIndex='-1'
				ref={modalRef}
			>
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-gray-600 hover:text-gray-800'
					aria-label='Close Modal'
				>
					<FaTimes size={20} />
				</button>
				<div className='p-6'>{children}</div>
				<div className='flex justify-end p-4 border-t'>
					<button
						onClick={onClose}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300'
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
