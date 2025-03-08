import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeleteProfile({ username, profileName, setShowBtns, setShowDeleteProfile }) {
    const [pin, setpin] = useState('');
    const navigate = useNavigate();

    async function deleteProfile(e) {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5500/api/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, profileName, pin })
            });
            let data = await response.json();
            if (response.ok) {
                console.log(`Profile ${profileName} deleted successfully`);
                navigate('/');
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form className="grid w-max text-center *:border-1" onSubmit={deleteProfile}>
            <label>הזן את הקוד הסודי שלך</label>
            <input type="text" value={pin} onChange={(e) => setpin(e.target.value)} />
            <div className='grid grid-cols-2 *:border-1'>
                <input type="button" value="ביטול" onClick={(e) => { setShowBtns(true); setShowDeleteProfile(false); }} />
                <input type="submit" value="מחק פרופיל" />
            </div>
        </form>
    );
}