# Video slots

Drop MP4 files with these exact names into this folder and the page picks them up
(no code change needed). Missing files show a "video coming soon" placeholder.

| File | Where it appears |
|---|---|
| `teaser.mp4` | Directly under the title block, autoplays muted on loop, controls on hover (16:9) |
| `icra_video.mp4` | "Video" section under the abstract (16:9, with controls and sound) |
| `B02_real_3x.mp4` | "Real Experiments" section, B02 tab (16:9, autoplays muted on loop, controls on hover) |
| `B03_real_3x.mp4` | "Real Experiments" section, B03 tab (16:9, autoplays muted on loop, controls on hover) |
| `rack_maintain_10x.mp4` | "More Real-Robot Demonstrations", rack maintenance row (16:9, autoplays muted on loop, controls on hover) |
| `wall_clean_10x.mp4` | "More Real-Robot Demonstrations", wall cleaning row (16:9, autoplays muted on loop, controls on hover) |
| `peg_insert.mp4` | "More Real-Robot Demonstrations", peg insertion row (16:9, autoplays muted on loop, controls on hover) |

To rename or add slots, edit `videos` in `src/content.js`.
Keep clips H.264 MP4 and ideally under ~20 MB each for GitHub Pages.
