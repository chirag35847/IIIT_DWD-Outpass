import { Text ,Space} from '@mantine/core';
import React from 'react'


const OutpassHistoryListItem = ({itemData,key}) => {
    console.log(itemData)
  return (
    <div style={{backgroundColor:'#189ad3',opacity:0.5}} className={`flex rounded-xl w-[100%] h-[6vh] p-2 mb-3`} key={key}>
        <div className='w-[100%] flex justify-between'>
            <Text>{itemData?.data?.status.toUpperCase()}</Text>
            <div>
                {
                    <div className='ml-4 flex'>
                        <Text>{`Checkout Date : ${itemData.data.date_of_leaving}`}</Text>
                        <Space w={10}/>
                        <Text>{`Checkin  In   : ${itemData.data.date_of_returning}`}</Text>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default OutpassHistoryListItem