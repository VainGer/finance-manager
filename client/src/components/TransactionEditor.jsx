import { useState } from "react";
import DeleteTransact from "./DeleteTransact";
import EditTransactionPriceAndDate from "./EditTransactionPriceAndDate";

export default function TransactionEditor({
    username, profileName, category,
    item, id, currentPrice,
    currentDate, onTransactionUpdate, closeEditor }) {

    const [updateFunction, setUpdateDateFunc] = useState(null);

    const updateTransactionBtn = () => {
        if (updateFunction) {
            updateFunction();
        }
    };

    return (
        <div className="fixed h-full w-full inset-0 z-50 flex items-center justify-center bg-black/10">
            <div className="grid bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-blue-600 text-center mb-4">
                    עריכת הוצאה
                </h2>
                <EditTransactionPriceAndDate
                    username={username}
                    profileName={profileName}
                    category={category}
                    item={item}
                    id={id}
                    onTransactionUpdate={onTransactionUpdate}
                    currentPrice={currentPrice}
                    currentDate={currentDate}
                    onSubmitEdit={setUpdateDateFunc}
                    closeEditor={closeEditor}
                />


                <div className="grid grid-cols-2 gap-4 mt-6">


                    <button
                        className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 transition"
                        onClick={updateTransactionBtn}
                    >
                        אשר שינויים
                    </button>


                    <DeleteTransact

                        username={username}
                        profileName={profileName}
                        category={category}
                        item={item}
                        id={id}
                        onTransactionUpdate={onTransactionUpdate}
                        closeEditor={closeEditor}
                    />
                </div>


                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600 transition w-full"
                    onClick={closeEditor}
                >
                    ביטול
                </button>
            </div>
        </div>
    );
}
