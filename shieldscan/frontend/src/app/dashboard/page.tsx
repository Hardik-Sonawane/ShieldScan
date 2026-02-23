import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/auth/login/actions'
import { LogOut, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Grab the currently logged-in user
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Header NavBar */}
            <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-6 w-6 text-green-500" />
                    <Link href="/" className="font-bold text-lg tracking-wider hover:text-green-500 transition-colors">
                        ShieldScan
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    {user && <span className="text-sm text-zinc-400">{user.email}</span>}
                    <form action={logout}>
                        <button className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-red-400 transition-colors">
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* Main Content Dashboard */}
            <main className="flex-1 p-6 md:p-12 max-w-6xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-zinc-400 mt-2">Welcome! View your past scan history and download exact AI Fix solutions.</p>
                </div>

                {/* Placeholder for Data Grid or Scans */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-medium text-zinc-400 mb-1">Total Scans</h2>
                        <p className="text-3xl font-bold text-green-500">0</p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-medium text-zinc-400 mb-1">Average Score</h2>
                        <p className="text-3xl font-bold text-yellow-500">--</p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-medium text-zinc-400 mb-1">Subscription Status</h2>
                        <p className="text-xl font-bold text-white mt-1">Free Tier</p>
                        <button className="mt-4 text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 hover:bg-green-500/20 transition-colors">
                            Upgrade to Unblur Fixes
                        </button>
                    </div>
                </div>

                {/* History Placeholder */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center text-zinc-500">
                        <ShieldAlert className="h-12 w-12 mb-4 opacity-20" />
                        <p>No scans found yet. Head over to the scanner to check your first site!</p>
                        <Link href="/" className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                            Start New Scan
                        </Link>
                    </div>
                </div>

            </main>
        </div>
    )
}
