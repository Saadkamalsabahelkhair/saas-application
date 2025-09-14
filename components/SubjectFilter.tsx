'use client'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from '@/constants'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
const SubjectFilter = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const router = useRouter()
    const query = searchParams.get('subject') || '';
    const [subjectQuery , setSubjectQuery] = useState('')
    useEffect(() => {
        if(subjectQuery === 'all') {
            const newUrl = removeKeysFromUrlQuery({
                    params : searchParams.toString(),
                    keysToRemove : ["subject"]
                })
                router.push(newUrl , {scroll : false})
        }else {
            const newUrl = formUrlQuery({
                params : searchParams.toString(),
                key : 'subject',
                value : subjectQuery
            })
            router.push(newUrl , {scroll : false})
        }
    } , [pathname , router , searchParams , subjectQuery])
  return (
    <Select
        value={subjectQuery}
        onValueChange={setSubjectQuery}
    >
        <SelectTrigger className="w-[180px] border border-black">
            <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem className=' capitalize' value='all'>All</SelectItem>
            {subjects.map((subject) => (
                <SelectItem key={subject} value={`${subject}`} className=' capitalize'>{subject}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}

export default SubjectFilter