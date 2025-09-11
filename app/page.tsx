import CompanionCards from '@/components/CompanionCards'
import CompanionsList from '@/components/CompanionsList'
import CTA from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl'>Popular Companions</h1>
      <section className='home-section'>
        <CompanionCards
          id = "123"
          title = "Neura the Brainy Explorer"
          topic = "Topic: Neural Network of the Brain"
          subject = "science"
          duration = {45}
          color = "#E5D0FF"
        />
        <CompanionCards
          id = "456"
          title = "Verba the Vocabulary Builder"
          topic = "Topic: English Literature "
          subject = "Language"
          duration = {30}
          color = "#ffda6e"
        />
        <CompanionCards
          id = "789"
          title = "Countsy the Number Wizard"
          topic = "Topic: Derivatives & Integrals"
          subject = "Maths"
          duration = {30}
          color = "#bde7ff"
        />
      </section>
      <section className="home-section">
        <CompanionsList
          title = "Recent Completed Sessions"
          companions = {recentSessions}
          classNames ="w-2/3 max-lg:w-full"
        />
        <CTA/>
      </section>
    </main>
  )
}

export default Page