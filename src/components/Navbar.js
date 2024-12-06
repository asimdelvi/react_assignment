import React from 'react';

const Navbar = ({ user, handleLogout }) => {
	console.log(user);
	return (
		<nav className='bg-white shadow-md'>
			<div className='container mx-auto px-4 py-4 flex justify-between items-center'>
				<h1 className='text-xl font-bold text-blue-600'>My React App</h1>
				<div className='flex items-center space-x-4'>
					{user && (
						<>
							<span className='text-gray-700'>Hello, {user.name}</span>
							<button
								onClick={handleLogout}
								className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300'
							>
								Logout
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
