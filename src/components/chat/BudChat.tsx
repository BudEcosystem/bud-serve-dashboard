import { Input, Image } from 'antd'
import React from 'react'
import IslandIcon from '../island/IslandIcon'

function BudChat() {
    return (
        <div className='relative flex flex-col w-full h-full bud-chat'>

            <div className='flex flex-col w-full h-full bg-[#101010] justify-center items-center'>
                <div className='bud-icon' />
            </div>

            <div>
                <Input
                    className='height-52'
                    prefix={<IslandIcon size='1.1875rem' />}
                    defaultValue=""
                    placeholder='Ask Bud'
                    suffix={<Image preview={false} style={{width: 'auto', height: 'auto'}} src='/sendicon.svg' alt='' />}
                />
            </div>

        </div>
    )
}

export default BudChat