import { useState, useEffect } from "react";
import DeleteTransact from "./DeleteTransact";
export default function TransactionEditor({ username, profileName, category, item, id }) {

    return (
        <div className="grid">
            <div>
                
                <DeleteTransact username={username} profileName={profileName} category={category} item={item} id={id} />
                <button>אשר שינויים</button>
            </div>
        </div>
    )
}