import axios from "axios";

export default function sendNotificationToFCM(messageObject) {
    axios.post('https://fcm.googleapis.com/fcm/send',
        messageObject,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${process.env.REACT_APP_FCM_AUTHORIZATION}`
            }
        }).then((response) => {
            console.log('res -> ', response);
        }).catch((err) => console.log('error ->', err));
}