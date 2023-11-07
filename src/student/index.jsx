import { Avatar, Button, FileInput, Modal, ScrollArea, Space, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import StudentListItem from './studentDataScroolItem';
import { IconChevronsUpRight, IconPlus } from '@tabler/icons-react';
import CurrentOutpass from './currentOutpass';
import OutpassHistoryListItem from './outpassHistoryItem';
import { doc, getDoc, setDoc, getFirestore, collection, addDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { useLocation, useNavigate } from 'react-router-dom';


import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

import app from "../firebase";
import OpenCurrentOutpass from './OpenCurrentOutpass';

const StudentMain = () => {
    const db = getFirestore(app);
    const storage = getStorage(app);
    // const studentCollection = db.collection('student');
    const [studentData, setStudentData] = useState();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedGender, setSelectedGender] = useState();
    const [profileImageFile, setProfileImageFile] = useState();
    const [selectedBloodGroup, setSelectedBloodGroup] = useState();
    const [activeOutpass, setActiveOutpass] = useState();
    const [outpassHistory, setOutpassHostory] = useState();
    const [openedCreateOutpass, { open:openCreateOutpass, close:closeCreateOutpass }] = useDisclosure(false);
    const location = useLocation();
    const receivedData = location.state;
    const email = receivedData.email;


    const genderOptions = [
        { value: 'Male', label: "Male" },
        { value: 'Female', label: "Female" },
        { value: 'Other', label: "Other" },
    ]

    const bloodGroupOptions = [
        { value: "O+ve", label: "O+ve" },
        { value: "A+ve", label: "A+ve" },
        { value: "B+ve", label: "B+ve" },
        { value: "O-ve", label: "O-ve" },
        { value: "A-ve", label: "A-ve" },
        { value: "B-ve", label: "B-ve" },
        { value: "AB-ve", label: "AB-ve" },
        { value: "AB+ve", label: "AB+ve" },
        { value: "Rare Blood Types", label: "Rare Blood Types" },
    ]

    const schema = z.object({
        name: z.string().refine(val => val.length > 0, { message: "Name Cannot Be Empty" }),
        gender: z.string().refine(val => val.length > 0, { message: "Please select a gender" }),
        dob: z.string().refine(val => val.length > 0, { message: "DOB cannot be empty" }),
        phone: z.string().refine(val => /[0-9+-]{10,15}$/.test(val), { message: "Please enter a valid phone" }),
        email: z.string().refine(val => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val), { message: "Please enter a valid email" }),
        fathersName: z.string().refine(val => val.length > 0, { message: "FathersName cannot be empty" }),
        mothersName: z.string().refine(val => val.length > 0, { message: "MothersName cannot be empty" }),
        fathersEmail: z.string().refine(val => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val), { message: "Please enter a valid email" }),
        fathersPhone: z.string().refine(val => /[0-9+-]{10,15}$/.test(val), { message: "Please enter a valid phone number" }),
        mothersEmail: z.string().refine(val => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val), { message: "Please enter a valid email" }),
        mothersPhone: z.string().refine(val => /[0-9+-]{10,15}$/.test(val), { message: "Please enter a valid phone number" }),
        residentialAddress: z.string().refine(val => val.length > 0, { message: "residentialAddress cannot be empty" }),
        bloodGroup: z.string().refine(val => val.length > 0, { message: "bloodGroup cannot be empty" }),
    });

    const schemaNew = z.object({
        reason:z.string().refine(val => val.length > 0, { message: "Reason Cannot Be Empty" }),
        checkInDate:z.string().refine(val => val.length > 0, { message: "Check In Date Cannot Be Empty" }),
        checkout:z.string().refine(val => val.length > 0, { message: "Check Out Date Cannot Be Empty" }),
    })

    const {register:registerNew,setValue:setValueNew,handleSubmit:handleSubmitNew,reset:resetNew,formState:{errors:errorsNew}} = useForm({resolver:zodResolver(schemaNew)});
    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

    
    

    const getStudentInformation = useCallback(async () => {
        console.log('calling')
        // API to return the student information
        const studentRef = doc(db, "student", email);
        const docSnapshot = await getDoc(studentRef);
        const data = docSnapshot.data();
        console.log(data)
        // data['branch'] = data?.email[3]=='d'?'DSAI':data?.email[3]=='e'?"ECE":"CSE"
        // data['regNo'] = data?.email.substring(0,8)
        console.log(data)
        setStudentData(data);

        const history = data.outpass_history!=undefined? await Promise.all(data.outpass_history.map(async(x)=>{
            const docRef = doc(db,'outpass',x)
            const docSnap = await getDoc(docRef)
            const data = docSnap.data();
            return {
                current:data.current_outpass==x,
                data:data
            }
        })).then(x=>{
            return x
        }):[];

        setOutpassHostory(history);
        console.log(data)
        if (data == undefined || data?.name == undefined) {
            open()
        }
    }, [selectedGender, profileImageFile])

    //updatedetails function
    async function updateStudentDataByEmail(email, updatedData) {
        try {
            await setDoc(doc(db, "student", `${email}`), updatedData);
        } catch (error) {
            console.error(`Error querying Firestore: ${error}`);
        }
    }

    const handleSubmitData = useCallback (async (data) => {
        // console.log('--------');
        const newdata = {
            bloodGroup: data.bloodGroup,
            dob: data.dob,
            email: data.email,
            fathersEmail: data.fathersEmail,
            fathersName: data.fathersName,
            fathersPhone: data.fathersPhone,
            gender: data.gender,
            mothersEmail: data.mothersEmail,
            mothersName: data.mothersName,
            mothersPhone: data.mothersPhone,
            name: data.name,
            phone: data.phone,
            residentialAddress: data.residentialAddress,
        }
        
        // console.log(profileImageFile);  
        //image upload handle
        const storageRef = ref(storage, `/profilePhotos/${newdata.email}`); 
        const uploadTask = uploadBytesResumable(storageRef, profileImageFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(progress);
    
                //can be used in frontend for loading
                // update progress
                // setProgresspercent(progress);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    
                    newdata["profile_photo_URL"] = url;
                    updateStudentDataByEmail(newdata.email, newdata);

                });
            }
        );

        const studentRef = doc(db,'student',email);
        await updateDoc(studentRef,newdata)
        

        setValue('gender', "");
        setValue('bloodGroup', "");
        reset();
        close();
        getStudentInformation()
    }, [profileImageFile]);


    
    function getDaysBetweenDates(date1, date2) {
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
      
        // Calculate the time difference in milliseconds
        const timeDifference = secondDate - firstDate;
      
        // Convert milliseconds to days
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
      
        return daysDifference;
    }

    async function updateOutpassFields(email, currentOutpass) {
        const userRef = doc(db, "student", email);
      
        // Check if the document exists
        // get outPassdata
        // data comes in docSnapshot.data()
        const docSnapshot = await getDoc(userRef);
        // console.log(docSnapshot);
        if (docSnapshot.data().outpass_history===undefined) {
          // If the document doesn't exist, create it with initial values
          await updateDoc(userRef,{
            current_outpass: currentOutpass,
            outpass_history: [currentOutpass]
          });
        } else {
          // If the document exists, update the fields
          const existingData = docSnapshot.data();
        //   console.log(existingData);
          const outpassHistory = existingData.outpass_history;
          
          // Add the current outpass to the history
          outpassHistory.push(currentOutpass);
          
          // Update the fields
          await updateDoc(userRef,{
            current_outpass: currentOutpass,
            outpass_history: outpassHistory
          });
        }
        closeCreateOutpass();
        getOutpassDetails(email);
        
      }


    const handleNewOutpass = useCallback(async (data)=>{
        // Add a new document with a generated id.
        const days = getDaysBetweenDates(data.checkout,data.checkInDate);
        console.log(days)

        const newData ={
            date_of_leaving: data.checkout,
            date_of_returning: data.checkInDate,
            email : studentData.email? studentData.email: null,
            fatherName: studentData.fathersName?studentData.fathersName:null,
            fatherPhoneNo: studentData.fathersPhone?studentData.fathersPhone:null,
            motherName: studentData.mothersName?studentData.mothersName:null,
            motherPhoneNo: studentData.mothersPhone?studentData.mothersPhone:null,
            name: studentData.name?studentData.name:null,
            outpass_size: null,
            reason: data.reason,
            remarks: [],
            residentialAddress: studentData.residentialAddress?studentData.residentialAddress:null,
            studentPhoneNo: studentData.phone?studentData.phone:null,
        }
        if(days<=10){
            newData["outpass_size"] = false;
        } else {
            newData["outpass_size"] = true;
        }
        newData["status"] = 'pending';
        console.log(newData)


        const docRef = await addDoc(collection(db, "outpass"), newData);
        // console.log("Document written with ID: ", docRef.id);

        updateOutpassFields(studentData.email, docRef.id);
        closeCreateOutpass()

        // console.log(data)
        // console.log(newData);

        
        // 
    },[studentData])

    async function getOutpassDetails(data){
        // console.log(data);
        const studentRef = doc(db, "student", data);
        const docSnapshot = await getDoc(studentRef);
        // console.log(docSnapshot)
        const studentdata = docSnapshot.data();
        // console.log(studentData);

        const outpassRef = doc(db, "outpass", studentdata.current_outpass);
        const outpassDoc = await getDoc(outpassRef);
        const currentOutPassData = outpassDoc.data();
        // console.log(currentOutPassData);
        // console.log('-------');
        // console.log(currentOutPassData);
        setActiveOutpass(currentOutPassData);

    }

    useEffect(() => {
        setValue('gender', ""); 
        setValue('bloodGroup', "");
        getStudentInformation();
        getOutpassDetails(email);
        
    }, [])

    // console.log(openedCreateOutpass)

    

    return (
        <>
            <div className='w-[100vw] flex flex-col items-center'>
                <div className='w-[95vw] h-[8vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[3vh] rounded-xl flex justify-center items-center'>
                    <h2 className='text-[1.8rem] text-[#fff] font-medium'>{`Welcome, ${studentData?.name}`}</h2>
                </div>
                <div className='w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2vw] ml-[2vw] mt-[2vh] rounded-xl p-4'>
                    <div className='flex h-[3.5vh] justify-between'>
                        <h2 className='text-[1rem] text-[#fff] font-medium'>Your Information</h2>
                        <Text className='ml-3 text-black' size={20}>{`${studentData?.residentialAddress != undefined ? 'Address : ' + studentData.residentialAddress : ""}`}</Text>
                    </div>
                    <div className='h-[17vh] flex flex-col overflow-auto'>
                        <div className='flex'>
                            <Avatar size={150} radius={'100%'} src={studentData?.profile_photo_URL} alt="it's me" />
                            <ScrollArea w={'auto'}>
                                <div className='flex p-3'>
                                    <div className='w-[25vw]'>
                                        <StudentListItem values={[
                                            { label: "Name", value: studentData?.name },
                                            { label: "Gender", value: studentData?.gender },
                                            { label: "FA Name", value: studentData?.facultyAdvisorName },
                                        ]} />
                                    </div>
                                    <div className='w-[25vw]'>
                                        <StudentListItem values={[
                                            { label: "Your Branch", value: studentData?.branch },
                                            { label: "Reg No.", value: studentData?.regNo },
                                            { label: "Facult Advisor", value: studentData?.facultyAdvisorEmail },
                                        ]} />
                                    </div>
                                    <div className='w-[25vw]'>
                                        <StudentListItem values={[
                                            { label: "Phone", value: studentData?.phone },
                                            { label: "Email", value: studentData?.email },
                                            { label: "Father's Name", value: studentData?.fathersName },
                                        ]} />
                                    </div>
                                    <div className='w-[25vw]'>
                                        <StudentListItem values={[
                                            { label: "Mother's Name", value: studentData?.mothersName },
                                            { label: "Father's Email", value: studentData?.fathersEmail },
                                            { label: "Father's Phone", value: studentData?.fathersPhone },
                                        ]} />
                                    </div>
                                    <div className='w-[25vw]'>
                                        <StudentListItem values={[
                                            { label: "Mother's Email", value: studentData?.mothersEmail },
                                            { label: "Mother's Phone", value: studentData?.mothersPhone },
                                        ]} />
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
                <div className='w-[95vw] h-[24vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <div className='flex justify-between h-[23%]'>
                        <h2 className='text-[1rem] text-[#fff] font-medium'>Active Outpass</h2>
                        {
                            activeOutpass == undefined || activeOutpass.status.split('_')[1]=='rejected'?
                                <Button rightSection={<IconPlus size={14} />} onClick={(e)=>openCreateOutpass()}>New Outpass</Button> :
                                <OpenCurrentOutpass data={activeOutpass} />
                        }
                    </div>
                    <div className='h-[75%]'>
                        {
                            activeOutpass == undefined ?
                                <Text size={20} className='text-black'>You Don't have an active outpass</Text> :
                                <CurrentOutpass activeOutpass={activeOutpass} />
                        }
                    </div>
                </div>
                <div className='w-[95vw] h-[32.4vh] bg-[#000000]/[.40] mr-[2.5vw] ml-[2.5vw] mt-[2.2vh] rounded-xl p-4'>
                    <h2 className='text-[1rem] text-[#fff] font-medium'>Outpass History</h2>
                    <ScrollArea h={'27vh'}>
                        {outpassHistory != undefined &&
                            outpassHistory.map((x, i) => {
                                return <OutpassHistoryListItem itemData={x} key={i} />
                            })
                        }
                    </ScrollArea>
                </div>
            </div>
            <Modal size={'xl'} className='rouneded-xl' opened={openedCreateOutpass} onClose={closeCreateOutpass} title="Add Information">
                <form id="newOutpass" name='newOutpass' onSubmit={handleSubmitNew((data) => handleNewOutpass(data))}>
                    <div className='flex flex-col p-4'>
                        <ScrollArea h={'60vh'}>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Reason For Going</label>
                                <TextInput placeholder='Reason for going out' {...registerNew('reason')} />
                                {errorsNew?.reason?.message && <small className='inline-block text-[#ff0000]'>{errorsNew.reason.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Check Out Date</label>
                                <input type='date' className='border h-9 border-[#AEAEAE] p-2 rounded' placeholder='Enter Your Checkout Date' {...registerNew('checkout')} />
                                {errorsNew?.checkout?.message && <small className='inline-block text-[#ff0000]'>{errorsNew.checkout.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Check In Date</label>
                                <input type='date' className='border h-9 border-[#AEAEAE] p-2 rounded' placeholder='Enter Your Checkin Date' {...registerNew('checkInDate')} />
                                {errorsNew?.checkInDate?.message && <small className='inline-block text-[#ff0000]'>{errorsNew.checkInDate.message}</small>}
                            </div>
                        </ScrollArea>
                        <div className='flex justify-end w-[100%] mt-5'>
                            <input type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" value={"Create Outpass"} />
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal size={'xl'} className='rouneded-xl' opened={opened} onClose={close} title="Add Information" closeOnClickOutside={false} withCloseButton={false}>
                <form id="addStudentDetailsForm" name='addStudentDetailsForm' onSubmit={handleSubmit((data) => handleSubmitData(data))}>
                    <div className='flex flex-col p-4'>
                        <ScrollArea h={'60vh'}>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Name</label>
                                <TextInput placeholder='Enter Your Name' {...register('name')} />
                                {errors?.name?.message && <small className='inline-block text-[#ff0000]'>{errors.name.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Gender</label>
                                <Select placeholder='Please Select Your Gender' options={genderOptions} value={selectedGender} onChange={(e) => { setValue('gender', e.value), setSelectedGender(e) }} />
                                {errors?.gender?.message && <small className='inline-block text-[#ff0000]'>{errors.gender.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Blood Group</label>
                                <Select placeholder='Select Your Blood Group' options={bloodGroupOptions} value={selectedBloodGroup} onChange={(e) => { setSelectedBloodGroup(e), setValue('bloodGroup', e.value) }} />
                                {errors?.bloodGroup?.message && <small className='inline-block text-[#ff0000]'>{errors.bloodGroup.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Date Of Birth</label>
                                <input type='date' className='border h-9 border-[#AEAEAE] p-2 rounded' placeholder='Enter Your DOB' {...register('dob')} />
                                {errors?.dob?.message && <small className='inline-block text-[#ff0000]'>{errors.dob.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Phone Number</label>
                                <TextInput placeholder='Enter your phone number' {...register('phone')} />
                                {errors?.phone?.message && <small className='inline-block text-[#ff0000]'>{errors.phone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Email</label>
                                <TextInput placeholder='Enter Your Email' {...register('email')} />
                                {errors?.email?.message && <small className='inline-block text-[#ff0000]'>{errors.email.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Name</label>
                                <TextInput placeholder='Enter Your Fathers Name' {...register('fathersName')} />
                                {errors?.fathersName?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersName.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Name</label>
                                <TextInput placeholder='Enter Your Mothers Name' {...register('mothersName')} />
                                {errors?.mothersName?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersName.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Email</label>
                                <TextInput placeholder='Enter Your Fathers Email' {...register('fathersEmail')} />
                                {errors?.fathersEmail?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersEmail.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Father's Phone</label>
                                <TextInput placeholder='Enter Your Fathers Phone' {...register('fathersPhone')} />
                                {errors?.fathersPhone?.message && <small className='inline-block text-[#ff0000]'>{errors.fathersPhone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Email</label>
                                <TextInput placeholder='Enter Your Mothers Email' {...register('mothersEmail')} />
                                {errors?.mothersEmail?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersEmail.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Mother's Phone</label>
                                <TextInput placeholder='Enter Your Mothers Phone' {...register('mothersPhone')} />
                                {errors?.mothersPhone?.message && <small className='inline-block text-[#ff0000]'>{errors.mothersPhone.message}</small>}
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Profile Photo</label>
                                <FileInput accept="image/png,image/jpeg" placeholder='Select A Profile photo for yourself' onChange={setProfileImageFile} />
                            </div>
                            <div className='flex flex-col mb-3'>
                                <label className='text-[0.9rem]'>Residential Addresses</label>
                                <TextInput placeholder='Enter Your Residential Addresses' {...register('residentialAddress')} />
                                {errors?.residentialAddress?.message && <small className='inline-block text-[#ff0000]'>{errors.residentialAddress.message}</small>}
                            </div>
                        </ScrollArea>
                        <div className='flex justify-end w-[100%] mt-5'>
                            <input type="submit" className="bg-[#5C5CFF] w-full inline-block text-center p-2 text-[#fff] border border-solid border-[#43B28A] rounded-xl" value={"Add Profile"} />
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default StudentMain