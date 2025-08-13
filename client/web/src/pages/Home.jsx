import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center' dir="rtl">
            <div className="text-center space-y-8">
                {/* Logo/Header */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold text-gray-800">💰 מנהל כספים</h1>
                    <p className="text-xl text-gray-600">נהל את הכספים שלך בצורה חכמה ויעילה</p>
                </div>

                {/* Buttons */}
                <div className="space-y-4 mx-auto">
                    <Button
                        onClick={() => navigate('/login')}
                        style="success"
                    >
                        התחברות
                    </Button>
                    <br />
                    <Button
                        onClick={() => navigate('/register')}
                        style="primary"
                    >
                        הרשמה
                    </Button>
                </div>

                {/* Features */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="font-semibold text-gray-800 mb-2">גרפים ודוחות</h3>
                        <p className="text-gray-600 text-sm">עקוב אחר ההוצאות שלך עם גרפים מתקדמים</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-3">💳</div>
                        <h3 className="font-semibold text-gray-800 mb-2">ניהול תקציב</h3>
                        <p className="text-gray-600 text-sm">הגדר תקציבים וקבל התרעות</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-3xl mb-3">🔒</div>
                        <h3 className="font-semibold text-gray-800 mb-2">אבטחה מלאה</h3>
                        <p className="text-gray-600 text-sm">הנתונים שלך מוגנים בצורה מלאה</p>
                    </div>
                </div>
            </div>
        </div>
    );
}