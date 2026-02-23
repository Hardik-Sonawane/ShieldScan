import { login, signup } from './actions'
import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
            <div className="w-full max-w-sm space-y-6">

                {/* Header */}
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex items-center space-x-2">
                        <ShieldAlert className="h-8 w-8 text-green-500" />
                        <span className="text-xl font-bold text-white tracking-wider">ShieldScan</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome Back</h1>
                    <p className="text-sm text-zinc-400">
                        Sign in to view your scan history and reports.
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur-sm">
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                        </div>

                    </div>

                    <div className="space-y-3 pt-2">
                        <button
                            formAction={login}
                            className="w-full rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors"
                        >
                            Log in
                        </button>
                        <button
                            formAction={signup}
                            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-zinc-500">
                    <Link href="/" className="hover:text-green-500 hover:underline underline-offset-4">
                        Back to Home
                    </Link>
                </p>

            </div>
        </div>
    )
}
