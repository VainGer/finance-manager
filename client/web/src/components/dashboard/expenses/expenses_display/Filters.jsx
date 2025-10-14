import { useState, useMemo } from 'react';
import Button from '../../../common/Button.jsx';

export default function Filters({
    availableDates,
    availableBusinesses,
    stagedFilters,
    filterByMonth,
    filterByCategory,
    filterByBusiness,
    sortByDate,
    sortByAmount,
    clearFilters,
    applyFilters,
    categories
}) {
    const [byDateApplied, setByDateApplied] = useState(false);
    const [bySumApplied, setBySumApplied] = useState(false);

    const appliedColor = 'text-white bg-green-600';

    const businessesForSelectedCategory = useMemo(() => {
        if (!stagedFilters.category) return [];
        const categoryObj = availableBusinesses.find(
            (b) => b.category === stagedFilters.category
        );
        return categoryObj ? categoryObj.businesses : [];
    }, [availableBusinesses, stagedFilters.category]);

    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">🔍 סינון ומיון</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Month Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        חודש
                    </label>
                    <select
                        value={stagedFilters.month || ''}
                        onChange={(e) => filterByMonth(e.target.value || null)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">כל החודשים</option>
                        {availableDates.map(({ dateYM, month, year }) => (
                            <option key={dateYM} value={dateYM}>
                                {`${month} ${year}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        קטגוריה
                    </label>
                    <select
                        value={stagedFilters.category || ''}
                        onChange={(e) => filterByCategory(e.target.value || null)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                        <option value="">כל הקטגוריות</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Business Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        עסק
                    </label>
                    <select
                        value={stagedFilters.business || ''}
                        onChange={(e) => filterByBusiness(e.target.value || null)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        disabled={!stagedFilters.category} // only active when category selected
                    >
                        <option value="">כל העסקים</option>
                        {businessesForSelectedCategory.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Options */}
                <div className="col-span-3 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        מיון
                    </label>
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-max">
                        <Button
                            className={byDateApplied ? appliedColor : ''}
                            onClick={() => {
                                sortByDate(true);
                                setByDateApplied(true);
                                setBySumApplied(false);
                            }}
                        >
                            לפי תאריך
                        </Button>
                        <Button
                            className={bySumApplied ? appliedColor : ''}
                            onClick={() => {
                                sortByAmount(true);
                                setByDateApplied(false);
                                setBySumApplied(true);
                            }}
                        >
                            לפי סכום
                        </Button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button
                    onClick={applyFilters}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                    החל סינונים
                </Button>

                <Button
                    onClick={() => {
                        clearFilters();
                        setByDateApplied(false);
                        setBySumApplied(false);
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium"
                >
                    נקה סינונים
                </Button>
            </div>
        </div>
    );
}
