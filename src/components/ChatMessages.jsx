import { collection, limit, orderBy, query } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function ChatMessages(props) {

    const messageScrolling = useRef(null);

    const [messagesRef, setMessagesRef] = useState(collection(db, `chatRoom/${props.collectionId}/messages`));
    const queryRef = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));

    const [userMessages] = useCollection(queryRef, { idField: 'id' });

    useEffect(() => {
        messageScrolling.current.scrollIntoView({ behavior: "smooth" });
    }, [userMessages])

    useEffect(() => {
        setMessagesRef(collection(db, `chatRoom/${props.collectionId}/messages`));
    }, [props.collectionId])

    if (!props.auth.currentUser) return;
    return (
        <>

            {userMessages && userMessages.docs.map((message, index) => {
                const messageData = message.data();
                return <li className={`flex ${props.auth.currentUser.uid !== messageData.uid ? "justify-start" : "justify-end"}`} key={index}>
                    <div className={`relative max-w-xl px-4 py-2 text-white ${props.auth.currentUser.uid !== messageData.uid ? "bg-amber-500" : "bg-amber-700"} rounded shadow`}>
                        <span className="block">{messageData.text}</span>
                    </div>
                </li>
            })}
            <div ref={messageScrolling}></div>

        </>
    )
}
