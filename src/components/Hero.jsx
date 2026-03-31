import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CyberButton from "./CyberButton"

export default function Hero(){

const navigate = useNavigate()

return(

<section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-10 sm:px-6">

{/* Floating Mask Emojis */}




{/* Heading */}
<motion.h1
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:0.8}}
className="mb-6 text-3xl font-bold leading-tight sm:text-5xl md:text-7xl"
>
Talk to Strangers
<br/>
Welcome to <span className="text-purple-500">Shadowchaty</span>
</motion.h1>

{/* Subtitle */}
<p className="mb-8 max-w-xl text-sm text-gray-400 sm:mb-10 sm:text-base">
Meet strangers worldwide through secure anonymous chat and video.
No signup. No identity. Just real conversations.
</p>

{/* Buttons */}
<div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4">

<CyberButton onClick={()=>navigate("/chat")} fullWidth>
Text Chat
</CyberButton>

<CyberButton onClick={()=>navigate("/video")} fullWidth>
Video Chat
</CyberButton>

</div>

</section>

)
}