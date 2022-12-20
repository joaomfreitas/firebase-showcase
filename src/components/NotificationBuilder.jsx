import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotificationBuilder(props) {
    const navigate = useNavigate();

    return (
        <>
            {props.fcmMessages.map((message, index) => {
                console.log('message ->', message)
                return <div id="toast-simple" className="absolute bottom-0 left-0 flex items-center p-4 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 cursor-pointer" role="alert"
                    key={index} onClick={() => { navigate(`chat/${message.notification.body}`) }}>
                    <img src={message.data.url} className="w-10 h-10" focusable="false" alt={message.notification.title}></img>
                    <div className="pl-4 text-sm font-normal">{message.notification.title}</div>
                </div>
            })}
        </>
    )

}
