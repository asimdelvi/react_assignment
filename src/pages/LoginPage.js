import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle } from 'react-icons/fa';

const users = [];

const LoginPage = ({ setUser }) => {
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const userInfo = await axios.get(
					'https://www.googleapis.com/oauth2/v3/userinfo',
					{
						headers: {
							Authorization: `Bearer ${tokenResponse.access_token}`,
						},
					}
				);

				const existingUser = users.find((u) => u.email === userInfo.data.email);
				if (existingUser) {
					setUser(existingUser);
					navigate('/dashboard');
				} else {
					const newUser = {
						id: userInfo.data.sub,
						name: userInfo.data.name,
						email: userInfo.data.email,
					};

					users.push(newUser);
					setUser(newUser);
					navigate('/dashboard');
				}
			} catch (error) {
				console.error('Error fetching user info', error);
			}
		},
		onError: () => {
			console.log('Login Failed');
		},
	});

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<button
				onClick={() => login()}
				className='flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'
			>
				<FaGoogle className='mr-2' />
				Sign in with Google{' '}
			</button>
		</div>
	);
};

export default LoginPage;
