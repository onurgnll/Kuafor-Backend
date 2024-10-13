const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, deleteObject, uploadString } = require("firebase/storage");
const path = require('path');


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFile = (file, bucketName, cb) => {
    return new Promise((resolve, reject) => {
        const name = file.originalname.split(".")[0].split(' ').join('');       // split ile boşlukları kaldırıp, join ile tüm kelimeleri birleştirdim
        const extension = path.extname(file.originalname); 
        const fileName = `${Date.now()}_${name}${extension}`;
        
        const imageRef = ref(storage, `${bucketName}/${fileName}`);

        const b64 = Buffer.from(file.buffer).toString('base64');

        uploadString(imageRef, b64, 'base64', { contentType: `${file.mimetype}`})
        .then(() => {
            getDownloadURL(imageRef)
            .then((url) => resolve(cb(null, url)))
            .catch((e) => reject(cb(e)));
        }).catch((e) => reject(cb(e)));
    });
}


const deleteFile = (fileName, bucketName, cb) => {
    return new Promise((resolve, reject) => {
        const regex = /%2F([^?]+)?/;
        const match = fileName.match(regex);
        const desertRef = ref(storage, `${bucketName}/${match[1]}`);
        deleteObject(desertRef)
            .then(() => resolve(cb(null)))
            .catch(e => reject(cb(e)));
    });
}

module.exports = {
    uploadFile,
    deleteFile
}