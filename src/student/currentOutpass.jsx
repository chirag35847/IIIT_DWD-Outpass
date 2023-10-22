import { Divider, Text } from '@mantine/core'
import { IconCircleCheckFilled, IconCircleDotted } from '@tabler/icons-react'
import React from 'react'

const CurrentOutpass = ({ activeOutpass }) => {
    // console.log(activeOutpass)
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
                    activeOutpass.fa == 'done' ?
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
                    activeOutpass.outPassType == 'lessThan10' ?
                        <></> :

                        activeOutpass.swc == 'done' && activeOutpass.fa=='done' ?
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
                    activeOutpass.warden == 'done' && activeOutpass.fa=='done' && (activeOutpass.outPassType=='lessThan10' || activeOutpass.swc=='done') ?
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
                <Text>{activeOutpass.outPassType=='lessThan10'?'Less Than 10 Days':'More Than 10 Days'}</Text>
                <Text>{`Checkout Date : ${activeOutpass.checkoutDate}`}</Text>
                <Text>{`CheckIn Date : ${activeOutpass.checkinDate}`}</Text>
                <Text>{activeOutpass.reason}</Text>
            </div>
        </div>
    )
}

export default CurrentOutpass