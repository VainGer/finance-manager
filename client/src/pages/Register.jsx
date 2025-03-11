import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { FaUser, FaLock } from "react-icons/fa";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function register(e) {
        e.preventDefault();
        setError(null);
        try {
            let response = await fetch('http://localhost:5500/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                navigate('/account', { state: { username } });
            } else {
                setError("שם משתמש או סיסמה לא תקינים");
            }
        } catch (error) {
            setError("שגיאה ברשת, נסה שוב מאוחר יותר.");
            console.log(error);
        }
    }

    return (
        <div dir="rtl" className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex flex-col items-center">
            <Header />
            <div className="flex flex-col self-center items-center justify-center mt-20  md:w-full md:max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">הרשמה</h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 mb-4 text-sm"
                >
                    {error}
                </motion.p>

                <form onSubmit={register} className="grid gap-4 w-full">
                    {/* שם משתמש */}
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="w-full p-3 pl-10 border border-gray-300 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                            type="text"
                            placeholder="שם משתמש"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* סיסמה */}
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            className="w-full p-3 pl-10 border border-gray-300 rounded-md text-gray-900 bg-white focus:border-blue-500 focus:ring focus:ring-blue-200"
                            type="password"
                            placeholder="סיסמה"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* כפתור הרשמה */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                        type="submit"
                        disabled={username === "" || password === ""}
                    >
                        הרשמה
                    </motion.button>
                </form>

                {/* חזרה לדף הבית */}
                <a href="/" className="mt-4 text-blue-600 hover:underline">חזרה לדף הבית</a>
            </div>
        </div>
    );
}
