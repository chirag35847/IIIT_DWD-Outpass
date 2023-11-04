import { Avatar, Button, Modal, ScrollArea, TextInput, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react'

const ViewMenteeModal = ({ data }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [student, setStudent] = useState();

    const fetchStudent = useCallback(() => {
        if (opened) {
            // API to get student information based on data.id
            const data = {
                name: 'Chirag Mittal',
                gender: "Male",
                dob: '01/08/2002',         // In this case the API should return in format DD/MM/YYYY
                phone: "+91-8527288876",
                email: "20bds016@iiitdwd.ac.in",
                fathersName: "RamKumar Mittal",
                mothersName: "Sangeeta Mittal",
                fathersEmail: "ram801132@gmail.com",
                fathersPhone: "+91-8011325410",
                mothersEmail: "sangeeta@gmail.com",
                mothersPhone: "+91-7002341587",
                profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                residentialAddress: "Somewhere On Earth, On Some Street, At Some House",
                bloodGroup: "O+ve",
                facultyAdvisorEmail: "professor@iiitdwd.ac.in",   // does not require ti be entered by student
                facultyAdvisorName: "Dr. Professor Prof",    // does not require ti be entered by student
                branch: "Data Science And AI",   // can get from email
                regNo: "20bds016"   // can get from email
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