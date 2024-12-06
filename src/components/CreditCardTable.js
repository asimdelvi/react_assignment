import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { FaSearch, FaEye } from 'react-icons/fa';

const CreditCardTable = () => {
	const [cardData, setCardData] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);

	const fetchCardData = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await axios.post(
				'https://7q3k6vhat1.execute-api.ap-south-1.amazonaws.com/dev/card/credit',
				{
					count: 150,
					country_code: 'en_IN',
				}
			);
			setCardData(response.data.data);
		} catch (err) {
			console.error('Error fetching credit card data:', err);
			setError('Failed to load data. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCardData();
	}, []);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1);
	};

	const openModal = (card) => {
		setSelectedCard(card);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedCard(null);
		setIsModalOpen(false);
	};

	const filteredData = cardData.filter((item) =>
		Object.values(item).some((val) =>
			val.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = filteredData.slice(
		indexOfFirstRecord,
		indexOfLastRecord
	);
	const totalPages = Math.ceil(filteredData.length / recordsPerPage);

	const convertFieldName = (field) => {
		switch (field) {
			case 'card_provider':
				return 'Card Provider';
			case 'card_number':
				return 'Card Number';
			case 'card_expiry':
				return 'Card Expiry';
			case 'card_type':
				return 'Card Type';
			case 'digits':
				return 'Digits';
			case 'cvv':
				return 'CVV';
			default:
				return field;
		}
	};

	const maskSensitiveData = (data, field) => {
		if (field === 'card_number') {
			return `**** **** **** ${data.slice(-4)}`;
		} else if (field === 'cvv') {
			return '***';
		}
		return data;
	};

	return (
		<div className='bg-white shadow rounded-lg p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-xl font-semibold text-gray-700'>
					Credit Card Data
				</h2>
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
									{[
										'card_provider',
										'digits',
										'card_number',
										'card_expiry',
										'card_type',
										'cvv',
									].map((field) => (
										<th
											key={field}
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											{convertFieldName(field)}
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
										{[
											'card_provider',
											'digits',
											'card_number',
											'card_expiry',
											'card_type',
											'cvv',
										].map((field) => (
											<td
												key={field}
												className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'
											>
												{['card_number', 'cvv'].includes(field)
													? maskSensitiveData(item[field], field)
													: item[field]}
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
				{selectedCard && (
					<div className='space-y-4'>
						<div>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Card Information
							</h3>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
								<p>
									<strong>Card Provider:</strong> {selectedCard.card_provider}
								</p>
								<p>
									<strong>Digits:</strong> {selectedCard.digits}
								</p>
								<p>
									<strong>Card Number:</strong>{' '}
									{maskSensitiveData(selectedCard.card_number, 'card_number')}
								</p>
								<p>
									<strong>Card Expiry:</strong> {selectedCard.card_expiry}
								</p>
								<p>
									<strong>Card Type:</strong> {selectedCard.card_type}
								</p>
								<p>
									<strong>CVV:</strong>{' '}
									{maskSensitiveData(selectedCard.cvv, 'cvv')}
								</p>
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default CreditCardTable;
