import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
interface CompanionCardsProps {
    id : string
    title : string
    topic : string
    subject : string
    duration : number
    color : string
}
const CompanionCards = ({id , title , topic , subject , duration, color} : CompanionCardsProps) => {
  return (
    <article className='companion-card' style={{backgroundColor:color}}>
        <div className='flex items-center justify-between'>
            <div className="subject-badge">{subject}</div>
            <button className="companion-bookmark">
                <Image src={"/icons/bookmark.svg"} 
                alt='bookmark'
                width={12.5}
                height={15}
                />
            </button>
        </div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p className='text-sm'>{topic}</p>
        <div className='flex items-center gap-2'>
            <Image 
            src={"/icons/clock.svg"}
            alt='clock'
            width={13.5}
            height={13.5}
            />
            <p className='text-sm'>{duration} mins duration</p>
        </div>
        <Link href = {`/companions/${id}`} className='w-full'>
            <button className='btn-primary w-full justify-center'>
                Launch Lesson
            </button>
        </Link>
    </article>
  )
}

export default CompanionCards