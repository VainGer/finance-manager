export default function FormInput({ 
    label, 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    className = "",
    required = false,
    error = false
}) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 mr-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-3 text-right border rounded-xl shadow-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder:text-slate-400 ${
                    error 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-300 focus:ring-slate-500 focus:border-slate-500'
                } ${className}`}
            />
        </div>
    );
}
