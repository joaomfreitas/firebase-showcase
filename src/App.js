import './App.css';
import './firebase.js'

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

import Chat from './components/Chat';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Loading from './components/Loading';

import 'firebase/firestore'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import NotificationBuilder from './components/NotificationBuilder';
import Profile from './components/Profile';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function (err) {
      console.log('Service worker registration failed, error:', err);
    });
}

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const [fcmToken, setFcmToken] = useState('')
  const [fcmMessages, setFcmMessages] = useState([]);

  const [userFCM, setUserFCM] = useState();

  useEffect(() => {
    if (user && !loading) {
      const messages =
        onMessage(getMessaging(), (payload) => {
          if (payload.data.forId === auth.currentUser.uid) {
            setShow(true);
            const messages = [...fcmMessages];
            messages.push(payload);
            setFcmMessages(messages);
            setTimeout(() => {
              const messages = [...fcmMessages];
              messages.pop(payload);
              setFcmMessages(messages);
            }, 3000)
          }
        });

      const token =
        getToken(getMessaging(), {
          vapidKey:
            "BGpiyjyE35MUxLQ3DMXC9DwxQsx7SwWazulSyXFHyXfvgipTwE6PAVdx4CIjmwTaFrKRD31XEoKZln-B6b199s0",
        }).then((currentToken) => {
          if (currentToken) {
            setFcmToken(currentToken);
            if (currentToken !== userFCM) {
              setUserFCM(currentToken);
              const userRef = doc(db, 'users', auth.currentUser.uid);
              updateDoc(userRef, {
                fcm: currentToken,
                fcmDate: serverTimestamp()
              }).then((response) => {
                console.log('user fcm updated');
              }).catch((error) => {
                console.log('fcm error -> ', error);
              })
            }
          } else {
            console.log("Can not get token");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  return (
    <div >
      <BrowserRouter>
        <NotificationBuilder fcmMessages={fcmMessages} />
        <Routes>
          <Route path="/">
            <Route index element={!loading && user ? <Navigate replace to="/chat" /> : <Navigate replace to='/signin' />} />
            <Route path="signup" element={loading ? <Loading /> : !user ? <SignUp /> : <Navigate replace to="/chat" />} />
            <Route path="signin" element={loading ? <Loading /> : !user ? <SignIn /> : <Navigate replace to="/chat" />} />
            <Route exact path="chat" element={loading ? <Loading /> : user ? <Chat /> : <Navigate replace to="/" />} />
            <Route path="chat/:id" element={loading ? <Loading /> : user ? <Chat /> : <Navigate replace to="/" />} />
            <Route exact path="profile" element={loading ? <Loading /> : user ? <Profile /> : <Navigate replace to="/" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

