import { signOut } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import sendNotificationToFCM from '../utils/notifications';
import ChatMessages from './ChatMessages';
import UserChatListing from './UserChatListing';


const Chat = () => {
    const [user] = useAuthState(auth);
    const { id } = useParams();
    const navigate = useNavigate();

    const [chatCollectionId, setChatCollectionId] = useState(null);
    const [messageValue, setMessageValue] = useState('');
    const [userObject, setUserObject] = useState([]);

    useEffect(() => {
        if (id !== undefined)
            mountChatRoomQuery();
    }, [id])

    const mountChatRoomQuery = () => {
        const queryCheckChatRoom = query(collection(db, `chatRoom`), where(`user_${auth.currentUser.uid}`, '==', true),
            where(`user_${id}`, '==', true));

        chatRoomAvailable(queryCheckChatRoom);
    }

    const chatRoomAvailable = async (chatQuery) => {

        const chatRooms = await getDocs(chatQuery);

        if (chatRooms.size === 0)
            constructNewChatRoom();
        else
            chatRooms.forEach((chatRoom) => {
                setChatCollectionId(chatRoom.id);
            });
    }

    const constructNewChatRoom = async () => {
        const obj = {};
        obj[`user_${auth.currentUser.uid}`] = true;
        obj[`user_${id}`] = true;

        const docRef = await addDoc(collection(db, 'chatRoom'), obj);
        setChatCollectionId(docRef.id);
    }


    const changeActiveUserMessaging = (user) => {
        setUserObject(user);
        navigate(`/chat/${user.id}`);
    }

    const logOut = () => {
        signOut(auth);
    }

    const deliverMessage = async (e) => {
        e.preventDefault();

        if (!messageValue) return;

        const payload = { text: messageValue, uid: user.uid, createdAt: serverTimestamp() }

        await addDoc(collection(db, `chatRoom/${chatCollectionId}/messages`), payload);

        //if user as FCM send a notification to that user that this current user sent him a message
        if (userObject.fcm) {
            const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));

            const messageObject = {
                "to": userObject.fcm,
                "notification": {
                    "title": `${userLoggedInfo.data().name} just sent you a message`,
                    "body": auth.currentUser.uid,
                },
                "data": {
                    "url": userLoggedInfo.data().photoUrl,
                    "forId": userObject.id
                }
            }
            sendNotificationToFCM(messageObject);
        }
        setMessageValue('');
    }

    return (
        <div className=" w-screen h-screen dark:bg-gray-900">
            <div className="w-full h-full lg:grid lg:grid-cols-3">
                <div className="border-r border-gray-700 lg:col-span-1">
                    <div className="mx-3 my-3">
                        <div className="relative text-white">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    viewBox="0 0 24 24" className="w-6 h-6 text-gray-300">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </span>
                            <input type="search" className="block w-full py-2 pl-10 bg-slate-800 rounded outline-none" name="search"
                                placeholder="Search" required />
                        </div>
                    </div>

                    <ul className="overflow-auto h-[32rem]">
                        <h2 className="my-2 mb-2 ml-2 text-lg text-white">All users</h2>
                        <UserChatListing userId={id} passUserToParent={(user) => changeActiveUserMessaging(user)} />
                    </ul>
                </div>
                <div className="hidden lg:col-span-2 lg:block">
                    <div className="w-full h-screen">
                        <div className="relative flex items-center p-3 border-b border-gray-700 justify-between">
                            {userObject.length === 0
                                ?
                                <div className="w-1/2 flex items-center">
                                    <span className="block ml-2 font-bold text-white">Select one user to talk to </span>


                                </div>
                                :
                                <div className="w-1/2 flex items-center">
                                    <img className="object-cover w-10 h-10 rounded-full"
                                        src={userObject.photoUrl} alt="username" />
                                    <span className="block ml-2 font-bold text-white">{userObject.name}</span>
                                    <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                                    </span>
                                </div>
                            }
                            <div>
                                <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={() => { navigate('/profile') }}>
                                    Change profile picture
                                </button>
                                <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={logOut}>
                                    Sign out
                                </button>
                            </div>
                        </div>
                        <div className="relative w-full p-6 overflow-y-auto h-[calc(100%-138px)] overflow-x-scroll">
                            <div className="message">
                                <div className='align-middle items-center'>
                                    <div className='w-full flex items-center justify-center'>
                                        <svg className="w-80 h-80 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </div>
                                    <div className='w-full flex items-center justify-center mb-10'>
                                        {userObject.length === 0
                                            ? <p className="text-white">You are ready to start chatting with someone!</p>
                                            : <p className="text-white">You are chatting with {userObject.name}!</p>
                                        }
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {chatCollectionId ? <ChatMessages auth={auth} collectionId={chatCollectionId} /> : null}
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full p-3 border-t border-gray-700">
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <input type="text" placeholder="Message"
                                value={messageValue} onChange={(e) => setMessageValue(e.target.value)}
                                className="block w-full py-2 pl-4 mx-3 bg-slate-700 text-white rounded-full outline-none focus:text-white"
                                name="message" required />
                            <button onClick={deliverMessage}>
                                <svg className="w-8 h-8 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Chat;
