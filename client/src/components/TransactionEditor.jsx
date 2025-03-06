import { useState, useCallback, useEffect } from "react";
import DeleteTransact from "./DeleteTransact";
import EditTransactionPriceAndDate from "./EditTransactionPriceAndDate";
export default function TransactionEditor({ username, profileName, category, item, id, currentPrice, currentDate, onTransactionUpdate, closeEditor }) {

    const [updateFunction, setUpdateDateFunc] = useState(null);

    const updateTransactionBtn = () => {
        if (updateFunction) {
            updateFunction();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
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
                <div className="grid grid-cols-2 *:border-1">
                    <DeleteTransact username={username}
                        profileName={profileName}
                        category={category}
                        item={item}
                        id={id}
                        onTransactionUpdate={onTransactionUpdate}
                        closeEditor={closeEditor} />
                    <button onClick={updateTransactionBtn}>אשר שינויים</button>
                </div>
            </div>
        </div>
    );
}