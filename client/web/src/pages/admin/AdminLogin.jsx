import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAdmin from "../../hooks/admin/useAuthAdmin";

export default function AdminLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, error } = useAuthAdmin();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginResult = await login(username, password);
        if (loginResult) {
            navigate("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    התחברות מנהל
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "מתחבר..." : "התחבר"}
                    </button>
                </form>
            </div>
        </div>
    );
}