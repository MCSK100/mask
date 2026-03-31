import { useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ParticlesBG from "../components/ParticlesBG"
import SiteFooter from "../components/SiteFooter"

const faqs = [
  {
    question: "Is Shadowchaty free to use?",
    answer: "Yes, Shadowchaty is completely free for random video chat and text chat."
  },
  {
    question: "Do I need to sign up?",
    answer: "No signup is required. You can start chatting instantly."
  },
  {
    question: "Is this similar to Omegle?",
    answer: "Yes, Shadowchaty works as an Omegle alternative with better UI and performance."
  },
  {
    question: "Can I chat with people worldwide?",
    answer: "Yes, you can connect with strangers from different countries."
  }
]

export default function Home(){
  const [openIndex, setOpenIndex] = useState(-1)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return(
  <>
  <ParticlesBG/>
  <div className="relative flex min-h-screen flex-col">

  <Navbar/>

  <Hero/>

  <section className="flex w-full justify-center px-4 pb-10 pt-4 sm:px-8 md:px-10">
  <div className="grid w-full max-w-5xl justify-items-center gap-6 md:grid-cols-3 md:gap-8">

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">

  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">

  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  ⚡ Instant Match
  </h3>

  <p className="text-gray-400">
  Connect instantly with random strangers worldwide.
  </p>

  </div>

  </div>

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">

  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">

  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  🎭 Anonymous
  </h3>

  <p className="text-gray-400">
  No account required. Stay completely anonymous.
  </p>

  </div>

  </div>

  <div className="group relative w-full max-w-sm p-[1px] rounded-2xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-indigo-500/40 hover:scale-105 transition duration-300">

  <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl text-center border border-white/10">

  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition">
  🔒 Secure
  </h3>

  <p className="text-gray-400">
  Peer-to-peer WebRTC connection ensures privacy.
  </p>

  </div>

  </div>

  </div>
  </section>

  {/* What is Shadowchaty Chat? */}
  <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
    <h2 className="text-2xl font-semibold text-white sm:text-3xl mb-6">What is Shadowchaty Chat?</h2>
    <p className="text-lg text-slate-300 leading-relaxed">
      Shadowchaty is a free random video chat platform where you can talk to strangers worldwide.
      It works similar to Omegle but with a modern interface and better experience.
    </p>
  </section>

  {/* Homepage SEO Content */}
  <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-6">
    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Free Random Video Chat with Strangers</h2>
    <p className="text-lg text-slate-300 leading-relaxed">
      Shadowchaty is a free random video chat platform that lets you connect with strangers from around the world instantly. 
      If you are looking for an Omegle alternative, Shadowchaty provides a modern and smooth experience for chatting and video calling.
    </p>
    <p className="text-lg text-slate-300 leading-relaxed">
      You can start chatting without any registration. Just open the website and get connected with a random person. 
      Whether you want to make new friends, have fun conversations, or simply pass time, Shadowchaty makes it easy.
    </p>
    <p className="text-lg text-slate-300 leading-relaxed">
      Our platform supports both text chat and video chat, giving you flexibility to communicate the way you prefer. 
      With a clean interface and fast connection, Shadowchaty ensures a better experience compared to traditional chat platforms.
    </p>
  </section>

  {/* FAQs Accordion */}
  <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
    <h2 className="text-2xl font-semibold text-white sm:text-3xl mb-8">Frequently Asked Questions</h2>
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm">
          <button 
            onClick={() => toggleFaq(index)}
            className="w-full text-left p-6 font-semibold text-white hover:bg-slate-800/50 transition-all flex items-center justify-between"
          >
            <span>{faq.question}</span>
            <svg className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 p-6 bg-slate-900/30' : 'max-h-0'}`}>
            <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </section>

  <SiteFooter />
  </div>
  </>
  )
}
