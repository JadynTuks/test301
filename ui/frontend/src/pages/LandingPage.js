import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"

//import js

const LandingPage = () =>
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        const userData = {
            username,
            password
        };

        try
        {
            const response = await loginUser(userData);
            console.log("Login Successful!", response);
            //redirect to Dash?
        }
        catch(error)
        {
            console.error("Login Failed, please try again", error);
        }
    }

    return(
        <div className="Landing-wrapper">
            <div id="container">
                <h1>Welcome to MPDB Studio!</h1>
                
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="Password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                    <p>Don't have an account? <Link to="/signup" className="LinkButton">Sign Up</Link> </p>
                        

                            {/* <button type="submit">Sign Up</button> */}
                    

                    <button type="submit">Login</button> 
                </form>   
            </div>
        </div>
    );
    
};

export default LandingPage;