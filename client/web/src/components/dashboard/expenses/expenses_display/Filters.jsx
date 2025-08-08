export default function Filter({ filters, setFilters, categories, businesses }) {

    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">🔍 סינון וחיפוש</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        קטגוריה
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value, business: 'all' })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">כל הקטגוריות</option>
                        {categories.map(category => (
                            category !== 'all' && <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                {/* Business Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        עסק
                    </label>
                    <select
                        value={filters.business}
                        onChange={(e) => setFilters({ ...filters, business: e.target.value, category: 'all' })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">כל העסקים</option>
                        {businesses.map(business => (
                            business !== 'all' && <option key={business} value={business}>{business}</option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        מיון לפי
                    </label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="date">תאריך</option>
                        <option value="amount">סכום</option>
                        <option value="description">תיאור</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        סדר מיון
                    </label>
                    <select
                        value={filters.sortOrder}
                        onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="desc">יורד (חדש לישן)</option>
                        <option value="asc">עולה (ישן לחדש)</option>
                    </select>
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4">
                <button
                    onClick={() => setFilters({
                        category: 'all',
                        business: 'all',
                        sortBy: 'date',
                        sortOrder: 'desc'
                    })}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    נקה סינונים
                </button>
            </div>
        </div>
    );
}