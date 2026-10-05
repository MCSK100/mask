import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

const Home = lazy(() => import("./pages/Home"))
const CreateMeeting = lazy(() => import("./pages/CreateMeeting"))
const JoinMeeting = lazy(() => import("./pages/JoinMeeting"))
const Meeting = lazy(() => import("./pages/Meeting"))
const Schedule = lazy(() => import("./pages/Schedule"))
const NotFound = lazy(() => import("./pages/NotFound"))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"))
const Terms = lazy(() => import("./pages/Terms"))
const AboutContact = lazy(() => import("./pages/AboutContact"))
const Blog = lazy(() => import("./pages/Blog"))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#0c090c] font-display text-white">Loading ShadowMeet…</div>}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMeeting />} />
            <Route path="/join" element={<JoinMeeting />} />
            <Route path="/meet/:roomId" element={<Meeting />} />
            <Route path="/schedule/:roomId" element={<Schedule />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<AboutContact />} />
            <Route path="/blog" element={<Blog />} />
            {/* legacy random-chat routes retired: redirect to new join */}
            <Route path="/chat" element={<JoinMeeting />} />
            <Route path="/video" element={<JoinMeeting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
