# kazaysky.com

Official site of KΛZΛYSKY — cinematic melodic techno & trance, Warsaw.
Static site, deployed automatically by Netlify from the `main` branch (no build step, publish directory `.`).

## Edit once, update forever
All links live in `assets/app.js` → `CONFIG`:
- `freePlaylist` – SoundCloud "KAZAYSKY - FREE DOWNLOAD" playlist (new free tracks appear automatically)
- `soundcloudProfile` – latest tracks (automatic)
- `spotifyArtist` – paste the Spotify artist URL once; new releases appear automatically
- `spotify`, `apple`, `beatport`, `youtube` – Solar Flare release buttons
- `release` – Solar Flare release date (countdown → "Out now")
- `mailerlite.forms` – MailerLite form IDs

## Structure
- `index.html` – home page
- `free/` – free downloads (playlist) + gates `free/hugel`, `free/rise`
- `dl/` – download files (MP3 320 / WAV)
- `privacy/`, `404.html`, `_redirects`, `_headers`, `robots.txt`, `sitemap.xml`
