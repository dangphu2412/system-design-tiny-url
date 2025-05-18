import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full px-6 py-6 border-t bg-background">
            <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between w-full">
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                <nav className="flex gap-4 sm:gap-6">
                    <Link href="#" className="text-sm text-muted-foreground hover:underline">
                        Terms
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:underline">
                        Privacy
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:underline">
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
