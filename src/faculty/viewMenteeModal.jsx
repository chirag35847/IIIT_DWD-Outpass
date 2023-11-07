import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { Avatar, Button, Modal, ScrollArea, TextInput, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react'
import app from '../firebase'

const db = getFirestore(app);
const ViewMenteeModal = ({ data, facultyData }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [student, setStudent] = useState();
    const gotData = data
    console.log(gotData)
    

    const fetchStudent = useCallback(async() => {
        if (opened) {
            const studentDoc=await getDoc(doc(db,'student',`${gotData.regNo}@iiitdwd.ac.in`));
            const docData = studentDoc.data();
            console.log(docData)
            const data = {
                name: docData?.name,
                gender: docData?.gender,
                dob: docData?.dob,         // In this case the API should return in format DD/MM/YYYY
                phone: docData?.phone,
                email: docData?.email,
                fathersName: docData?.fathersName,
                mothersName: docData?.mothersName,
                fathersEmail: docData?.fathersEmail,
                fathersPhone: docData?.fathersPhone,
                mothersEmail: docData?.fathersEmail,
                mothersPhone: docData?.mothersPhone,
                profileImage: docData?.profile_photo_URL,
                residentialAddress: docData?.residentialAddress,
                bloodGroup: docData?.bloodGroup,
                facultyAdvisorEmail: facultyData?.email,   // does not require ti be entered by student
                facultyAdvisorName: facultyData?.name,    // does not require ti be entered by student
                branch: docData.email[3]=='d'?'DSAI':docData.email[3]=='e'?"ECE":"CSE",   // can get from email
                regNo: gotData.regNo   // can get from email
            }
            setStudent(data)
        }
    }, [opened])

    useEffect(() => {
        fetchStudent()
    }, [opened])

    return (
        <>
            <Modal opened={opened} onClose={close} title="View Mentee">
                <ScrollArea h={'70vh'}>
                    <div className='flex flex-col'>
                        {
                            student?.profileImage && 
                            <div className='w-[100%] flex justify-center'>
                                <Avatar size={150} radius={'100%'} src={student?.profileImage} alt="it's me" />
                            </div>
                        }
                        <label className='text-[0.9rem] mt-2'>Student Name</label>
                        <TextInput value={student?.name} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student branch</label>
                        <TextInput value={student?.branch} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Blood Group</label>
                        <TextInput value={student?.bloodGroup} readOnly />
                        <label className='text-[0.9rem] mt-2'>Gender</label>
                        <TextInput value={student?.gender} readOnly />
                        <label className='text-[0.9rem] mt-2'>Date Of Birth</label>
                        <TextInput value={student?.dob} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Phone</label>
                        <TextInput value={student?.phone} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Email</label>
                        <TextInput value={student?.email} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student's Father's Name</label>
                        <TextInput value={student?.fathersName} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Father's Email</label>
                        <TextInput value={student?.fathersEmail} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Father's Phone</label>
                        <TextInput value={student?.fathersPhone} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Mother's Name</label>
                        <TextInput value={student?.mothersName} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Mother's Email</label>
                        <TextInput value={student?.mothersEmail} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Mother's Phone</label>
                        <TextInput value={student?.mothersPhone} readOnly />
                        <label className='text-[0.9rem] mt-2'>Student Residential Address</label>
                        <Textarea value={student?.residentialAddress} readOnly />

                    </div>
                </ScrollArea>
            </Modal>
            <Button onClick={open}>View</Button>
        </>
    )
}

export default ViewMenteeModal