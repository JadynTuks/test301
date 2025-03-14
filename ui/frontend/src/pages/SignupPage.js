import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css"
//import js

const SignupPage = () =>
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        const userData = {
            username,
            password
        };

        try
        {
            const response = await registerUser(userData);
            console.log("Registration Successful!", response);            
        }
        catch(error)
        {
            console.error("Registration Failed, please try again", error);
        }

        navigate("/");
    }

    return(
        <div className="Landing-wrapper">
            <div id="container">
                <h1>Please enter your details</h1>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="Password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                    <button type="submit">Signup</button>
                </form>   
            </div>
        </div>
    );
    
};

export default SignupPage;