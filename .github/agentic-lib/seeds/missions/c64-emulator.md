# Mission

A JavaScript Commodore 64 emulator that runs in the browser, capable of playing the classic game "The Lords of Midnight" (1984, Mike Singleton).

## Browser Presentation

The emulator runs entirely in the browser as a single-page application:

- **Canvas rendering** — VIC-II output drawn to an HTML `<canvas>` element at native 320x200, scaled with CSS `image-rendering: pixelated`.
- **Web Audio API** — SID output fed to an `AudioWorklet` (or `ScriptProcessorNode` fallback) for real-time sound.
- **Keyboard input** — browser `keydown`/`keyup` events mapped to the C64 keyboard matrix.
- **ROM loading** — user provides KERNAL, BASIC, and character ROM files via file input or drag-and-drop. ROMs are NOT bundled (they are copyrighted).
- **PRG loading** — user loads `.prg` game files via file input or drag-and-drop.
- **Responsive layout** — centred emulator screen with C64-style colour scheme, status bar showing cycle count and FPS.

Website files under `public/`:

| File | Purpose |
|------|---------|
| `public/index.html` | Main page — canvas, file inputs, controls |
| `public/style.css` | C64-themed styling (dark blue background, light blue text) |
| `public/emulator.js` | Browser entry point — imports core lib, wires up canvas/audio/input |

## Architecture

The core emulator is structured as independently testable modules under `src/lib/`:

| File | Module | Purpose |
|------|--------|---------|
| `src/lib/main.js` | Entry point | Re-exports all public API functions from submodules |
| `src/lib/cpu.js` | MOS 6510 CPU | 6502 variant with I/O port at $00/$01 |
| `src/lib/opcodes.js` | Opcode table | Data-driven array of 256 entries (mnemonic, addressing mode, cycles, handler) |
| `src/lib/memory.js` | Memory subsystem | 64KB RAM, ROM banking, I/O area routing |
| `src/lib/vic.js` | VIC-II video | Text/bitmap modes, sprites, raster interrupts, framebuffer |
| `src/lib/sid.js` | SID sound | 3-voice synthesiser, ADSR envelopes, PCM output |
| `src/lib/cia.js` | CIA timers | Timer interrupts, keyboard matrix scanning, joystick |
| `src/lib/input.js` | Input mapping | Browser key event codes to C64 8x8 keyboard matrix |
| `src/lib/loader.js` | PRG loader | Parse `.prg` header and load data into memory |
| `src/lib/c64.js` | Machine | Wires all subsystems together, provides `createC64()` and `runFrame()` |

This multi-file structure allows the agent to iterate on each subsystem independently without hitting context limits. Each module has a corresponding test file under `tests/`.

## Research Phase

During web-search and document-gathering workflow phases, the agent should look up:

- **6502/6510 opcode reference** — complete instruction set with addressing modes, cycle counts, and flag effects. Key resource: "6502 Instruction Set" tables listing all 151 official opcode variants.
- **VIC-II register map** — all registers at $D000–$D03F, their bit layouts, and behaviour (C64 Programmer's Reference Guide).
- **SID register map** — registers at $D400–$D41C, waveform generation, ADSR timing.
- **CIA register map** — CIA1 ($DC00–$DC0F) and CIA2 ($DD00–$DD0F), keyboard matrix wiring, timer modes.
- **C64 keyboard matrix** — the 8x8 matrix mapping (which row/column pair for each physical key).
- **C64 colour palette** — the 16 VIC-II colours as RGB values.
- **Lords of Midnight technical details** — memory layout, which C64 features the game uses, loading address.
- **Existing open-source C64 emulators in JavaScript** — study approaches (e.g. virtual6502, SAE, c64js) for implementation patterns and known pitfalls.

The opcode table in particular should be assembled from reference data during the research phase and stored as `src/lib/opcodes.js` — a data-driven 256-entry array — rather than hand-coded instruction by instruction. This avoids the agent losing track of which opcodes are implemented and reduces the chance of transcription errors.

## Core API

Export from `src/lib/main.js` (re-exporting from submodules):

- `createC64(opts?)` — create an emulator instance with 64KB RAM and subsystem objects (`cpu`, `memory`, `vic`, `sid`, `cia1`, `cia2`).
- `loadROMs(c64, { kernal, basic, chargen })` — load ROM images (Uint8Arrays). Must be called before running.
- `loadPRG(c64, data)` — load a `.prg` file (Uint8Array) into memory at the address from its two-byte header.
- `step(c64)` — execute one CPU instruction, advance cycle count, update timers. Returns the updated state.
- `runFrame(c64)` — execute one PAL video frame (~19656 cycles). Fire raster interrupts. Returns the RGBA framebuffer.
- `getFramebuffer(c64)` — return the current screen as a Uint8Array RGBA pixel buffer (320x200).
- `pressKey(c64, key)` / `releaseKey(c64, key)` — simulate keyboard input via CIA1 keyboard matrix.
- `joystickInput(c64, port, directions)` — set joystick state (up/down/left/right/fire) on port 1 or 2.
- `reset(c64)` — hardware reset (CPU to reset vector, clear subsystem state).

## CPU (src/lib/cpu.js, src/lib/opcodes.js)

- All official 6502 opcodes (56 instructions, 151 opcode variants) with correct cycle counts.
- Decimal mode (BCD arithmetic).
- IRQ and NMI interrupt handling with correct stack behaviour.
- 6510 I/O port at $00/$01 for ROM/RAM bank switching.
- Undocumented/illegal opcodes: implement as NOP (not required for Lords of Midnight).
- The opcode table (`opcodes.js`) is a data-driven array of 256 entries to keep the code manageable and verifiable against reference data gathered during the research phase.

## Memory (src/lib/memory.js)

- $0000–$00FF: Zero page
- $0100–$01FF: Stack
- $0200–$9FFF: Free RAM (programs load here)
- $A000–$BFFF: BASIC ROM (banked, RAM underneath)
- $C000–$CFFF: Free RAM
- $D000–$D3FF: VIC-II registers (routed to VIC-II module)
- $D400–$D7FF: SID registers (routed to SID module)
- $D800–$DBFF: Colour RAM (nibbles)
- $DC00–$DCFF: CIA1 registers (routed to CIA module)
- $DD00–$DDFF: CIA2 registers (routed to CIA module)
- $E000–$FFFF: KERNAL ROM (banked, RAM underneath)

## Video — VIC-II (src/lib/vic.js)

- Standard text mode (40x25 characters, 16 colours, character ROM).
- Multicolour text mode.
- Standard bitmap mode (320x200) and multicolour bitmap mode (160x200).
- Hardware sprites (8 sprites, 24x21 pixels, multicolour optional).
- Raster interrupt — trigger IRQ at a programmable scanline.
- Border and background colour registers.
- Correct raster timing — Lords of Midnight uses raster effects.

## Sound — SID (src/lib/sid.js)

- 3 oscillator voices: triangle, sawtooth, pulse, noise waveforms.
- ADSR envelope per voice.
- Frequency and pulse-width registers.
- Audio output as PCM sample buffer (44100 Hz, mono) for Web Audio API.
- Full filter emulation is NOT required (passthrough acceptable).

## Input (src/lib/input.js, src/lib/cia.js)

- CIA1 keyboard matrix — map browser `KeyboardEvent.code` values to the C64 8x8 keyboard matrix.
- Joystick via CIA1 port registers — Lords of Midnight uses keyboard, but joystick support enables other games.

## Lords of Midnight Compatibility

The target game exercises:
- Custom character sets (redefined at $3000 or similar)
- Full keyboard input (directional + action keys)
- Raster interrupts for split-screen effects
- IRQ-driven game loop timing via CIA timer
- PRG loading at the correct start address

## Test Strategy

Testing a full emulator requires care to avoid the verification gap (passing unit tests but failing on real software):

- **CPU tests**: verify each addressing mode and instruction against known-good results. Use the research-phase opcode reference to generate expected values. Test interrupt handling (IRQ vector jump, flag push, RTI return).
- **Memory tests**: test bank switching ($01 register), I/O area routing, ROM overlay behaviour.
- **VIC-II tests**: set known register states, render one frame, verify specific pixels in the framebuffer.
- **Input tests**: simulate key press sequences, verify CIA1 port reads return correct matrix values.
- **Stub ROMs**: tests use minimal ROMs — just enough to set the reset vector ($FFFC/$FFFD) and RTI from the IRQ vector. The agent should create these as hex-encoded Uint8Arrays in the test fixtures.
- **Integration test**: a small test PRG (hex-encoded in the test file) that writes "HELLO" to screen RAM ($0400) and halts. Run it, verify the framebuffer contains the correct character glyphs.
- **Smoke test for the browser UI**: verify `public/index.html` loads without errors and the canvas element is present (can use a headless browser or DOM parser).

## Requirements

- No external runtime dependencies — pure JavaScript using only browser-provided APIs (Canvas, Web Audio, File API).
- ROMs must NOT be bundled. The `loadROMs()` function and browser drag-and-drop accept user-supplied ROM files.
- Multi-file structure as specified in the Architecture section.
- The `public/` website is self-contained and can be served with any static file server.
- README with architecture overview, browser usage instructions, and guidance on obtaining legal ROM dumps.

## Acceptance Criteria

- [ ] CPU executes all 151 official opcodes with correct results and cycle counts
- [ ] CPU handles IRQ and NMI interrupts correctly (push PC+flags, jump to vector)
- [ ] Memory bank switching works ($01 register controls ROM/RAM visibility)
- [ ] VIC-II text mode renders 40x25 character display to RGBA framebuffer
- [ ] VIC-II raster interrupt fires at the programmed scanline
- [ ] SID produces audible waveform output for at least triangle and pulse waves
- [ ] CIA1 keyboard matrix correctly maps key presses to the scanned row/column
- [ ] `loadPRG()` places data at the correct address from the PRG header
- [ ] `runFrame()` executes the correct number of cycles per PAL frame (~19656)
- [ ] A test PRG that writes "HELLO" to screen RAM ($0400) produces correct framebuffer output
- [ ] `reset()` returns the emulator to a known initial state
- [ ] Browser UI renders emulator output to canvas at 50 FPS (PAL rate)
- [ ] Browser UI plays SID audio via Web Audio API
- [ ] Browser UI accepts ROM and PRG files via drag-and-drop or file input
- [ ] All unit tests pass
- [ ] README documents architecture, browser usage, and how to obtain legal ROM dumps
