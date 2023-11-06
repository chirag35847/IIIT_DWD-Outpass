import { Divider, Text } from '@mantine/core'
import { IconCircleCheckFilled, IconCircleDotted } from '@tabler/icons-react'
import React, { useState } from 'react'
import app from "../firebase";

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
    const x=""
    x.toUpperCase
    return (
        <div className='flex w-[80%] h-auto p-8 justify-between'>
            <div className='flex items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <IconCircleCheckFilled />
                    <Text>Requested</Text>
                </div>  
                <Divider color='black' my="sm" labelPosition='center' label='generated' className='m-0 w-[10vw] ' />
                {
                    activeOutpass.status == 'facultu_approved' ?
                        <div className='flex flex-col justify-center items-center'>
                            <IconCircleCheckFilled />
                            <Text>FA Approved</Text>
                        </div> :
                        <div className='flex flex-col justify-center items-center'>
                            <IconCircleDotted />
                            <Text>FA Pending</Text>
                        </div>
                }
                <Divider color='black' my="sm" labelPosition='center' label={activeOutpass.fa == 'done' ? (activeOutpass.outPassType != 'lessThan10' ? "Sent to SWC" : "Sent to Warden") : 'Waiting for FA'} className='m-0 w-[10vw]' />
                {
                    activeOutpass.outpass_size == false ?
                        <></> :

                        activeOutpass.status == 'swc_approved' ?
                            <div className='flex'>
                                <div className='flex flex-col justify-center items-center'>
                                    <IconCircleCheckFilled />
                                    <Text>SWC Approved</Text>
                                </div>
                                <Divider color='black' my="sm" labelPosition='center' label='Sent to Warden' className='m-0 w-[10vw]' />
                            </div> :
                            <div className='flex'>
                                <div className='flex flex-col justify-center items-center'>
                                    <IconCircleDotted />
                                    <Text>SWC Pending</Text>
                                </div>
                                <Divider color='black' my="sm" labelPosition='center' label='Waiting for SWC' className='m-0 w-[10vw]' />
                            </div>

                }
                {
                    activeOutpass.status == 'approved' && (activeOutpass.outpass_size==false || activeOutpass.status=='approved') ?
                    <div className='flex flex-col justify-center items-center'>
                        <IconCircleCheckFilled />
                        <Text>Warden Approved</Text>
                    </div> :
                    <div className='flex flex-col justify-center items-center'>
                        <IconCircleDotted />
                        <Text>Warden waiting</Text>
                    </div>
                }
            </div>
            <div className='flex flex-col'>
                <Text>{activeOutpass.outpass_size==false?'Less Than 10 Days':'More Than 10 Days'}</Text>
                <Text>{`Checkout Date : ${activeOutpass.date_of_leaving}`}</Text>
                <Text>{`CheckIn Date : ${activeOutpass.date_of_returning}`}</Text>
                <Text>{activeOutpass.reason}</Text>
            </div>
        </div>
    )
}

export default CurrentOutpass