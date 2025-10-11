import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const sections = [
        { title: "ניהול פרופילים", description: "צפייה, עדכון ומחיקת פרופילים", route: "/admin/profiles" },
        { title: "ניהול תקציבים", description: "צפייה ומחיקת תקציבים", route: "/admin/budgets" },
        { title: "הוצאות", description: "צפייה בהוצאות", route: "/admin/expenses" },
        { title: "לוגים", description: "צפייה בפעולות משתמשים", route: "/admin/logs" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6 rtl">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    דשבורד
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto mt-32">
                    {sections.map((section) => (
                        <div
                            key={section.route}
                            onClick={() => navigate(section.route)}
                            className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold mb-2 text-indigo-700">
                                    {section.title}
                                </h2>
                                <p className="text-gray-600 text-sm">{section.description}</p>
                            </div>
                            <div className="mt-4 text-indigo-600 font-medium text-sm">
                                לחץ לכניסה
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
