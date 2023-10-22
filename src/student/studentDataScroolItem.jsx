import { Space, Text } from '@mantine/core'
import React from 'react'

const StudentListItem = ({values}) => {
    return (
        <>
            <div className='ml-[1vw] flex flex-col w-auto h-full justify-normal'>
                {
                    values.map((x,i)=>{
                        if(x.value==undefined){
                            return <></>
                        }
                        return (
                            <div key={Math.random()+i} className='rounded-xl p-2 bg-[#fff]/[.50] flex justify-between mb-3'>
                                <div className='w-[40%]'>
                                    <Text size={15}>{x.label}</Text>
                                </div>
                                <div className='w-[20%]'>
                                    <Text size={15}>:</Text>
                                </div>
                                <div className='w-[40%]'>
                                    <Text size={15}>{x.value}</Text>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default StudentListItem