import React from 'react'
import "../styles/NormalUser.css"

const NormalUserPage = () => 
{   
    return(
        <div className="normal-user-page">
            <h2>Your Details:</h2>
            <p>Name: John</p>
            <p>Surname: Doe</p>
            <button type="submit">Update</button>
            <button type="submit">Logout</button>
        </div>
    );
    
};

export default NormalUserPage;