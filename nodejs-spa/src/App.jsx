import { useState, useEffect } from 'react'
import {BrowserRouter, Route, Routes, redirect, Navigate,} from "react-router-dom";


import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import Feed from './pages/Feed/Feed';
import SinglePost from './pages/Feed/SinglePost/SinglePost';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import './App.css';

function App({history}) {
    const [appState, setAppState] = useState({
        showBackdrop: false,
        showMobileNav: false,
        isAuth: true,
        token: null,
        userId: null,
        authLoading: false,
        error: null
    })

    useEffect(()=>{
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
            return;
        }
        if (new Date(expiryDate) <= new Date()) {
            logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
        setAppState( prevState => ({...prevState, isAuth: true, token: token, userId: userId }));
        setAutoLogout(remainingMilliseconds);
    },[])


    const mobileNavHandler = isOpen => {
        setAppState(prevState => ({...prevState, showMobileNav: isOpen, showBackdrop: isOpen }));
    };
    const  backdropClickHandler = () => {
        setAppState(prevState => ({...prevState, showBackdrop: false, showMobileNav: false, error: null }));
    };

    const logoutHandler = () => {
        setAppState(prevState => ({...prevState, isAuth: false, token: null }));
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    };

    const loginHandler = (event, authData) => {
        event.preventDefault();
        setAppState(prevState => ({...prevState, authLoading: true }));
        fetch('URL')
            .then(res => {
                if (res.status === 422) {
                    throw new Error('Validation failed.');
                }
                if (res.status !== 200 && res.status !== 201) {
                    console.log('Error!');
                    throw new Error('Could not authenticate you!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                setAppState({
                    ...appState,
                    isAuth: true,
                    token: resData.token,
                    authLoading: false,
                    userId: resData.userId
                });
                localStorage.setItem('token', resData.token);
                localStorage.setItem('userId', resData.userId);
                const remainingMilliseconds = 60 * 60 * 1000;
                const expiryDate = new Date(
                    new Date().getTime() + remainingMilliseconds
                );
                localStorage.setItem('expiryDate', expiryDate.toISOString());
               setAutoLogout(remainingMilliseconds);
            })
            .catch(err => {
                console.log(err);
                setAppState({
                    ...appState,
                    isAuth: false,
                    authLoading: false,
                    error: err
                });
            });
    };

    const  signupHandler = (event, authData) => {
        event.preventDefault();
       setAppState(prevState => ({...prevState, authLoading: true }));
        fetch('URL')
            .then(res => {
                if (res.status === 422) {
                    throw new Error(
                        "Validation failed. Make sure the email address isn't used yet!"
                    );
                }
                if (res.status !== 200 && res.status !== 201) {
                    console.log('Error!');
                    throw new Error('Creating a user failed!');
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                setAppState(prevState => ({...prevState, isAuth: false, authLoading: false }));
                history.replace('/');
            })
            .catch(err => {
                console.log(err);
                setAppState({
                    ...appState,
                    isAuth: false,
                    authLoading: false,
                    error: err
                });
            });
    };

    const setAutoLogout = milliseconds => {
        setTimeout(() => {
            logoutHandler();
        }, milliseconds);
    };

    const errorHandler = () => {
        setAppState( prevState => ({...prevState, error: null }));
    };

    let routes = (
        <Routes>
            <Route
                path="/"
                element={<Login onLogin={loginHandler} loading={appState.authLoading} />}
            />
            <Route
                path="/signup"
                element={<Signup onSignup={signupHandler} loading={appState.authLoading} />}
            />
            <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
    );
    if (appState.isAuth) {
        routes = (
            <Routes>
                <Route
                    path="/"
                    element={<Feed userId={appState.userId} token={appState.token} />}
                />
                <Route
                    path="/:postId"
                    element={
                        <SinglePost
                            userId={appState.userId}
                            token={appState.token}
                        />
                    }
                />
                <Route path='*' element={<MainNavigation to='/'/>}/>
            </Routes>
        );
    }

    return (
        <>
            {appState.showBackdrop && (
                <Backdrop onClick={backdropClickHandler} />
            )}
            <ErrorHandler error={appState.error} onHandle={errorHandler} />
            <Layout
                header={
                    <Toolbar>
                        <MainNavigation
                            onOpenMobileNav={mobileNavHandler.bind(true)}
                            onLogout={logoutHandler}
                            isAuth={appState.isAuth}
                        />
                    </Toolbar>
                }
                mobileNav={
                    <MobileNavigation
                        open={appState.showMobileNav}
                        mobile
                        onChooseItem={mobileNavHandler.bind(false)}
                        onLogout={logoutHandler}
                        isAuth={appState.isAuth}
                    />
                }
            />
            {routes}
        </>
  )
}

export default App
