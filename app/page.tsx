import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-8">
      <div className="glass-panel max-w-4xl w-full p-8 md:p-16 rounded-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text drop-shadow-sm">
            TaskMaster Pro
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Elevate your productivity with a beautifully designed, secure, and fast task management experience. 
            Manage your goals effortlessly.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
