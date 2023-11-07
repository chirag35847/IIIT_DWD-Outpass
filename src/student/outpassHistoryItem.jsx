import { Text, Space } from '@mantine/core';
import React from 'react'
import OpenCurrentOutpass from './OpenCurrentOutpass';

const OutpassHistoryListItem = ({ itemData, key }) => {
    console.log(itemData)

    const isRejected = itemData.data.status.search('rejected') != -1;
    return (
        <>
            <div style={{ backgroundColor: isRejected ? '#FF7F7F' : '#90EE90' }} className={`flex rounded-xl w-[100%] h-[6vh] p-2 mb-3`} key={key}>
                <div className='w-[100%] flex justify-between items-center'>
                    <Text h={'100%'}>{itemData?.data?.status.toUpperCase()}</Text>
                    <div className='ml-4 flex items-center'>
                        <Text>{`Checkout Date : ${itemData?.data?.date_of_leaving}`}</Text>
                        <Space w={10} />
                        <Text>{`Checkin  In   : ${itemData?.data?.date_of_returning}`}</Text>
                        <OpenCurrentOutpass data={itemData} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default OutpassHistoryListItem