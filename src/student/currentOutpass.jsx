import { Divider, ScrollArea, Text } from '@mantine/core'
import { IconCircleCheckFilled, IconCircleDotted, IconCircleX } from '@tabler/icons-react'
import React, { useState } from 'react'
import app from "../firebase";
import { format } from 'date-fns'

const CurrentOutpass = ({ activeOutpass }) => {
    // const db = getFirestore(app);
    // const [data, setData] = useState({});
    // const [outpassID, setOutpassID] = useState("");

    // async function getStudentAndOutpassDetails(){
    //     const studentRef = doc(db, "student", email);
    //     const docSnapshot = await getDoc(userRef, 'student', email);
    //     const data = docSnapshot.data();
    //     setOutpassID(data.current_outpass);
    // }




    console.log(activeOutpass)
    const x = ""
    x.toUpperCase
    return (
        <div className='flex justify-between overflow-auto'>
            <div className='w-[100%]'>
                <div className='flex justify-around'>
                    <p className='text-[.9rem]'>Outpass Status : </p>
                    <p className='text-[.9rem]'>{activeOutpass.status}</p>
                </div>
                <div className='flex justify-around'>
                    <p className='text-[.9rem]'>Date of Leaving : </p>
                    <p className='text-[.9rem]'>{format(new Date(activeOutpass.date_of_leaving), 'do LLL, yyyy')}</p>
                </div>
                <div className='flex justify-around'>
                    <p className='text-[.9rem]'>Date of Returning : </p>
                    <p className='text-[.9rem]'>{format(new Date(activeOutpass.date_of_returning), 'do LLL, yyyy')}</p>
                </div>
                <div className='flex justify-around'>
                    <p className='text-[.9rem]'>Outpass Size : </p>
                    <p className='text-[.9rem]'>{activeOutpass.outpass_size?"More Than 10 Days":"Less Than 10 Days"}</p>
                </div>
                <div className='flex justify-around'>
                    <p className='text-[.9rem]'>Reason For Going : </p>
                    <p className='text-[.9rem]'>{activeOutpass.reason}</p>
                </div>
            </div>
        </div>
    )
}

export default CurrentOutpass