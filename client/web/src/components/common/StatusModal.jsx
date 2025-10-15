import CenteredModal from "./CenteredModal";

export default function StatusModal({ isOpen, type, message, onClose }) {
    if (!isOpen) return null;

    const getContent = () => {
        switch (type) {
            case "loading":
                return (
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-lg font-medium text-slate-800">{message || "מעבד נתונים..."}</p>
                    </div>
                );

            case "error":
                return (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-lg font-semibold text-red-700 mb-2">שגיאה</p>
                        <p className="text-slate-700">{message}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-all"
                        >
                            סגור
                        </button>
                    </div>
                );

            case "success":
                return (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-lg font-semibold text-green-700 mb-2">הצלחה!</p>
                        <p className="text-slate-700">{message}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-all"
                        >
                            סגור
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <CenteredModal onClose={onClose}>
            {getContent()}
        </CenteredModal>
    );
}
