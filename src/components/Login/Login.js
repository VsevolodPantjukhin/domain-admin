import React, { useState } from 'react';
import "./Login.css";
import axios from "axios";

const Login = () => {
    // console.log("access",Object.entries(access))
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const v = e.target.value.trim();
        if (v !== "") setError(null)
        setPassword(v);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(window.url + "auth/login", {
            "email": email.trim(),
            "password": password
        }, {
            // withCredentials: true,
            authFree: true,
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                setError(null);
                localStorage.setItem("access", res.data.tokens.access.token);
                localStorage.setItem("access_expires", res.data.tokens.access.expires);
                localStorage.setItem("refresh", res.data.tokens.refresh.token);
                localStorage.setItem("refresh_expires", res.data.tokens.refresh.expires);
                localStorage.setItem("profile", JSON.stringify(res.data.user));
                window.location.replace("/authorized")
            } else {
                setError(res.message);
            }
        }).catch(e => {
            console.log(e)
            if (e) {
                if (e && e.data && e.data.message) {
                    setError(e.data.message);
                } else {
                    setError(e.toString());
                }
            }

        })
    }

    return (
        <div className="admin-login">
            <div className="admin-login-container">
                <h1 className="admin-login-header">Admin-Domain</h1>
                <form onSubmit={handleSubmit} className="admin-login-body">

                    <div style={{ borderColor: error ? "rgb(70, 79, 96)" : "black" }} className='input-login'>
                        <input value={email} onChange={e => { setEmail(e.target.value); setError(null) }} className="admin-login-input" placeholder="Введите почту" required />
                    </div>


                    <div style={{ borderColor: error ? "red" : "black" }} className='input-login'>
                        <input value={password} onChange={handleChange} className="admin-login-input" type="password" placeholder="Введите пароль" required />
                        {password !== "" && <button onClick={e => { setPassword(""); setError(null) }} className='clear-password'>
                            <svg width="24.000000" height="24.000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <defs>
                                    <clipPath id="clip28_29">
                                        <rect id="cross-small" width="24.000000" height="24.000000" fill="white" fillOpacity="0" />
                                    </clipPath>
                                </defs>
                                <g clipPath="url(#clip28_29)">
                                    <path id="path" d="M15.4697 7.49805L15.4697 7.46973C15.7667 7.17261 16.2333 7.17261 16.5303 7.46973C16.8273 7.7666 16.8273 8.2334 16.5303 8.53027L16.502 8.53027L15.4697 7.49805ZM8.53033 16.502L8.53033 16.5303C8.23334 16.8274 7.76666 16.8274 7.46967 16.5303C7.1727 16.2334 7.1727 15.7666 7.46967 15.4697L7.49796 15.4697L8.53033 16.502ZM7.49796 8.53027L7.46967 8.53027C7.1727 8.2334 7.1727 7.7666 7.46967 7.46973C7.76666 7.17261 8.23337 7.17261 8.53033 7.46973L8.53033 7.49805L7.49796 8.53027ZM16.502 15.4697L16.5303 15.4697C16.8273 15.7666 16.8273 16.2334 16.5303 16.5303C16.2333 16.8274 15.7667 16.8274 15.4697 16.5303L15.4697 16.502L16.502 15.4697Z" fill="#000000" fillOpacity="0" fillRule="nonzero" />
                                    <path id="path" d="M16 8L8 16M8 8L16 16" stroke="#000000" strokeOpacity="1.000000" strokeWidth="1.500000" strokeLinejoin="round" />
                                </g>
                            </svg>
                        </button>}

                    </div>

                    <button disabled={error || password.trim() === ""} className="admin-login-button">Войти в админ панель</button>
                    {error ? <p className='admin-login-error-text'>
                        {error}
                    </p> : null}
                </form>
            </div>
        </div>
    );
}



export default Login;