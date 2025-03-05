import { useState, useEffect } from "react";
import DeleteTransact from "./DeleteTransact";
import EditTransactionPrice from "./EditTransactionPrice";
export default function TransactionEditor({ username, profileName, category, item, id, onTransactionUpdate }) {

    return (
        <div>
            <EditTransactionPrice
                username={username}
                profileName={profileName}
                category={category}
                item={item}
                id={id}
                onTransactionUpdate={onTransactionUpdate} />
            <DeleteTransact username={username}
                profileName={profileName}
                category={category}
                item={item}
                id={id}
                onTransactionUpdate={onTransactionUpdate} />
            <button>אשר שינויים</button>
        </div>

    )
}