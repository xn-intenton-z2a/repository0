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
- Deterministic output: all random sampling must use a seeded PRNG. Given the same scene JSON, output must be byte-identical across runs.

## Scene JSON Structure

The scene description format must support at minimum:

```json
{
  "camera": { "position": [0,2,-5], "lookAt": [0,0,0], "fov": 60 },
  "lights": [{ "position": [5,10,-5], "color": [1,1,1] }],
  "objects": [
    { "type": "sphere", "center": [0,1,0], "radius": 1, "material": { "color": [1,0,0], "reflective": 0.3 } },
    { "type": "plane", "normal": [0,1,0], "d": 0, "material": { "color": [0.5,0.5,0.5] } }
  ]
}
```

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests verifying ray-sphere intersection, reflection vectors, and Snell's law.
- A sample scene JSON file included in `docs/examples/`.
- README with rendering examples and scene format documentation.

## Acceptance Criteria

- [ ] Rendering a scene from JSON returns a PPM string
- [ ] Parsing a scene JSON string returns a usable scene object
- [ ] Renders a scene with 3+ spheres, a plane, and a point light in under 30 seconds (640x480)
- [ ] At least one sphere is reflective and one is refractive
- [ ] Unit tests verify ray-sphere intersection, reflection vectors, and Snell's law
- [ ] A sample scene JSON file is included in `docs/examples/`
- [ ] Output PPM can be viewed in any image viewer (validated by checking header format)
