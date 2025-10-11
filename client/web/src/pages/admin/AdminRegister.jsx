import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthAdmin from "../../hooks/admin/useAuthAdmin";

export default function AdminRegister() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secret, setSecret] = useState("");
    const { register, loading, error, success } = useAuthAdmin();

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerResult = await register(username, password, secret);
        if (registerResult) {
            navigate("/admin/login");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    הרשמת מנהל
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
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

                    <input
                        type="password"
                        placeholder="סיסמת מנהל סודית"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "נרשם..." : "הירשם"}
                    </button>
                </form>
            </div>
        </div>
    );
}
