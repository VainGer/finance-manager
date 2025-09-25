import Select from "../common/Select";

export default function CategorySelect({ categories = [], loading = false, error = null, setSelectedCategory, initialValue = "" }) {

    const handleSelectCategory = (value) => {
        setSelectedCategory(value);
    };

    return (
        <Select
            items={categories}
            selectedValue={initialValue}
            onSelect={handleSelectCategory}
            placeholder="בחר קטגוריה"
            title="בחר קטגוריה"
            iconName="chevron-down"
            itemIconName="pricetag-outline"
            loading={loading}
            error={error}
        />
    );
}