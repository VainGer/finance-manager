import { useNavigate } from "react-router-dom";

export default function AdminHome() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center rtl">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    מערכת ניהול
                </h1>

                <p className="text-gray-600 mb-8">
                    התחבר או הירשם כמנהל כדי להמשיך
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/admin/login")}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
                    >
                        התחברות
                    </button>

                    <button
                        onClick={() => navigate("/admin/register")}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                    >
                        הרשמה
                    </button>
                </div>
            </div>
        </div>
    );
}
