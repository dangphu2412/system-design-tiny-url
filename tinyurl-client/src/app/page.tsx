import {UrlShortener} from "@/url-shortener/url-shortener";

export default function HomePage() {
    return <>
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
            <div className="w-full max-w-md">
                <h1 className="mb-6 text-center text-3xl font-bold">URL Shortener</h1>
                <UrlShortener />
            </div>
        </main>
    </>
}
