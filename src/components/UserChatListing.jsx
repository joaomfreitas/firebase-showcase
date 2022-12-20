import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect, memo } from 'react'
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';

const UserChatListing = (props) => {

    const [users, setUsers] = useState([]);
    const id = props.userId;

    const params = useParams();


    useEffect(() => {
        getDocs(collection(db, "users"))
            .then((querySnapshot => {
                let buildUsers = [];
                querySnapshot.forEach((doc) => {
                    buildUsers.push({ ...doc.data(), id: doc.id });
                });
                setUsers(buildUsers);
                if (params.id) {
                    const userOpened = buildUsers.findIndex((user) => user.id === params.id);
                    props.passUserToParent(buildUsers[userOpened]);
                }
            }));
    }, []);


    return (
        <li>
            {users.map((user, index) => {
                if (user.id === auth.currentUser.uid) return null;
                return <div
                    className={params.id === user.id
                        ? "flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out bg-slate-700 border-b border-gray-700 cursor-pointer focus:outline-none"
                        : "flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-700 cursor-pointer hover:bg-slate-700 focus:outline-none"}
                    onClick={() => { props.passUserToParent(user) }} key={index}>
                    <img className="object-cover w-10 h-10 rounded-full"
                        src={user.photoUrl} alt="username" />
                    <div className="w-full pb-2">
                        <div className="flex justify-between">
                            <span className="block ml-2 font-semibold text-white">{user.name}</span>
                            <span className="block ml-2 text-sm text-white">{user.email}</span>
                        </div>
                        <span className="block ml-2 text-sm text-white">click to talk with me</span>
                    </div>
                </div>
            })}
        </li >
    )
}

export default memo(UserChatListing);
