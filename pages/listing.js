import Head from 'next/head'
import { useRouter } from 'next/router'
import { NavListing } from "../components/Nav"
import Footer from "../components/Footer"
import { SearchDropdownListing } from "../components/SearchDropdowns"
import useSWR from "swr";
import { useUser } from '@auth0/nextjs-auth0';
import { useState, useRef } from "react"
import moment from "moment";
import Link from "next/link";

export default function Listing(){
  const { user, error:userError, isLoading } = useUser();
  const router = useRouter();
	let title;
	let location;
	let specialization;
	let bookmarkIds = router.query.ids;
	const toNumber = (arr) => arr.map(Number);
	let todayDate = new Date().toISOString().slice(0, 10);
	if (router.query.title != "") {
		title = "%"+router.query.title+"%";
	}else {
		title = "%%"
	}
	if (router.query.location != "") {
		location = "%"+router.query.location+"%";
	}else {
		location = "%%"
	}
	if (router.query.specialization != "") {
		specialization = "%"+router.query.specialization+"%";
	} else {
		specialization = "%%"
	}
	const [ type, setType ] = useState("%%");
	const [ company, setCompany ] = useState("%%");
	const [ order, setOrder ] = useState("desc");
	const [ date, setDate ] = useState(todayDate);
	const [ clicks, setClicks ] = useState([]);
	const [ grid, setGrid ] = useState(true);
	const [ toggle, setToggle ] = useState(true);
	const [ toggleOrder, setToggleOrder] = useState(true)
	const [ sliderVal, setSliderValue ] = useState(1500)
	let origins = []
	let originCoordinates = ""

	const fetchJobs = async (
		url
	) => {
		let ids = [];

		if (Array.isArray(bookmarkIds)) {
      ids = toNumber(bookmarkIds);
    } else {
      ids = [parseInt(bookmarkIds)];
    }

		const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: ids,
      }),
    });
    const data = await res.json();
    return data;
	}

	const fetchData = async (
		url,
		titles,
		locations,
		companies,
		specializations,
		types,
		dates,
		orders
	) => {
		const res = await fetch(url, {
			method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        title: titles,
        location: locations,
        company: companies,
        specialization: specializations,
				type: types,
				date: dates,
				order: orders
      }),
		})
    const data = await res.json();
    return data;
	}

	const fetchDistance = async (
		url,
		coord
	) => {
		const res = await fetch(url, {
			method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        coordinates: coord,
      }),
		})
		const data = await res.json()
		return data
	}

	const fetchBookmarks = async (
		url,
		ids
	) => {
		const res = await fetch(url, {
			method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: ids,
      }),
		})
		const data = await res.json()
		return data
	}

	const { data: specificJob } = useSWR(bookmarkIds ? ["/api/specificJob"] : null, (url) => fetchJobs(url), { revalidateOnFocus: false });

	// if (specificJob) console.log(specificJob)

	const { data: filteredJobs, error } = useSWR(["/api/filteredJobs", title, location, company, specialization, type, date, order], (url, title, location, company, specialization, type, date, order) => fetchData(url, title, location, company, specialization, type, date, order), { revalidateOnFocus: false });

	if (filteredJobs) {
		let counter = 0;
		for (let x = 0; x < filteredJobs.length; x++) {
			origins.push(filteredJobs[x].origin.coordinates.lat.toString()+","+filteredJobs[x].origin.coordinates.long.toString())
		}
		if (origins.length != 0) {
			for (let x = 0; x < origins.length; x++) {
				if (counter == origins.length - 1) {
					originCoordinates += origins[x]
				} else {
					originCoordinates += origins[x] + "|"
				}
				counter += 1
			}
		}
	}

	if (specificJob) {
		let counter = 0;
		for (let x = 0; x < specificJob.length; x++) {
			origins.push(specificJob[x].origin.coordinates.lat.toString()+","+specificJob[x].origin.coordinates.long.toString())
		}
		if (origins.length != 0) {
			for (let x = 0; x < origins.length; x++) {
				if (counter == origins.length - 1) {
					originCoordinates += origins[x]
				} else {
					originCoordinates += origins[x] + "|"
				}
				counter += 1
			}
		}
	}

	const { data: coordinate } = useSWR(["/api/distance", originCoordinates.toString()], (url, origins) => fetchDistance(url, origins), { revalidateOnFocus: false });

	const { data: userBookmark } = useSWR(user ? ["/api/userBookmarks", user.sub] : null, (url, id) => fetchBookmarks(url, id), { revalidateOnFocus: true });
	// if (userBookmark) {
	// 	console.log(userBookmark)
	// }

	const determineIndex = (index) => {
		let coordinateIndex = origins.indexOf(index)
		if (coordinate) {
			let value = coordinate.rows[coordinateIndex].elements[0].distance.value.toString()
			let finalValue;
			if (value.length == 7) {
				finalValue = parseFloat((value.substring(0, 6) / 100).toFixed(2))
			} else if (value.length == 5) {
				finalValue = parseFloat((value.substring(0, 4) / 100).toFixed(2))
			}
			return finalValue
		}
	}

	const { data: count } = useSWR("/api/count");

	const changeType = (type) => setType(type)
	const changeDate = (date) => setDate(date)
	
	const bookmarks = [];
	const element = {};

	async function updateBookmark (user, ids) {
		await fetch ("/api/updateBookmarks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: user, ids: ids }),
		})
	}

	const clickBookmark = (item) => {
		if (user){
			if (bookmarks.includes(item.id)){
				const indexes = bookmarks.indexOf(item.id)
				bookmarks.splice(indexes, 1)
			} else {
				bookmarks.push(item.id);
				element.id = bookmarks;
			}
			updateBookmark(user.sub, element)
			setTimeout(() => {
				router.reload()
			}, 2000)
		}
	}

	return (
		<div className="flex flex-col">
      <Head>
        <title>WorkLocal | Powered by WorkAbroad.ph</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
			{userBookmark && (
				<NavListing 
					ids={userBookmark[0].bookmarks.id}
				/>
			)}
			{!userBookmark && (
				<NavListing 
					ids={0}
				/>
			)}	
			<SearchDropdownListing />
			<div className="bg-white w-full px-5 py-3">
				<div className="flex align-center items-center justify-between max-w-7xl m-auto">
					<div className="flex align-center items-center">
						<div className="text-sm flex ml-0 xl:ml-7 lg:ml-7">
							<span>Sort by:</span>
						</div>
						<button className={`${
							toggleOrder ?
							"border rounded-sm border-gray-200 py-2 px-2 font-bold ml-2"
							:
							"border rounded-sm border-gray-200 py-2 px-2 font-bold ml-2 opacity-50"
						}`} onClick={() => {
							if (!toggleOrder) {
								setToggleOrder(true)
								setOrder("desc")
							}
						}}>
							Relevance
						</button>
						<button className={`${
							toggleOrder ?
							"border rounded-sm border-gray-200 py-2 px-2 font-bold opacity-50"
							:
							"border rounded-sm border-gray-200 py-2 px-2 font-bold"
						}`} onClick={() => {
							if (toggleOrder) {
								setToggleOrder(false)
								setOrder("asc")
							}
						}}>
							Date
						</button>
					</div>
					<div className="flex align-center items-center">
						<button className={`${
							grid ?
							"border rounded-sm border-gray-200 py-2 px-2 font-bold"
							:
							"border rounded-sm border-gray-200 py-2 px-2 font-bold opacity-50"
						}`} onClick={() => {
							if (!grid) {
								setGrid(true)
							}
						}}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
						</button>
						<button className={`${
							grid ?
							"border rounded-sm border-gray-200 py-2 px-2 font-bold xl:mr-4 lg:mr-4 mr-0 opacity-50"
							:
							"border rounded-sm border-gray-200 py-2 px-2 font-bold xl:mr-4 lg:mr-4 mr-0"
						}`} onClick={() => {
							if (grid) {
								setGrid(false)
							}
						}}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
      {router.pathname == "/listing" && count && grid ?
      <main className="bg-gray-100 h-49rem w-full">
				<div className="max-w-7xl m-auto">
					<div className="flex flex-col xl:flex-row lg:flex-row">
						<div className={`${
							toggle ?
							"w-full xl:w-1/3 lg:w-1/3 h-35rem transition duration-500 ease-in-out overflow-hidden bg-white ml-0 xl:ml-5 lg:ml-5 mt-5"
							:
							"w-full xl:w-1/3 lg:w-1/3 h-16 transition duration-500 ease-in-out overflow-hidden bg-white ml-0 xl:ml-5 lg:ml-5 mt-5"
						}`}>
							<div className="px-5 py-5">
								<div className="pb-3 border-b flex justify-between mx-3 pb-4 border-gray-200 relative text-lg font-semibold">
									Filters
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 transform -rotate-90 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={() => {
										if (!toggle) {
											setToggle(true)
										} else {
											setToggle(false)
										}
									}}>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
									</svg>
								</div>
								<div className="mt-3 mx-3 pb-5 border-b border-gray-200 font-semibold text-md">
									Job Type
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeType("%Full-Time%")
												} else {
													changeType("%%")
												}
											}}/>
											<div className="ml-3 font-normal">Full-Time</div>
										</div>
										<div className="text-sm">
											{count.full_time}
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeType("%Part-Time%")
												} else {
													changeType("%%")
												}
											}}/>
											<div className="ml-3 font-normal">Part-Time</div>
										</div>
										<div className="text-sm">
											{count.part_time}
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeType("%Internship%")
												} else {
													changeType("%%")
												}
											}}/>
											<div className="ml-3 font-normal">Internship</div>
										</div>
										<div className="text-sm">
											{count.intern}
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeType("%Contract%")
												} else {
													changeType("%%")
												}
											}}/>
											<div className="ml-3 font-normal">Contract</div>
										</div>
										<div className="text-sm">
											{count.contract}
										</div>
									</div>
								</div>
								<div className="mt-3 mx-3 pb-4 border-b border-gray-200 font-semibold text-md">
									Distance
									<div className="flex flex-col">
										<div className="mt-3 mb-3"> within <span className="text-blue-700">{sliderVal}</span> km</div>
										<input type="range" min="10" max="1500" step="10" value={sliderVal} onChange={(e) => {
											setSliderValue(e.target.value);
										}}/>
									</div>
								</div>
								<div className="mt-3 mx-3 pb-5 font-semibold text-md">
									Listed Date
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeDate(moment(todayDate).subtract(1, 'days').format('YYYY-MM-DD'))
												} else {
													changeDate(todayDate)
												}
											}}/>
											<div className="ml-3 font-normal">Last 24 hours</div>
										</div>
										<div className="text-sm">
											5
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeDate(moment(todayDate).subtract(7, 'days').format('YYYY-MM-DD'))
												} else {
													changeDate(todayDate)
												}
											}}/>
											<div className="ml-3 font-normal">Last 7 days</div>
										</div>
										<div className="text-sm">
											5
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeDate(moment(todayDate).subtract(14, 'days').format('YYYY-MM-DD'))
												} else {
													changeDate(todayDate)
												}
											}}/>
											<div className="ml-3 font-normal">Last 14 days</div>
										</div>
										<div className="text-sm">
											5
										</div>
									</div>
									<div className="mt-2 flex items-center justify-between">
										<div className="flex items-center">
											<input type="checkbox" className="appearance-none checked:bg-blue-600 checked:border-transparent" onChange={(e) => {
												if (e.currentTarget.checked) {
													changeDate(moment(todayDate).subtract(30, 'days').format('YYYY-MM-DD'))
												} else {
													changeDate(todayDate)
												}
											}}/>
											<div className="ml-3 font-normal">Last 30 days</div>
										</div>
										<div className="text-sm">
											2
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full xl:w-2/3 lg:w-2/3 h-47rem ml-0 xl:ml-10 lg:ml-10 mr-0 xl:mr-3 lg:mr-3 mt-5">
							<div className="grid grid-cols-1 gap-0 h-full xl:gap-8 lg:gap-8 xl:grid-cols-2 lg:grid-cols-2 overflow-auto">
								{filteredJobs && filteredJobs.map((item, index) => {
									return (
										<div className={`${
											determineIndex(item.origin.coordinates.lat+","+item.origin.coordinates.long) <= sliderVal ?
											"w-full bg-white rounded-md h-25rem mt-5 xl:mt-0 lg:mt-0"
											:
											"w-full bg-white rounded-md h-25rem mt-5 xl:mt-0 lg:mt-0 hidden"
										}`} key={index}>
											<div className="px-7 py-7 pb-3 border-b border-gray-200">
												<div className="w-full flex justify-between">
													<img className="h-15 w-18" src="/sykes.jpg" alt="WorkLocal logo" />
													<button className="py-1 px-1 bg-gray-600 rounded-md h-8 w-8 flex justify-center" onClick={() => clickBookmark(item)}>
														<svg xmlns="http://www.w3.org/2000/svg" className={`${
															userBookmark
															&& userBookmark[0].bookmarks.id.includes(item.id) 
															?
															"h-5 w-5 text-yellow-400 hover:text-yellow-400 mt-1"
															:
															"h-5 w-5 text-white  hover:text-yellow-400 mt-1"
														}`} viewBox="0 0 20 20" fill="currentColor">
															<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
														</svg>
													</button>
												</div>
												<Link href={item.js_url}>
													<div className="mt-3 cursor-pointer">
														<a className="w-full text-xl font-semibold hover:text-blue-700 transition duration-700">
															{item.js_position_title}
														</a>
													</div>
												</Link>
												<div className="w-full text-lg mt-2 font-semibold text-gray-600">
													{item.js_company_name}
												</div>
												<div className="w-full text-lg mt-2 font-normal tracking-tighter text-gray-600">
													Click the APPLY NOW button and expect an over the phone interview within the day. Please keep your lines open between 9AM-6PM
												</div>
												<div className="w-full text-lg mt-2 font-semibold tracking-tighter text-gray-600 flex items-center text-gray-400 hover:text-blue-600">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
													</svg>
													{item.js_work_location}
												</div>
											</div>
											<div className="px-7 py-5 w-full">
												<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600">
													{item.js_employment_type}
												</span>
												<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600 ml-2">
													{item.specialization.name}
												</span>
											</div>
										</div>
									)
								})}
								{specificJob && specificJob.map((item, index) => {
									return (
										<div className={`${
											determineIndex(item.origin.coordinates.lat+","+item.origin.coordinates.long) <= sliderVal ?
											"w-full bg-white rounded-md h-25rem mt-5 xl:mt-0 lg:mt-0"
											:
											"w-full bg-white rounded-md h-25rem mt-5 xl:mt-0 lg:mt-0 hidden"
										}`} key={index}>
											<div className="px-7 py-7 pb-3 border-b border-gray-200">
												<div className="w-full flex justify-between">
													<img className="h-15 w-18" src="/sykes.jpg" alt="WorkLocal logo" />
													<button className="py-1 px-1 bg-gray-600 rounded-md h-8 w-8 flex justify-center" onClick={() => clickBookmark(item)}>
														<svg xmlns="http://www.w3.org/2000/svg" className={`${
															userBookmark
															&& userBookmark[0].bookmarks.id.includes(item.id) 
															?
															"h-5 w-5 text-yellow-400 hover:text-yellow-400 mt-1"
															:
															"h-5 w-5 text-white  hover:text-yellow-400 mt-1"
														}`} viewBox="0 0 20 20" fill="currentColor">
															<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
														</svg>
													</button>
												</div>
												<Link href={item.js_url}>
													<div className="mt-3 cursor-pointer">
														<a className="w-full text-xl font-semibold hover:text-blue-700 transition duration-700">
															{item.js_position_title}
														</a>
													</div>
												</Link>
												<div className="w-full text-lg mt-2 font-semibold text-gray-600">
													{item.js_company_name}
												</div>
												<div className="w-full text-lg mt-2 font-normal tracking-tighter text-gray-600">
													Click the APPLY NOW button and expect an over the phone interview within the day. Please keep your lines open between 9AM-6PM
												</div>
												<div className="w-full text-lg mt-2 font-semibold tracking-tighter text-gray-600 flex items-center text-gray-400 hover:text-blue-600">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
													</svg>
													{item.js_work_location}
												</div>
											</div>
											<div className="px-7 py-5 w-full">
												<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600">
													{item.js_employment_type}
												</span>
												<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600 ml-2">
													{item.specialization.name}
												</span>
											</div>
										</div>
									)
								})}
								{!filteredJobs && (
									<div>
										<div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
											<div class="animate-pulse flex space-x-4">
												<div class="rounded-full bg-blue-300 h-12 w-12"></div>
												<div class="flex-1 space-y-4 py-1">
													<div class="h-4 bg-blue-300 rounded w-3/4"></div>
													<div class="space-y-2">
														<div class="h-4 bg-blue-300 rounded"></div>
														<div class="h-4 bg-blue-300 rounded w-5/6"></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
								{!specificJob && router.query.ids == "" && (
									<div>
										<div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
											<div class="animate-pulse flex space-x-4">
												<div class="rounded-full bg-blue-300 h-12 w-12"></div>
												<div class="flex-1 space-y-4 py-1">
													<div class="h-4 bg-blue-300 rounded w-3/4"></div>
													<div class="space-y-2">
														<div class="h-4 bg-blue-300 rounded"></div>
														<div class="h-4 bg-blue-300 rounded w-5/6"></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
      </main>
      :
      null
      }
			{router.pathname == "/listing" && count && !grid ?
			<div className="bg-gray-100 w-full">
				<div className="mt-5 h-47rem max-w-7xl m-auto bg-transparent">
					<div className="grid grid-cols-1 gap-0 h-full xl:gap-8 lg:gap-8 overflow-auto">
						{filteredJobs && filteredJobs.map((item, index) => {
							return (
								<div className="w-full bg-white rounded-md h-full mt-5 xl:mt-0 lg:mt-0" key={index}>
									<div className="px-7 py-7 pb-3 border-b border-gray-200 flex justify-between items-center">
										<div className="w-2/3">
											<Link href={item.js_url}>
												<div className="mt-3 cursor-pointer">
													<a className="w-full text-2xl font-semibold text-blue-700 hover:text-blue-700 transition duration-700">
														{item.js_position_title}
													</a>
												</div>
											</Link>
											<div className="w-full text-lg mt-5 mb-5 font-semibold text-gray-600">
												{item.js_company_name}
											</div>
											<div className="w-full text-lg mb-5 font-semibold tracking-tighter text-gray-600 flex items-center text-gray-400 hover:text-blue-600">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
												</svg>
												{item.js_work_location}
											</div>
										</div>
										<div className="bg-blue-800 rounded-md w-1/3">
											<Link href={item.js_url}>
												<button className="w-full font-bold text-white text-lg py-2 px-5 rounded-lg text-center">
													Apply now
												</button>
											</Link>
										</div>
									</div>
									<div className="px-7 py-5 w-full">
										<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600">
											{item.js_employment_type}
										</span>
										<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600 ml-2">
											{item.specialization.name}
										</span>
									</div>
								</div>
							)
						})}
						{specificJob && specificJob.map((item, index) => {
							return (
								<div className="w-full bg-white rounded-md h-full mt-5 xl:mt-0 lg:mt-0" key={index}>
									<div className="px-7 py-7 pb-3 border-b border-gray-200 flex justify-between items-center">
										<div className="w-2/3">
											<Link href={item.js_url}>
												<div className="mt-3 cursor-pointer">
													<a className="w-full text-2xl font-semibold text-blue-700 hover:text-blue-700 transition duration-700">
														{item.js_position_title}
													</a>
												</div>
											</Link>
											<div className="w-full text-lg mt-5 mb-5 font-semibold text-gray-600">
												{item.js_company_name}
											</div>
											<div className="w-full text-lg mb-5 font-semibold tracking-tighter text-gray-600 flex items-center text-gray-400 hover:text-blue-600">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-400 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
												</svg>
												{item.js_work_location}
											</div>
										</div>
										<div className="bg-blue-800 rounded-md w-1/3">
											<Link href={item.js_url}>
												<button className="w-full font-bold text-white text-lg py-2 px-5 rounded-lg text-center">
													Apply now
												</button>
											</Link>
										</div>
									</div>
									<div className="px-7 py-5 w-full">
										<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600">
											{item.js_employment_type}
										</span>
										<span className="border border-green-600 rounded-md px-2 py-1 font-bold bg-transparent text-xs text-green-600 ml-2">
											{item.specialization.name}
										</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
				</div>
				:
				null
			}
			<Footer />
    </div>
	)
}