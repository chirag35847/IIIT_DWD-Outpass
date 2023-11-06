import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react'
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { z } from 'zod';
import Select from 'react-select'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, FileInput, Modal, ScrollArea, Text, TextInput } from '@mantine/core';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import PendingRequestModal from './pendingRequestModal';
import RejectedRequestsModal from './rejectedRequestModal';
import GrantedRequestsModal from './GrantedRequestModal';
import ViewMenteeModal from './viewMenteeModal';
import EditInformationModal from './EditInformationModal';
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import filterOutpass from './filter_outpass'
import app from '../firebase'

const storage = getStorage(app);
const db = getFirestore(app);

const FacultMain = () => {
    const [facultyData, setFacultyData] = useState();
    const [selectedPhoto, setSelectedPhoto] = useState();
    const [grantedRequests, setGrantedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [mentees, setMentees] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);
    const facultyOptions = [
        { value: "SWC", label: "SWC" },
        { value: "Warden", label: "Warden" }
    ]

    const currentFaculty = {
        email: "chirag@iiitdwd.ac.in",
        role: "Faculty"
    }

    const schema = z.object({
        name: z.string().refine(val => val.length > 0, { message: "Name Cannot Be Empty" }),
    })
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    const fetchTeacherData = async () => {
        const docRef = doc(db, "faculty", currentFaculty.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let teacher = docSnap.data()
            return teacher
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    const fetchFacultyData = useCallback((teacherData) => {
        const data = {
            role: teacherData.role,
            email: teacherData.email,
            name: teacherData.name,
            profilePhoto: teacherData.profilepic,
        }

        setFacultyData(data);

        if (data.name == undefined) {
            open();
            console.log(opened)
        }
    }, [])

    const getOutpassData = async (outpassid) => {
        const docRef = doc(db, "outpass", outpassid);
        const docSnap = await getDoc(docRef);
        let outpassData = docSnap.data();

        let data = {
            from: outpassData.date_of_leaving,
            to: outpassData.date_of_returning,
            regNo: outpassData.email.substring(0, 8),
            reason: outpassData.reason,
            id: outpassid
        };

        return { data, outpassData };
    };

    const fetchOutPassRequests = useCallback(async (teacherData) => {

        let outpassesid = teacherData.outpasses
        const promiseArray = outpassesid.map((outpassid) => getOutpassData(outpassid))
        const listofOutpasses = await Promise.all(promiseArray);

        const { pending, rejected, granted } = filterOutpass(listofOutpasses, currentFaculty.role);

        setGrantedRequests(granted);
        setPendingRequests(pending);
        setRejectedRequests(rejected);
    }, [])

    const getStudentData = async (studentid) => {
        const docRef = doc(db, "student", studentid);
        const docSnap = await getDoc(docRef);
        let studentData = docSnap.data();

        let data = {
            name: studentData.name,
            regNo: studentData.email.substring(0, 8),
        };
        return { data, studentData };
    };

    const fetchMenteeList = useCallback(async (teacherData) => {

        let menteesid = teacherData.mentees
        const promiseArray = menteesid.map((studentid) => getStudentData(studentid))
        const list = await Promise.all(promiseArray);

        const dataList = list.map((obj) => obj.data);

        setMentees(dataList);
    }, [])

    function generateUniqueId() {
        const timestamp = new Date().getTime(); // Get the current timestamp
        const randomValue = Math.floor(Math.random() * 1000); // Generate a random number

        return `${timestamp}_${randomValue}`;
    }

    const handleAddInformation = handleSubmit(async (data) => {
        // use data, selectedRole,selectedPhoto for saving data
        const uniqueId = generateUniqueId();
        const mountainImagesRef = ref(storage, `facultyimages/${uniqueId}.jpg`);
        await uploadBytes(mountainImagesRef, selectedPhoto);

        const url = await getDownloadURL(ref(storage, `facultyimages/${uniqueId}.jpg`))
        const facultyRef = doc(db, "faculty", currentFaculty.email);

        await updateDoc(facultyRef, {
            name: data.name,
            profilepic: url
        });

        const createdData = {
            role: currentFaculty.role,
            email: currentFaculty.email,
            name: data.name,
            profilePhoto: url,
        }

        setFacultyData(createdData)
        close()

        reset();
        setSelectedPhoto();
    })

    useEffect(() => {
        fetchTeacherData().then((data) => {
            fetchFacultyData(data)
            fetchOutPassRequests(data)
            fetchMenteeList(data)
        })
    }, [])

    return (
        <>
            <div className='w-[100vw] flex flex-col items-center'>
                <div className='w-[95vw] h-[8vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[3vh] rounded-xl flex justify-center items-center'>
                    <h2 className='text-[1.8rem] text-[#fff] font-medium'>{`Welcome, ${facultyData?.name}`}</h2>
                </div>
                <div className='flex flex-col w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='flex justify-between'>
                        <h2 className='text-[1rem] text-[#fff] font-medium'>Your Information</h2>
                        <EditInformationModal data={facultyData} />
                    </div>
                    <ScrollArea h={'auto'}>
                        <div className='flex h-auto justify-around'>
                            <Avatar size={150} radius={'100%'} src={facultyData?.profilePhoto} alt="it's me" />
                            <div className='flex flex-col w-[50%]'>
                                {
                                    facultyData?.name &&
                                    <div className='rounded-xl h-[33%] p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                        <div className='w-[20%]'>
                                            <Text size={15}>{'Name'}</Text>
                                        </div>
                                        <div className='w-[20%]'>
                                            <Text size={15}>:</Text>
                                        </div>
                                        <div className='w-[60%]'>
                                            <Text size={15}>{facultyData?.name}</Text>
                                        </div>
                                    </div>
                                }
                                {
                                    facultyData?.role &&
                                    <div className='rounded-xl h-[33%] p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                        <div className='w-[20%]'>
                                            <Text size={15}>{'Role'}</Text>
                                        </div>
                                        <div className='w-[20%]'>
                                            <Text size={15}>:</Text>
                                        </div>
                                        <div className='w-[60%]'>
                                            <Text size={15}>{facultyData?.role}</Text>
                                        </div>
                                    </div>
                                }
                                {
                                    facultyData?.email &&
                                    <div className='rounded-xl h-[33%] p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                        <div className='w-[20%]'>
                                            <Text size={15}>{'Email'}</Text>
                                        </div>
                                        <div className='w-[20%]'>
                                            <Text size={15}>:</Text>
                                        </div>
                                        <div className='w-[60%]'>
                                            <Text size={15}>{facultyData?.email}</Text>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </ScrollArea>
                </div>
                <div className='flex justify-evenly w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='w-[32%] h-[21vh] bg-[#fff]/[.50] rounded-xl'>
                        <div className='h-[20%]'>
                            <Text className='text-[1rem] text-black font-medium p-2 h-[5vh]'>Pending Requests</Text>
                        </div>
                        <div className='flex flex-col justify-between overflow-auto h-[75%]'>
                            {
                                pendingRequests.map((x, i) => {
                                    return (
                                        <div key={i} className='rounded-xl flex justify-between bg-[#2E2EFF]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                            <Text size={15} color='black'>{x.data.regNo}</Text>
                                            <PendingRequestModal outpassData={x} teacherRole={currentFaculty.role} />
                                        </div>
                                    )
                                })
                            }
                            {
                                pendingRequests.length == 0 &&
                                <div className='w-auto h-[100%] flex justify-center items-center'>
                                    <Text>No Requests</Text>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='w-[32%] h-[21vh] bg-[#fff]/[.50] rounded-xl'>
                        <div className='h-[20%]'>
                            <Text className='text-[1rem] text-black font-medium p-2'>Rejected Requests</Text>
                        </div>
                        <div className='flex flex-col justify-between overflow-auto h-[75%]'>
                            {
                                rejectedRequests.map((x, i) => {
                                    return (
                                        <div key={i} className='rounded-xl flex justify-between bg-[#ff0000]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                            <Text size={15} color='black'>{x.data.regNo}</Text>
                                            <RejectedRequestsModal outpassData={x} teacherName={facultyData.name} />
                                        </div>
                                    )
                                })
                            }
                            {
                                rejectedRequests.length == 0 &&
                                <div className='w-auto h-[100%] flex justify-center items-center'>
                                    <Text>No Requests</Text>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='w-[32%] h-[21vh] bg-[#fff]/[.50] rounded-xl'>
                        <div className='h-[20%]'>
                            <Text className='text-[1rem] text-black font-medium p-2'>Granted Requests</Text>
                        </div>
                        <div className='flex flex-col justify-between overflow-auto h-[75%]'>
                            {
                                grantedRequests.map((x, i) => {
                                    return (
                                        <div key={i} className='rounded-xl flex justify-between bg-[#0FFF50]/[.50] w-auto h-[4.5vh] p-1 m-2'>
                                            <Text size={15} color='black'>{x.data.regNo}</Text>
                                            <GrantedRequestsModal outpassData={x} />
                                        </div>
                                    )
                                })
                            }
                            {
                                grantedRequests.length == 0 &&
                                <div className='w-auto h-[100%] flex justify-center items-center'>
                                    <Text>No Requests</Text>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='w-[95vw] h-[32.4vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='h-[12%]'>
                        <h2 className='text-[1rem] text-[#fff] font-medium'>Your Mentees</h2>
                    </div>
                    <div className='flex flex-col justify-between overflow-auto h-[82%]'>
                        {
                            mentees.map((x, i) => {
                                return (
                                    <div key={i} className='rounded-xl flex justify-between bg-[#ADD8E6] w-auto h-[4.5vh] p-1 m-2'>
                                        <div className='flex justify-between'>
                                            <Text size={15} color='black'>{x.name}</Text>
                                            <span style={{ margin: "4px" }}></span>
                                            <Text size={15} color='black'>{x.regNo}</Text>
                                        </div>
                                        <ViewMenteeModal data={x} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* </ScrollArea> */}
                </div>
            </div>
            <Modal opened={opened} onClose={close} title="Add Information" closeOnClickOutside={false} withCloseButton={false}>
                <form id="addinformation" name='addinformation' onSubmit={handleSubmit(handleAddInformation)}>
                    <div className='flex flex-col p-4'>
                        <ScrollArea h={'60vh'}>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Name</label>
                                <TextInput placeholder='Please enter your name' {...register('name')} />
                                {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Role</label>
                                <TextInput type="text" value={currentFaculty.role} readOnly />
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Profile Photo</label>
                                <FileInput accept="image/png,image/jpeg" placeholder='Select A Profile photo for yourself' onChange={setSelectedPhoto} />
                            </div>
                        </ScrollArea>
                        <div className='flex justify-end w-[100%] mt-5'>
                            <button type="button" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" onClick={handleAddInformation}>
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default FacultMain