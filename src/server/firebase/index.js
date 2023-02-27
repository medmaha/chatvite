import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyATInga-9G7HvhxRBQz1srJSgOb15s4US8",
    authDomain: "chatvite100.firebaseapp.com",
    projectId: "chatvite100",
    storageBucket: "chatvite100.appspot.com",
    messagingSenderId: "999341400459",
    appId: "1:999341400459:web:0e456d831bc6c2537b0f8e",
    measurementId: "G-WNSD99LTKD",
}

const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

export const firebaseStorage = getStorage(app)
