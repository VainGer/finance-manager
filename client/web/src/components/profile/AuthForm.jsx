import Button from '../common/Button';
import FormInput from '../common/FormInput';
import ErrorAlert from '../common/ErrorAlert';
import SecurityBadge from '../common/SecurityBadge';

export default function AuthForm({
    selectedProfile,
    error,
    onSubmit,
    setPinInput,
    onCancel,
    loading
}) {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-white/50 shadow-2xl p-8">
                    {/* Profile Icon and Title */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            כניסה לפרופיל
                        </h1>
                        <p className="text-lg text-slate-600">
                            {selectedProfile.profileName}
                        </p>
                    </div>

                    {error && <ErrorAlert message={error} className="mb-6" />}
                    
                    <form className='space-y-6' onSubmit={onSubmit}>
                        <FormInput
                            type="password"
                            placeholder="הזן את הקוד הסודי (4 ספרות)"
                            onChange={(e) => setPinInput(e.target.value)}
                            maxLength="4"
                            className="text-center text-lg tracking-widest"
                            required
                        />
                        
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                onClick={onCancel}
                                style="outline"
                                className="flex-1 border-slate-400 text-slate-700 hover:bg-slate-100 hover:border-slate-500 transition-all duration-300"
                            >
                                ביטול
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                style="primary"
                                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {loading ? 'מאמת...' : 'כניסה'}
                            </Button>
                        </div>
                    </form>

                    <SecurityBadge className="mt-6" />
                </div>
            </div>
        </div>
    );
}
