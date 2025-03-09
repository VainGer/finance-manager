import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    async function login(e) {
        e.preventDefault();
        setError(null); 

        try {
            let response = await fetch('http://localhost:5500/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            let data = await response.json();

            if (response.ok) {
                navigate('/account', { state: { username } }); 
            } else {
                setError(data.message || "שם משתמש או סיסמה שגויים."); 
            }
        }
        catch (error) {
            console.log(error);
            setError("שגיאה בחיבור, נסה שוב מאוחר יותר."); 
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-6 bg-white rounded-md shadow-md'>
                <form className='grid grid-cols-1 gap-4' onSubmit={login}>
                    <h2 className='text-2xl font-semibold text-center text-blue-500'>התחברות</h2>

                  
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <label className='text-gray-700'>שם משתמש</label>
                    <input 
                        className='p-2 border border-gray-300 rounded-md text-center' 
                        type="text" 
                        placeholder="שם משתמש" 
                        onChange={(e) => setUsername(e.target.value)} 
                    />

                    <label className='text-gray-700'>סיסמה</label>
                    <input 
                        className='p-2 border border-gray-300 rounded-md text-center' 
                        type="password" 
                        placeholder="סיסמה" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button 
                        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition' 
                        type="submit"
                    >
                        כניסה
                    </button>
                </form>
            </div>
        </div>
    );
}
