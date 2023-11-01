import React from 'react'
// import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

import '/home/wet_bed/code/dev/projectX-outpass/IIIT_DWD-Outpass/src/login/assets/App.css'



/*basic sign in is done*/



export default function SignIn() {

    const [user, setUser ] = useState({});

    function handleCallbackResponse(response) {
        console.log("Encoded JWT ID TOken: " + response.credential );
        var userObj = jwtDecode(response.credential);
        setUser(userObj);
        console.log(user);
        document.getElementById("signInDiv").hidden = true;
    }
    
    function handleSignOut(event) {
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
          client_id: "681225243128-70k09of6c7vao2k8vhven9p4r8rcnegb.apps.googleusercontent.com",
          callback: handleCallbackResponse
        });
    
        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme:"outline", size: "large"}
        );
    }, []);

    return (
        <div className="App">
            <div id = "signInDiv"></div>
            {
                Object.keys(user).length !=0 &&
                <button onClick={ (e) => handleSignOut(e)}>Sign out</button>
            }
            
            { user &&
                <div>
                    <img src={user.picture}></img>
                    <h3>{user.name }</h3>
                </div>

            }
        </div>

        // <GoogleLogin
        //     onSuccess={credentialResponse => {
        //         console.log(credentialResponse);
        //     }}
        //     onError={() => {
        //         console.log('Login Failed');
        //     }}
        // />
    )
}
