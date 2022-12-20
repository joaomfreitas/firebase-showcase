import { useState } from "react";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [creationSuccess, setCreationSuccess] = useState(false);

  const [error, setError] = useState(null);

  const signUp = () => {
    if (email.length === 0 || password.length === 0 || name.length === 0) {
      setError('Name, email and password must be correctly filled')
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((credentials) => {
        setError(null);
        setCreationSuccess(true);

        fetch('https://picsum.photos/200/300').then(res => {
          setDoc(doc(db, 'users', credentials.user.uid), {
            email: email,
            name: name,
            photoUrl: res.url,
            createdAt: serverTimestamp()
          });
        })

        setTimeout(() => {
          navigate('/chat');
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
      })
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to='/'
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://cdn.worldvectorlogo.com/logos/firebase-1.svg"
            alt="logo"
          />
          Firebase Showcase
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {error ?
            <div className="bg-red-700 rounded-t-lg py-5 px-6 mb-3 text-base text-white  w-full" role="alert">
              {error}
              <p className="text-xs italic">Oh no ...</p>
            </div>
            : null}
          {!error && creationSuccess ?
            <div className="bg-amber-700 rounded-t-lg py-5 px-6 mb-3 text-base text-white  w-full" role="alert">
              Account created succesfully!
              <p className="text-xs italic">Redirecting you to the chat ...</p>
            </div>
            : null}
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="name" name="name" id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="John Cena"
                  required=""
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email" name="email" id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password" name="password" id="password" placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required="" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
              </div>
              <button
                onClick={signUp}
                className="w-full text-white bg-amber-700 hover:bg-primary-700  ring-2 hover:ring-6 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create Account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account? {" "}
                <Link to='/'
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
