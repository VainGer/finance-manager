import { useState } from 'react';

export default function ChangePinCode({ username, profileName }) {
    const [currentPin, setCurrentPin] = useState('');
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
                body: JSON.stringify({ username, profileName, currentPin, newPin })
            });
            let data = await response.json();
            if (response.ok) {
                console.log('PIN code changed successfully');
                setCurrentPin('');
                setNewPin('');
                setConfirmNewPin('');
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center" onSubmit={changePin}>
            <label>קוד סודי נוכחי</label>
            <input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} />
            <label>קוד סודי חדש</label>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
            <label>אשר קוד סודי חדש</label>
            <input type="password" value={confirmNewPin} onChange={(e) => setConfirmNewPin(e.target.value)} />
            <input type="submit" value="שנה קוד סודי" />
        </form>
    );
}