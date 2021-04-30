import Link from "next/link";

export default function Footer(){

	const links = [
		{ name: "Search Jobs"},
		{ name: "About WorkLocal.ph"},
		{ name: "F.A.Q."},
		{ name: "Privacy Policy"},
		{ name: "Copyright © 2020 WorkAbroad.ph"}
	]

	return (
		<footer className="w-full bg-white">
			<div className="flex justify-center align-center px-5 py-5 flex-wrap">
				{links.map((item, index) => (
					<Link href="/" key={index}>
						{index == links.length - 1 ?
						<a  className="ml-5 text-gray-400 tracking-tighter font-semibold">
							{item.name}
						</a>
						:
						<a  className="ml-5 text-gray-400 tracking-tighter font-semibold">
							{item.name}
							<span className="ml-5 text-gray-400">|</span>
						</a>
					}
					</Link>
				))}
			</div>
		</footer>
	)
}