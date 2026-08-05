# PWA Download + Update Implementation TODO

## Steps
- [x] 1. Extend src/utils/pwaInstall.js with install flag + update helpers
- [x] 2. Update public/sw.js with update detection + notify clients
- [x] 3. Update src/main.jsx to register SW in dev/prod + dispatch update events
- [x] 4. Enhance src/components/InstallPWA.jsx (reliable install button, close X, Check for updates button, update banner)
- [x] 5. Improve public/manifest.webmanifest (icons, id, maskable)
- [x] 6. Add missing PWA meta tags to index.html
- [x] 7. Run npm run build — verify zero errors (built in 3.21s)

## Mobile UX Updates
- [x] 8. Center the install modal popup on mobile (full-screen overlay + centered dialog + backdrop)
- [x] 9. Center the "Update available" banner the same way for consistency
- [x] 10. Make the "Install App" button a permanent static button in the navbar (always visible)
- [x] 11. Verify build passes
