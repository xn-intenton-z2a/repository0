# Mission

Build a ray tracer library that renders 3D scenes to PPM image files.

The library should progressively implement:
1. Ray-sphere intersection and basic shading
2. Multiple objects (spheres, planes) with diffuse lighting
3. Shadows and ambient occlusion
4. Reflective surfaces with recursive ray bouncing
5. Refractive materials (glass, water) with Snell's law
6. A scene description format (JSON) for defining cameras, lights, and objects
7. Anti-aliasing via supersampling
8. Texture mapping (checkerboard, procedural noise)

## Technical Requirements

- Pure JavaScript, no native dependencies
- Output PPM (P3) format — simple text-based image format
- Vector3 class for all geometric operations
- Configurable resolution and ray depth
- Deterministic output (no random sampling unless seeded)

## Acceptance Criteria

- `renderScene(scene)` returns a PPM string for a given scene description
- `parseScene(json)` loads a scene from a JSON string
- Renders a scene with 3+ spheres, a plane, and a point light in under 10 seconds (640x480)
- At least one sphere is reflective and one is refractive
- Unit tests verify ray-sphere intersection, reflection vectors, and Snell's law
- A sample scene JSON file is included in `docs/examples/`
- Output PPM can be viewed in any image viewer (validated by checking header format)
