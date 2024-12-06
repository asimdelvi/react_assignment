import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { FaSearch, FaEye } from 'react-icons/fa';

const ProfileTable = () => {
	const [profileData, setProfileData] = useState([]);
	const [columns, setColumns] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const fetchProfileData = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await axios.post(
				'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/profile',
				{
					count: 150,
					country_code: 'en_IN',
					aadhar: true,
					dl: true,
					credit: true,
					debit: true,
					pan: true,
					passport: true,
					ssn: false,
				}
			);
			setProfileData(response.data.data);
			setColumns(response.data.columns);
		} catch (err) {
			console.error('Error fetching profile data:', err);
			setError('Failed to load data. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProfileData();
	}, []);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const openModal = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedUser(null);
		setIsModalOpen(false);
	};

	const filteredData = profileData.filter((item) =>
		columns.some((col) => {
			const value = item[col.field];
			return (
				value &&
				value.toString().toLowerCase().includes(searchTerm.toLowerCase())
			);
		})
	);

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = filteredData.slice(
		indexOfFirstRecord,
		indexOfLastRecord
	);
	const totalPages = Math.ceil(filteredData.length / recordsPerPage);

	return (
		<div className='bg-white shadow rounded-lg p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-semibold text-gray-700'>User Profiles</h2>
				<div className='relative w-1/3'>
					<FaSearch className='absolute left-3 top-3 text-gray-400' />
					<input
						type='text'
						placeholder='Search...'
						value={searchTerm}
						onChange={handleSearch}
						className='pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
			</div>

			{isLoading && <LoadingSpinner />}

			{error && <div className='text-center text-red-500 my-4'>{error}</div>}

			{!isLoading && !error && filteredData.length === 0 && (
				<div className='text-center text-gray-500 my-4'>No data available.</div>
			)}

			{!isLoading && !error && filteredData.length > 0 && (
				<>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									{columns
										.filter((col) =>
											['first_name', 'last_name', 'sex', 'dob'].includes(
												col.field
											)
										)
										.map((col) => (
											<th
												key={col.field}
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												{col.headerName}
											</th>
										))}
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{currentRecords.map((item, index) => (
									<tr
										key={index}
										className='hover:bg-gray-100 transition duration-150'
									>
										{['first_name', 'last_name', 'sex', 'dob'].map((field) => (
											<td
												key={field}
												className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'
											>
												{item[field]}
											</td>
										))}
										<td className='px-6 py-4 whitespace-nowrap text-sm'>
											<button
												onClick={() => openModal(item)}
												className='text-blue-600 hover:text-blue-900 flex items-center'
											>
												<FaEye className='mr-2' />
												View Details
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='flex justify-between items-center mt-4'>
						<div>
							<span className='text-sm text-gray-700'>
								Showing {indexOfFirstRecord + 1} to{' '}
								{indexOfLastRecord > filteredData.length
									? filteredData.length
									: indexOfLastRecord}{' '}
								of {filteredData.length} results
							</span>
						</div>
						<div className='flex space-x-2'>
							<button
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								className={`px-4 py-2 rounded ${
									currentPage === 1
										? 'bg-gray-300 text-gray-500 cursor-not-allowed'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								} transition duration-300`}
							>
								Previous
							</button>
							<button
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 rounded ${
									currentPage === totalPages
										? 'bg-gray-300 text-gray-500 cursor-not-allowed'
										: 'bg-blue-500 text-white hover:bg-blue-600'
								} transition duration-300`}
							>
								Next
							</button>
						</div>
					</div>
				</>
			)}

			<Modal isOpen={isModalOpen} onClose={closeModal}>
				{selectedUser && (
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Personal Information
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
								<p>
									<strong>First Name:</strong> {selectedUser.first_name}
								</p>
								<p>
									<strong>Last Name:</strong> {selectedUser.last_name}
								</p>
								<p>
									<strong>Gender:</strong> {selectedUser.sex}
								</p>
								<p>
									<strong>Date of Birth:</strong> {selectedUser.dob}
								</p>
								<p>
									<strong>Father's Name:</strong> {selectedUser.father_name}
								</p>
								<p>
									<strong>Nationality:</strong> {selectedUser.nationality}
								</p>
								<p>
									<strong>Passport Type:</strong> {selectedUser.passport_type}
								</p>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Identification Documents
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
								<p>
									<strong>Aadhar:</strong> {selectedUser.aadhar}
								</p>
								<p>
									<strong>PAN Number:</strong> {selectedUser.pan_number}
								</p>
								<p>
									<strong>PAN Status:</strong> {selectedUser.pan_status}
								</p>
								<p>
									<strong>Driving Licence Number:</strong>{' '}
									{selectedUser.driving_licence_number}
								</p>
								<p>
									<strong>Driving Licence Issue Date:</strong>{' '}
									{selectedUser.driving_licence_date_of_issue}
								</p>
								<p>
									<strong>Driving Licence Expiry Date:</strong>{' '}
									{selectedUser.driving_licence_date_of_expiry}
								</p>
								<p>
									<strong>Passport Number:</strong>{' '}
									{selectedUser.passport_number}
								</p>
								<p>
									<strong>Passport Issue Date:</strong>{' '}
									{selectedUser.passport_date_of_issue}
								</p>
								<p>
									<strong>Passport Expiry Date:</strong>{' '}
									{selectedUser.passport_date_of_expiry}
								</p>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Financial Information
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
								<p>
									<strong>Credit Card Number:</strong> **** **** ****{' '}
									{selectedUser.credit_card_number.slice(-4)}
								</p>
								<p>
									<strong>Credit Card CVV:</strong> ***
								</p>
								<p>
									<strong>Credit Card Expiry:</strong>{' '}
									{selectedUser.credit_card_expiry}
								</p>
								<p>
									<strong>Credit Card Provider:</strong>{' '}
									{selectedUser.credit_card_provider}
								</p>
								<p>
									<strong>Debit Card Number:</strong> **** **** ****{' '}
									{selectedUser.debit_card_number.slice(-4)}
								</p>
								<p>
									<strong>Debit Card CVV:</strong> ***
								</p>
								<p>
									<strong>Debit Card Expiry:</strong>{' '}
									{selectedUser.debit_card_expiry}
								</p>
								<p>
									<strong>Debit Card Provider:</strong>{' '}
									{selectedUser.debit_card_provider}
								</p>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Address
							</h3>
							<p className='text-gray-600'>{selectedUser.address}</p>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ProfileTable;
