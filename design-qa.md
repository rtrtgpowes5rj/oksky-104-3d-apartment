# Design QA — v6

## Visual truth and state

Redesign brief: the user-supplied replan, solid office partition, warm modern apartment, correct fixtures, navy corduroy accent sofa, gray beanbag, pets and pet places. Baseline implementation: `C:/bots/кв/release-v4/preview-release.png`. Current evidence: `output/overview-v6.png` plus browser-reviewed close views of the entrance, WC 1, office and living sofa.

Baseline and final overview were opened together in one image comparison input. Both desktop screenshots: 1280 × 720 physical pixels, 1280 × 720 CSS viewport, normalized 1×. States: whole-apartment daytime model; deliberate new camera angle and cutaway wall height, not a pixel clone. Focused fixture and sofa evidence is also 1280 × 720. Mobile: 390 × 844 pixels and CSS viewport, normalized 1×, static production build.

## Findings and fixes

- P1: baseline block-like furnishings and dark walls obscured the apartment. Rebuilt scene materials, rounded upholstered objects, cutaway furniture, light walls, contact shadows. Final overview shows connected rooms and furnishings clearly.
- P1: fixture component orientations were inconsistent. Full local transforms now include every subcomponent; washer faces into WC, toilets back onto walls, bathtub has an actual inner bowl. Focused screenshot reviewed.
- P2: mobile overview clipped the outside walls. Fit distance now depends on aspect ratio; raised orbit distance limit. Production screenshot `mobile-v5.png` shows the whole apartment and all persistent control groups.
- P2: unlimited refresh consumed unnecessary GPU time. Added a ~60 FPS render cap, static shadow updates and bounded resolution. Before cap the desktop session reported about 164 FPS. This is a local observation, not a guarantee for other hardware.
- P1: entrance furniture overlapped the perceived arrival zone and the pet bed read as a tray. Banquette moved to the right of the entry; dog bed moved beside the living sofa; a distinct low-sided litter tray was added to WC 1.
- P1: desk-chair orientations and washer frontage did not communicate use correctly. Both task chairs now face their monitors; the washer front faces the WC doorway; the office lounge rotates toward the plant.
- P2: terracotta sofa and central plant weakened the requested focal point and circulation. Replaced with deep navy corduroy, softer rounded/bolstered geometry, ochre/clay cushions and a navy kitchen/partition family; removed the circulation plant.

## Required surfaces

- Typography: restrained Segoe UI / Inter fallback; clear room title and small utility labels. No cropped desktop labels. Mobile room navigation intentionally scrolls horizontally.
- Layout: scene is dominant, permanent room list at desktop left, bottom strip on mobile. Toolbar and bottom actions remain visible.
- Color: cream, light oak, sage/petrol with terracotta corduroy and mustard cushions. Selected-state contrast is distinct.
- Assets: real raster surface textures and generated artwork; scene furniture and animals are intentionally native 3D models as requested, not raster mockups. Sofa ribbing is visible in the close view. Animals are stylized, not photorealistic.
- Copy: descriptions reflect actual pet zones, fixtures and sofa. Budget is identified as a concept target. Dimensional ambiguity is documented in README rather than presented as verified construction geometry.

## Functional evidence

- `npm run validate`: passed; 9 reachable rooms, no blocked doors or viewpoints.
- `node scripts/test-controls.mjs`: passed W/A/S/D direction relative to camera, rotated-camera movement, zoom bounds and key release.
- `npm run build`: passed; textures embedded as data URLs.
- Browser: room selection, model/walk transitions, final standalone render, desktop and mobile views inspected. Existing interaction implementations also support palette, light, map and image capture; this final pass did not exhaustively exercise every download/browser permission variant.
- Logs reviewed: no observed runtime exception in final scene; an initial Three texture-not-ready warning occurred during loading, with textures visibly complete afterward. Build gives the expected large-bundle advisory for Three.js. No claim of cross-device performance certification.

## Follow-up polish

P3: photorealistic exterior scenery, more realistic animal meshes and professionally authored furniture assets could further improve close-up realism. Exact dimension certification remains outside a perspective-reference concept.

final result: passed
