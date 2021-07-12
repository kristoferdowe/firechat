import React, { useRef , useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


 firebase.initializeApp({ 
    apiKey: "AIzaSyDL17GoXUGDGCSG65pFjAT0F1hMyJHbcT4",
    authDomain: "survivalist-6e567.firebaseapp.com",
    projectId: "survivalist-6e567",
    storageBucket: "survivalist-6e567.appspot.com",
    messagingSenderId: "748010289572",
    appId: "1:748010289572:web:5b815d677913399ba46931",
    measurementId: "G-6322LERTQD"
 });

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>S U R V I V A L I S T</h1>
        <SignOut/>
        </header>

      <section>

       {user ? <ChatRoom/> : <SignIn/>}

      </section>


    </div>
  );
}

function SignIn(){


  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>

    <button className="sign-in" onClick= {signInWithGoogle}> Sign in with Google</button>
    <p> Please Follow Community Guidelines</p>
</>
  )
}

function SignOut () {


  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}> Sign Out</button>
  
    )
  }

  function ChatRoom() {

    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
  
    const [messages] = useCollectionData(query, { idField: 'id' });
  
    const [formValue, setFormValue] = useState('');
  
  
    const sendMessage = async (e) => {
      e.preventDefault();
  
      const { uid, photoURL } = auth.currentUser;
  
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
  
      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    }
  
    return (
    
    <>
      <main>
  
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
  
        <div ref={dummy}></div>
  
      </main>
  
      <form onSubmit={sendMessage}>
  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!formValue} >🧟</button>
  
      </form>
    </>)
  }
  
  
  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>)
  }
  
  
  export default App;