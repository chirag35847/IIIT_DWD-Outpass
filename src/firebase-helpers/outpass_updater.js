import { getFirestore, doc, updateDoc, collection, query, getDocs, where, arrayUnion } from "firebase/firestore";
import app from "../firebase"

const helper = async (role, accept, outpassId, remarks) => {
    const db = getFirestore(app);

    const outpassRef = doc(db, "outpass", outpassId);

    try {
        let status;
    
        if (role === "Faculty") {
          status = accept ? "approved" : "faculty_rejected";
        } else if (role === "Warden") {
          status = accept ? "approved" : "warden_rejected";
        } else if (role === "SWC" && !accept) {
          status = "swc_rejected";
        } else {
          // For role "SWC" and acceptance or other roles
          status = "swc_accepted";
    
          // Fetch Wardens from Firestore (assuming you have a "faculty" collection)
          const facultyCollectionRef = collection(db, "faculty");
          console.log('j')
          const wardenQuery = query(facultyCollectionRef, where("role", "==", "Warden"));
          console.log('sdad')
          const wardenSnap = await getDocs(wardenQuery);
          let wardenDocs = [];
    
          wardenSnap.forEach((doc) => {
            wardenDocs.push(doc);
          });
    
          // Randomly select a Warden
          const randomWardenDoc = wardenDocs[Math.floor(Math.random() * wardenDocs.length)];
    
          if (randomWardenDoc) {
            // Append outpassId to the selected Warden's outpasses field
            const wardenRef = doc(db, "faculty", randomWardenDoc.id);
            const wardenOutpassesField = "outpasses"; // Replace with the actual field name
            const wardenOutpasses = randomWardenDoc.data()[wardenOutpassesField] || [];
            wardenOutpasses.push(outpassId);
    
            // Update the selected Warden's outpasses field
            await updateDoc(wardenRef, {
              [wardenOutpassesField]: wardenOutpasses,
            });
          }
        }
    
        // Update the outpass status in Firestore
        await updateDoc(outpassRef, { status, remarks: arrayUnion(remarks)});
      } catch (error) {
        console.error("Error updating outpass status: ", error);
      }
} 

export default helper
