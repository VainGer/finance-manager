export default function ErrorAlert({ message, className = "" }) {
    if (!message) return null;

    return (
        <div className={`mb-6 p-4 bg-red-50 border border-red-200 rounded-xl ${className}`}>
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <p className="text-sm text-red-800 font-medium">{message}</p>
            </div>
        </div>
    );
}
