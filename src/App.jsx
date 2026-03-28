import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

const Home = lazy(() => import("./pages/Home"))
const Chat = lazy(() => import("./pages/Chat"))
const Video = lazy(() => import("./pages/Video"))

function AnimatedRoutes(){

const location = useLocation()

return(

<AnimatePresence mode="wait">

<Suspense fallback={<div className="grid min-h-screen place-items-center text-slate-300">Loading...</div>}>
  <motion.div
  key={location.pathname}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4 }}
  >

  <Routes location={location}>

  <Route path="/" element={<Home/>}/>
  <Route path="/chat" element={<Chat/>}/>
  <Route path="/video" element={<Video/>}/>

  </Routes>

  </motion.div>
</Suspense>

</AnimatePresence>

)

}

export default function App(){

return(

<BrowserRouter>
<AnimatedRoutes/>
</BrowserRouter>

)

}