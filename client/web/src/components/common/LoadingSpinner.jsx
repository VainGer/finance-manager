export default function LoadingSpinner({ size = "md", color = "blue" }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8", 
        lg: "h-12 w-12"
    };

    const colorClasses = {
        blue: "border-blue-600",
        green: "border-green-600",
        red: "border-red-600"
    };

    return (
        <div className="flex justify-center items-center py-8">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 ${colorClasses[color]}`}></div>
        </div>
    );
}
