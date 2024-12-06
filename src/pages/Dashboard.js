import React, { useState } from 'react';
import ProfileTable from '../components/ProfileTable';
import CreditCardTable from '../components/CreditCardTable';
import Navbar from '../components/Navbar';
import { FaUser, FaCreditCard } from 'react-icons/fa';

const Dashboard = ({ user, setUser }) => {
	const [activeTab, setActiveTab] = useState('profiles');

	const handleLogout = () => {
		setUser(null);
	};

	return (
		<div className='min-h-screen bg-gray-100'>
			<Navbar user={user} handleLogout={handleLogout} />
			<div className='container mx-auto px-4 py-6'>
				<div className='mb-6'>
					<div className='flex space-x-4 border-b border-gray-300'>
						<button
							onClick={() => setActiveTab('profiles')}
							className={`flex items-center px-4 py-2 -mb-px border-b-2 ${
								activeTab === 'profiles'
									? 'border-blue-500 text-blue-500'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							} focus:outline-none`}
						>
							<FaUser className='mr-2' />
							User Profiles
						</button>
						<button
							onClick={() => setActiveTab('cards')}
							className={`flex items-center px-4 py-2 -mb-px border-b-2 ${
								activeTab === 'cards'
									? 'border-blue-500 text-blue-500'
									: 'border-transparent text-gray-500 hover:text-gray-700'
							} focus:outline-none`}
						>
							<FaCreditCard className='mr-2' />
							Credit Cards
						</button>
					</div>
				</div>

				<div>
					{activeTab === 'profiles' && <ProfileTable />}
					{activeTab === 'cards' && <CreditCardTable />}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
