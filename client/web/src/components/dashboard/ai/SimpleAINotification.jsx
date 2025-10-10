import { useEffect, useState } from 'react';
import { useProfileData } from '../../../context/ProfileDataContext';

export default function SimpleAINotification() {
    const { newDataReady } = useProfileData();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (newDataReady) {
            setShow(true);
        }
    }, [newDataReady]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl border border-white/30">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        תובנות AI חדשות מוכנות!
                    </h3>
                    <p className="text-gray-600 mb-4">
                        לחץ על טאב "תובנות AI" לצפייה
                    </p>
                    <button
                        onClick={() => setShow(false)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        אישור
                    </button>
                </div>
            </div>
        </div>
    );
}