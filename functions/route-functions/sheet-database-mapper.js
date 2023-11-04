const {getFirestore, collection, addDoc} = require("firebase/firestore");

const app = require('../../src/firebase')
const db = getFirestore(app)

const mapper = async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, "users"), {
          first: "Ada",
          last: "Lovelace",
          born: 1815
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
    }
}

module.exports = mapper