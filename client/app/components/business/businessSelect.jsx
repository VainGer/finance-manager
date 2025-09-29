import Select from '../common/Select';

export default function BusinessSelect({ selectedCategory, businesses = [], loading = false, error = null, setSelectedBusiness, initialValue = "", onCreateNew = null }) {
    const handleSelectBusiness = (value) => {
        setSelectedBusiness(value);
    };

    return (
        <Select
            items={businesses}
            selectedValue={initialValue}
            onSelect={handleSelectBusiness}
            placeholder="בחר עסק"
            title="בחר עסק"
            iconName="chevron-down"
            itemIconName="storefront-outline"
            loading={loading}
            error={error}
            disabled={!selectedCategory}
            showCreateNew={!!onCreateNew}
            onCreateNew={onCreateNew}
        />
    );
}
