import React from 'react'
import Papa from 'papaparse'
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebase"

function App() {

    const handleFile = (event) => {
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: false,
            complete: async function (result) {
                const columnArr = []
                const valuesArr = []

                result.data.map((d) => {
                    columnArr.push(Object.keys(d));
                    valuesArr.push(Object.values(d));
                })

                const data = [];
                for (let facultIdx = 0; facultIdx < columnArr[0].length; facultIdx++) {
                    const obj = { faculty: columnArr[0][facultIdx] }
                    obj.role = valuesArr[0][facultIdx];
                    const mentees = []

                    for (let rowIdx = 1; rowIdx < valuesArr.length; rowIdx++) {
                        if (valuesArr[rowIdx][facultIdx] != '') {
                            mentees.push(valuesArr[rowIdx][facultIdx]);
                        }
                        else {
                            continue;
                        }

                    }
                    obj.mentees = mentees
                    data.push(obj)
                }

                try {
                    const db = getFirestore(app);
                    data.map(async x=>{


                        const docRef = await addDoc(collection(db, "faculty"), {
                            email:x.faculty,
                            role:x.role,
                            mentees:x.mentees
                        });

                        x.mentees.map(async y=>{
                            const students = await addDoc(collection(db,'students'),{
                                
                            })
                        })
                        console.log("Document written with ID: ", docRef.id);
                    })
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        })
    }

    return (
        <div>
            <input
                type='file'
                name='file'
                accept='.csv'
                onChange={handleFile}
                style={{ display: "block", margin: "10px auto" }}>
            </input>
        </div>
    )
}

export default App