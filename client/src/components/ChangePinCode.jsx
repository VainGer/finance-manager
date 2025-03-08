import { useState } from 'react';

export default function ChangePinCode({ username, profileName, setShowBtns, setShowChangePinCode }) {
    const [pin, setpin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmNewPin, setConfirmNewPin] = useState('');

    async function changePin(e) {
        e.preventDefault();
        if (newPin !== confirmNewPin) {
            alert('New PIN and confirmation PIN do not match');
            return;
        }
        try {
            let response = await fetch('http://localhost:5500/api/user/change_pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin, newPin })
            });
            let data = await response.json();
            if (response.ok) {
                console.log('PIN code changed successfully');
                setShowBtns(true);
                setShowChangePinCode(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center mt-3.5 *:border-1" onSubmit={changePin}>
            <label>קוד סודי נוכחי</label>
            <input type="password" value={pin} onChange={(e) => setpin(e.target.value)} />
            <label>קוד סודי חדש</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
            <label>אשר קוד סודי חדש</label>
            <input type="password" value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value)} />
            <div className="grid grid-cols-2 *:border-1">
                <input type="button" value="ביטול" onClick={(e) => { setShowChangePinCode(false); setShowBtns(true); }} />
                <input type="submit" value="שנה קוד סודי" />
            </div>
        </form>
    );
}