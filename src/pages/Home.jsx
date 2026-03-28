import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import ParticlesBG from "../components/ParticlesBG"
import SiteFooter from "../components/SiteFooter"

export default function Home(){

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

<SiteFooter />
</div>
</>
)

}

