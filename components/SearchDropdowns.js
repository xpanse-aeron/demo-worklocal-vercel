import { useState } from "react"
import { useRouter } from 'next/router'
import Link from "next/link";

export default function SearchDropdown() {	
	const router = useRouter();
	const [ jobTitle, setJobTitle ] = useState("");
	const [ location, setLocation ] = useState("");
	const [ specialization, setSpecialization ] = useState("");

	return (
		<div className="flex flex-col xl:flex-row lg:flex-row justify-center container">
			<div className="relative xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
				<input placeholder="Job title, keywords or company" className="block w-full h-full px-4 py-5 text-xl border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-300 rounded-sm"
					onChange={(e) => setJobTitle(e.target.value)}
				/>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-6 right-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>
			<div className="relative xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
				<input placeholder="Area, city or town" className="block w-full h-full text-xl px-4 py-5 border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-300 rounded-sm"
					onChange={(e) => setLocation(e.target.value)}
				/>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-6 right-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</div>
			<div className="xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0 z-10">
				<select
					className="block w-full text-xl px-4 py-5 border-gray-300 focus:outline-none focus:ring-gray-100 focus:border-gray-300 rounded-sm"
					placeholder="All Job Specializations"
					onChange={(e) => setSpecialization(e.target.value)}
				>
					<option value="%%">All Job Specializations</option>
					<option value="Accounting/Finance">Accounting/Finance</option>
					<option value="Admin/Human Resources">Admin/Human Resources</option>
					<option value="Arts/Media/Communications">Arts/Media/Communications</option>
					<option value="Building/Construction">Building/Construction</option>
					<option value="Computer/Information Technology">Computer/Information Technology</option>
					<option value="Education Training">Education Training</option>
				</select>
			</div>
			<div className="xl:w-1/5 lg:w-1/5 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
				<Link
					href={{
						pathname: "/listing",
						query: { title: jobTitle, location: location, specialization: specialization },
					}}
				>
					<a className="bg-blue-800 block -ml-1 z-0 w-full py-5 rounded-sm text-xl text-white font-bold">
						Search Jobs
					</a>
				</Link>
			</div>
		</div>
	)
}

export function SearchDropdownListing() {	
	const router = useRouter();
	const [ jobTitle, setJobTitle ] = useState("");
	const [ location, setLocation ] = useState("");
	const [ specialization, setSpecialization ] = useState("");

	return (
		<div className="bg-blue-800 w-full px-5 py-6">
			<div className="flex flex-col xl:flex-row lg:flex-row justify-center max-w-7xl m-auto">
				<div className="relative xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
					<input placeholder="Job title, keywords or company" className="block w-full h-full px-2 py-3 text-md border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-300 rounded-sm"
						onChange={(e) => setJobTitle(e.target.value)}
					/>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-3 right-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</div>
				<div className="relative xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
					<input placeholder="Area, city or town" className="block w-full h-full text-md px-2 py-3 border border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-300 rounded-sm"
						onChange={(e) => setLocation(e.target.value)}
					/>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-3 right-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<div className="xl:w-1/4 lg:w-1/4 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
					<select
						className="block w-full text-md px-2 py-3 border-gray-300 focus:outline-none focus:ring-gray-100 focus:border-gray-300 rounded-sm"
						placeholder="All Job Specializations"
						onChange={(e) => setSpecialization(e.target.value)}
					>
						<option value="%%">All Job Specializations</option>
						<option value="Accounting/Finance">Accounting/Finance</option>
						<option value="Admin/Human Resources">Admin/Human Resources</option>
						<option value="Arts/Media/Communications">Arts/Media/Communications</option>
						<option value="Building/Construction">Building/Construction</option>
						<option value="Computer/Information Technology">Computer/Information Technology</option>
						<option value="Education Training">Education Training</option>
					</select>
				</div>
				<div className="xl:w-1/5 lg:w-1/5 w-full xl:mx-0 lg:mx-0 mb-2 xl:my-0 lg:my-0">
					<Link
						href={{
							pathname: "/listing",
							query: { title: jobTitle, location: location, specialization: specialization },
						}}
					>
						<a className="bg-green-500 block w-full px-2 py-3 rounded-sm text-md text-white text-center font-bold">
							Search Jobs
						</a>
					</Link>
				</div>
			</div>
		</div>
	)
}