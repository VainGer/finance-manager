export default function AuthForm({
    selectedProfile,
    error,
    onSubmit,
    setPinInput,
    onCancel,
    loading
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    כניסה לפרופיל: {selectedProfile.profileName}
                </h1>
                {error && <p className="text-sm text-center text-red-600 bg-red-100 border border-red-400 rounded-md py-2 px-4">{error}</p>}
                <form className='space-y-6' onSubmit={onSubmit}>
                    <div>
                        <input
                            type="password"
                            placeholder="הזן את הקוד הסודי"
                            onChange={(e) => setPinInput(e.target.value)}
                            className="w-full px-4 py-2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            maxLength="4"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 font-semibold text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'מאמת...' : 'כניסה'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
