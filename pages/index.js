import Head from 'next/head'
import { useRouter } from 'next/router'
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import SearchDropdown from "../components/SearchDropdowns"
import useSWR from "swr";
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const router = useRouter();
  const { user, error:userError, isLoading } = useUser();
  const { data: count, error } = useSWR("/api/list_count")

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

  const { data: userBookmark } = useSWR(user ? ["/api/userBookmarks", user.sub] : null, (url, id) => fetchBookmarks(url, id), { revalidateOnFocus: true });

  return (
    <div className="flex flex-col">
      <Head>
        <title>WorkLocal | Powered by WorkAbroad.ph</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {userBookmark && (
				<Nav
					ids={userBookmark[0].bookmarks.id}
				/>
			)}
      {!userBookmark && (
				<Nav
					ids={0}
				/>
			)}
      <main className="bg-gray-100 h-58rem flex justify-center items-center">
        <div className="container m-auto text-center">
          <h3 className="text-6xl font-bold text-gray-700 mb-3">
            Find the job you love
          </h3>
          <p className="text-2xl text-sm mt-4 text-gray-600 mb-5">Discover over 39,272 jobs in the Philippines</p>
          <SearchDropdown />
          <div className="mt-10 text-2xl hidden xl:block lg:block">
            <b>{count}</b> Popular Jobs &nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;<b>{count}</b> Companies
          </div>
        </div>
      </main>
      {/* :
      null
      } */}
      <Footer />
    </div>
  )
}
