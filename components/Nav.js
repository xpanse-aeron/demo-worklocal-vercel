import Link from "next/link";
import { useState } from "react"
import { useUser } from '@auth0/nextjs-auth0';

export default function Nav({
	ids
}){
  const { user, error:userError, isLoading } = useUser();
	const [ toggle, setToggle ] = useState(false);
	return (
		<nav className="w-full shadow-2xl bg-white">
			<div className="flex justify-between align-center px-5 py-4">
				<div className="flex items-center">
					<Link href="/">
						<a>
							<img className="h-6 w-13 xl:h-8 xl:w-17 lg:h-8 lg:w-17" src="/logo.png" alt="WorkLocal logo" />
						</a>
					</Link>
					<div className="flex justify-between align-center items-center ml-3 hidden xl:block lg:block">
						<Link href="/">
							<a className="font-sans text-lg font-semibold text-gray-700 hover:text-blue-700 transition duration-1000">
								Search Jobs
							</a>
						</Link>
						<Link href="/">
							<a className="font-sans text-lg font-semibold text-gray-700 hover:text-blue-700 transition duration-1000 ml-5">
								Company Profiles
							</a>
						</Link>
					</div>
				</div>
				<div className="flex justify-between">
					{!user ? 
						<Link href="/api/auth/login">
							<a className="font-sans text-sm xl:text-md lg:text-md font-bold text-indigo-700 hover:border-opacity-75 hover:opacity-75 transition duration-1000 border rounded px-4 py-2 border-indigo-700">
								Login | Sign Up
							</a>
						</Link>
						:
						<a className="font-sans text-sm xl:text-md lg:text-md font-bold text-indigo-700 transition duration-1000 border rounded px-4 py-2 border-indigo-700 relative cursor-pointer" onClick={() => {
							if (toggle) {
								setToggle(false)
							}else {
								setToggle(true)
							}
						}}>
							Hi, {user.name}
							{toggle ? 
								<div className="absolute -bottom-24 left-0 text-black font-normal flex flex-col">
									<Link href={{
										pathname: "/listing",
										query: { ids: ids },
									}}>
										<a className="font-sans text-sm bg-white rounded w-56 text-black-700 transition duration-1000 border rounded px-4 py-2 border-black-700 text-center mb-1">
											Bookmarks
										</a>
									</Link>
									<Link href="/api/auth/logout">
										<a className="font-sans text-sm bg-white rounded w-25 text-black-700 transition duration-1000 border rounded px-4 py-2 border-black-700 text-center">
											Sign out
										</a>
									</Link>
								</div>
								:
								null
							}
						</a>
					}
					<Link href="https://www.jobstreet.com.ph/en/">
						<a className="font-sans text-md font-bold bg-blue-800 text-white hover:border-opacity-75 hover:opacity-75 transition duration-1000 ml-5 border rounded px-4 py-2 border-blue-700 hidden xl:block lg:block">
							Post A Job
						</a>
					</Link>
				</div>
			</div>
		</nav>
	)
}

export function NavListing({
	ids
}){
  const { user, error:userError, isLoading } = useUser();
	const [ toggle, setToggle ] = useState(false);
	return (
		<nav className="w-full shadow-2xl bg-white">
			<div className="flex justify-between align-center px-5 py-4 max-w-7xl m-auto">
				<div className="flex items-center">
					<Link href="/">
						<a>
							<img className="h-6 w-13 xl:h-8 xl:w-17 lg:h-8 lg:w-17" src="/logo.png" alt="WorkLocal logo" />
						</a>
					</Link>
					<div className="flex justify-between align-center items-center ml-3 hidden xl:block lg:block">
						<Link href="/">
							<a className="font-sans text-lg font-semibold text-gray-700 hover:text-blue-700 transition duration-1000">
								Search Jobs
							</a>
						</Link>
						<Link href="/">
							<a className="font-sans text-lg font-semibold text-gray-700 hover:text-blue-700 transition duration-1000 ml-5">
								Company Profiles
							</a>
						</Link>
					</div>
				</div>
				<div className="flex justify-between">
					{!user ? 
						<Link href="/api/auth/login">
							<a className="font-sans text-sm xl:text-md lg:text-md font-bold text-indigo-700 hover:border-opacity-75 hover:opacity-75 transition duration-1000 border rounded px-4 py-2 border-indigo-700">
								Login | Sign Up
							</a>
						</Link>
						:
						<a className="font-sans text-sm xl:text-md lg:text-md font-bold text-indigo-700 transition duration-1000 border rounded px-4 py-2 border-indigo-700 relative cursor-pointer" onClick={() => {
							if (toggle) {
								setToggle(false)
							}else {
								setToggle(true)
							}
						}}>
							Hi, {user.name}
							{toggle ? 
								<div className="absolute -bottom-24 left-0 text-black font-normal flex flex-col">
									<Link href={{
										pathname: "/listing",
										query: { ids: ids },
									}}>
										<a className="font-sans text-sm bg-white rounded w-56 text-black-700 transition duration-1000 border rounded px-4 py-2 border-black-700 text-center mb-1">
											Bookmarks
										</a>
									</Link>
									<Link href="/api/auth/logout">
										<a className="font-sans text-sm bg-white rounded w-25 text-black-700 transition duration-1000 border rounded px-4 py-2 border-black-700 text-center">
											Sign out
										</a>
									</Link>
								</div>
								:
								null
							}
						</a>
					}
					<Link href="https://www.jobstreet.com.ph/en/">
						<a className="font-sans text-md font-bold bg-blue-800 text-white hover:border-opacity-75 hover:opacity-75 transition duration-1000 ml-5 border rounded px-4 py-2 border-blue-700 hidden xl:block lg:block">
							Post A Job
						</a>
					</Link>
				</div>
			</div>
		</nav>
	)
}