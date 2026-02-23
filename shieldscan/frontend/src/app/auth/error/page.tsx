import Link from 'next/link'

export default async function ErrorPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const message = resolvedParams?.message || "Sorry, something went wrong with authentication."
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-center">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-4xl font-bold text-red-500">Error</h1>
                <p className="text-zinc-300">
                    {message as string}
                </p>
                <Link
                    href="/auth/login"
                    className="inline-block mt-4 rounded-md bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
                >
                    Try again
                </Link>
            </div>
        </div>
    )
}
