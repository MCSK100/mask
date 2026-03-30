# Post-SEO Feedback Updates TODO

## Steps:
- [x] 1. Update Home.jsx FAQs to accordion design (useState for each, rotate icons).
- [x] 2. Video.jsx & Chat.jsx: Hide "Press ESC to leave chat" on mobile (`hidden sm:block`).
- [x] 3. Video.jsx mobile responsive: VideoGrid full viewport height, collapsible chat (add `const [isChatOpen, setIsChatOpen] = useState(false)`, toggle button, conditional render).
- [x] 4. Fix mobile camera mirror: Update getUserMedia constraints to `{ video: { facingMode: 'user' } }` in Video.jsx.
- [x] 5. Test with `cd mask & npm run dev`, check mobile view.
- [ ] 6. Complete.

Current: All updates complete. Changes implemented and ready.
