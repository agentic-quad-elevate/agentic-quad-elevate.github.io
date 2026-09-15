# Video slots

Drop MP4 files with these exact names into this folder and the page picks them up
(no code change needed). Missing files show a "video coming soon" placeholder.

| File | Where it appears |
|---|---|
| `overview.mp4` | "Video" section under the abstract (16:9) |
| `real_b02_rack_retrieval.mp4` | Real-robot section, B02 rack retrieval (16:9) |
| `real_b03_rack_placement.mp4` | Real-robot section, B03 floor-to-rack placement (16:9) |

To rename or add slots, edit `videos` in `src/content.js`.
Keep clips H.264 MP4 and ideally under ~20 MB each for GitHub Pages.
