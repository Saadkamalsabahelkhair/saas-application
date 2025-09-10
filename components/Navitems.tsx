'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Links = {
    label : string,
    href : string
}

const Navitems = () => {
    const links = [
        {label: 'Home' , href : "/"},
        {label: 'Companions' , href : "/companions"},
        {label: 'My journey' , href: "/my-journey"}
    ]
    const path = usePathname()
    const isActive = "text-primary font-semibold"
  return (
    <nav className='flex items-center gap-4'>
        {links.map((link : Links) => (
            <Link 
            key={link.label}
            href={link.href}
            className={cn(path === link.href && isActive)}
            >
                {link.label}
            </Link>
        ))}
    </nav>
  )
}

export default Navitems