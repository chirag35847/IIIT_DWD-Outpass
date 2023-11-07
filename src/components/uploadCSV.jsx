import React from 'react'
import Papa from 'papaparse'
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import app from "../firebase"
import { Text } from '@mantine/core'

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
                    data.map(async x => {
                        // check if the current faculty exists,
                        const facultyDocRef = doc(db, 'faculty', `${x.faculty}`)
                        const docSnap = await getDoc(facultyDocRef);

                        if (docSnap.exists()) {
                            const updatedFaculty = await updateDoc(facultyDocRef, {
                                role: x.role,
                                mentees: x.mentees
                            })
                        }
                        else {
                            const docData = {
                                email: x.faculty,
                                mentees: x.mentees,
                                role: x.role
                            }

                            const createdDoc = await setDoc(facultyDocRef, docData)
                        }

                        x.mentees.map(async y => {
                            // console.log(y)
                            const studentDocRef = doc(db, 'student', y);
                            const studentDocSnap = await getDoc(studentDocRef);
                            if (studentDocSnap.exists()) {
                                const updatedStudent = await updateDoc(studentDocRef, {
                                    fa: x.faculty,
                                })
                            }
                            else {
                                const docData = {
                                    fa: x.faculty
                                }

                                const createdDoc = await setDoc(studentDocRef, docData)
                            }
                        })
                    })
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        })
    }

    return (
        <div className='w-[100vw] flex flex-col items-center'>
            <div className='w-[95vw] h-[8vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[3vh] rounded-xl flex justify-center items-center'>
                <h2 className='text-[1.8rem] text-[#fff] font-medium'>{`Welcome, Admin`}</h2>
            </div>
            <div className='w-[95vw] flex flex-col justify-around h-[24vh] bg-[#000000]/[.40] mr-[2vw] ml-[2vw] mt-[2vh] rounded-xl p-4'>
                <div className='flex h-[3.5vh] justify-between'>
                    <Text className='ml-3 text-black' size={20}>{`Please Select a CSV and we will convert it to records`}</Text>
                </div>
                <div className='flex'>
                    <input
                        type='file'
                        name='file'
                        accept='.csv'
                        onChange={handleFile}
                        style={{ display: "block", margin: "10px auto" }}>
                    </input>
                </div>
            </div>
        </div>
    )
}

export default App