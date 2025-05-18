import {redirect} from "next/navigation"

async function getLongUrl(url: string) {
    return url + 'long'
}

export default async function ShortUrlRedirect({ params }: { params: { id: string } }) {
    const { id } = params
    const longUrl = await getLongUrl(id)

    if (longUrl) {
        redirect(longUrl)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl font-bold">URL not found</h1>
            <p className="mt-4">The shortened URL you're trying to access doesn't exist or has expired.</p>
            <a href="/" className="mt-6 text-blue-600 hover:underline">
                Go back to homepage
            </a>
        </div>
    )
}
