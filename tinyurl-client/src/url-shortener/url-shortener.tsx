"use client"

import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Check, Copy, Link} from "lucide-react"
import { doRequest } from '@/shared/api-client/api-client';

function shortenUrl(url: string) {
    return doRequest('/shorten', {
        method: 'POST',
        body: JSON.stringify({
            url
        })
    })
}

export function UrlShortener() {
    const [url, setUrl] = useState("")
    const [shortUrl, setShortUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (!url) {
                throw new Error("Please enter a URL")
            }

            // Validate URL format
            try {
                new URL(url)
            } catch {
                throw new Error("Please enter a valid URL (include http:// or https://)")
            }

            const result = await shortenUrl(url)
            setShortUrl(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (shortUrl) {
            navigator.clipboard.writeText(shortUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shorten Your URL</CardTitle>
                <CardDescription>Enter a long URL to get a shorter, more manageable link.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Long URL</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="url"
                                type="text"
                                placeholder="https://example.com/very/long/url/that/needs/shortening"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Shortening..." : "Shorten"}
                            </Button>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </form>

                {shortUrl && (
                    <div className="mt-6 space-y-2">
                        <Label htmlFor="short-url">Your shortened URL</Label>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 overflow-hidden rounded-md border bg-muted px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <a
                                        href={shortUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-sm text-blue-600 hover:underline"
                                    >
                                        {shortUrl}
                                    </a>
                                </div>
                            </div>
                            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">Shortened URLs are valid for the current session only.</p>
            </CardFooter>
        </Card>
    )
}
