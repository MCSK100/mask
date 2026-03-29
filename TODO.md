# Mask Admin Updates TODO

## Approved Plan Implementation Steps

1. [x] Edit `mask/src/components/neon/NeonRoomNav.jsx`: Remove nav links (About, Terms, Privacy) and Contact button.
2. [x] Edit `mask/src/pages/Chat.jsx`: 
   - Remove voice mic button.
   - Add ESC key handler to navigate home.
   - Add 'Press ESC to leave' text.
3. [x] Edit `mask/src/pages/Video.jsx`: 
   - Add text chat functionality (messages state, socket handlers, ChatBox, input form below ad).
   - Add ESC key handler and text.
4. [x] Edit `mask/src/pages/AboutContact.jsx`: Update contactEmail to 'contact.maskchat@gmail.com'.
5. [x] Test changes: Run `npm run dev`, verify both pages (dev server started, text chat fixed).
6. [ ] Create git branch, commit, push, open PR.

Progress will be updated after each step.

