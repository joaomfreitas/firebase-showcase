import { getAdditionalUserInfo } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';

const Profile = () => {
    const [file, setFile] = useState("");
    const [user, setUser] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const navigate = useNavigate();


    useEffect(() => {
        gettUserInfo()

    }, []);

    const gettUserInfo = async () => {
        const userLoggedInfo = await getDoc(doc(db, 'users', auth.currentUser.uid));

        setUser(userLoggedInfo.data());
    }

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    }
    console.log('user -> ', user)

    const handleImageUpload = () => {
        if (!file) {
            alert('Attach a file first')
        }


        const storageRef = ref(storage, `/files/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setProgress(progress);
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log('url -> ', url);
                    setImage(url);
                    updateDoc(doc(db, 'users', auth.currentUser.uid), {
                        photoUrl: url
                    })
                }

                )
            })
    }

    return (
        <div className=" w-screen h-screen dark:bg-gray-900">

            <div className="w-full h-full flex justify-center align-middle">

                <div className="border-gray-700 lg:col-span-1 align-middle ">
                    <div className='grid place-items-center h-screen justify-around'>
                        <div>
                            <button type="button" className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                onClick={() => { navigate('/chat') }}>
                                Back to chat
                            </button>
                        </div>
                        {(user || image) ? <img src={image || user.photoUrl} className="max-h-96" /> : null}
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Current image</label>
                        <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file"
                            accept="image/*" onChange={handleChange} />
                        <button
                            onClick={handleImageUpload}
                            className="w-full text-white bg-amber-700 hover:bg-primary-700  ring-2 hover:ring-6 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Change image
                        </button>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" >{progress} % done</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
