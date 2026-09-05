# Design QA — v7

## Visual truth and state

Redesign brief: the user-supplied replan, solid office partition, warm modern apartment, correct fixtures, navy corduroy accent sofa, gray beanbag, pets and pet places. Current v7 evidence: `output/playwright/desktop-v7.png`, `living-top-v7.png`, `bath-v7.png`, `android-walk-360x800.png`, `iphone-390x844.png` and `mobile-landscape-844x390-v7.png`.

Baseline and final overview were opened together in one image comparison input. Both desktop screenshots: 1280 × 720 physical pixels, 1280 × 720 CSS viewport, normalized 1×. States: whole-apartment daytime model; deliberate new camera angle and cutaway wall height, not a pixel clone. Focused fixture and sofa evidence is also 1280 × 720. Mobile: 390 × 844 pixels and CSS viewport, normalized 1×, static production build.

## Findings and fixes

- P1: baseline block-like furnishings and dark walls obscured the apartment. Rebuilt scene materials, rounded upholstered objects, cutaway furniture, light walls, contact shadows. Final overview shows connected rooms and furnishings clearly.
- P1: fixture component orientations were inconsistent. Full local transforms now include every subcomponent; washer faces into WC, toilets back onto walls, bathtub has an actual inner bowl. Focused screenshot reviewed.
- P1: Android/Samsung could fail or stall under the desktop post-processing pipeline. Mobile detection now disables SSAO and persistent drawing buffers, uses compatible static shadows, caps rendering near 45 FPS and keeps pixel density up to 1.5×. Desktop retains the richer pipeline.
- P1: discrete phone direction buttons were awkward to hold. Replaced with a continuous pointer-captured analog joystick; the rest of the canvas remains the look zone. Automated hold moved the camera from x=7.65 to x=8.36 and released cleanly.
- P2: mobile portrait and landscape needed different composition. Verified 360×800, 390×844 and 844×390 layouts; landscape now uses the same bottom room rail rather than the desktop sidebar.
- P1: entrance furniture overlapped the perceived arrival zone and the pet bed read as a tray. Banquette moved to the right of the entry; dog bed moved beside the living sofa; a distinct low-sided litter tray was added to WC 1.
- P1: desk-chair orientations and washer frontage did not communicate use correctly. Both task chairs now face their monitors; the washer front faces the WC doorway; the office lounge rotates toward the plant.
- P2: terracotta sofa and central plant weakened the requested focal point and circulation. Replaced with deep navy corduroy, softer rounded/bolstered geometry, ochre/clay cushions and a navy kitchen/partition family; removed the circulation plant.
- P1: the sectional corner doubled internal arm geometry. Both joining ends are now open and overlap as one continuous upholstered corner. Dining chairs face the table.
- P1: the entry wardrobe stopped short of the child's wall. Its floor and storage run now reach that boundary; the concept zone is labelled 3.48 m². The bathtub faucet is on the opposite end.

## Required surfaces

- Typography: restrained Segoe UI / Inter fallback; clear room title and small utility labels. No cropped desktop labels. Mobile room navigation intentionally scrolls horizontally.
- Layout: scene is dominant, permanent room list at desktop left, bottom strip on mobile. Toolbar and bottom actions remain visible.
- Color: cream, light oak, sage/petrol with terracotta corduroy and mustard cushions. Selected-state contrast is distinct.
- Assets: real raster surface textures and generated artwork; scene furniture and animals are intentionally native 3D models as requested, not raster mockups. Sofa ribbing is visible in the close view. Animals are stylized, not photorealistic.
- Copy: descriptions reflect actual pet zones, fixtures and sofa. Budget is identified as a concept target. Dimensional ambiguity is documented in README rather than presented as verified construction geometry.

## Functional evidence

- `npm run validate`: passed; 9 reachable rooms, no blocked doors or viewpoints.
- `node scripts/test-controls.mjs`: passed W/A/S/D and analog-vector direction relative to camera, rotated-camera movement, zoom bounds and clean release.
- `npm run build`: passed; textures embedded as data URLs.
- Browser: room selection, model/walk transitions, desktop, narrow Android portrait, iPhone portrait and mobile landscape inspected. Joystick press-drag-hold-release was exercised in the real browser.
- Logs reviewed: no observed runtime exception in final scene; an initial Three texture-not-ready warning occurred during loading, with textures visibly complete afterward. Build gives the expected large-bundle advisory for Three.js. No claim of cross-device performance certification.

## Follow-up polish

P3: photorealistic exterior scenery, more realistic animal meshes and professionally authored furniture assets could further improve close-up realism. Exact dimension certification remains outside a perspective-reference concept.

final result: passed
