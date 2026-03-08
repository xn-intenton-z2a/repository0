import { describe, it, expect } from 'vitest'
import { spawnSync } from 'child_process'
import path from 'path'

const node = process.execPath
const script = path.resolve('src/lib/main.js')

describe('CLI', () => {
  it('to-roman 9 -> IX', () => {
    const r = spawnSync(node, [script, '-t', '9'], { encoding: 'utf8' })
    expect(r.status).toBe(0)
    expect(r.stdout).toBe('IX\n')
  })
  it('from-roman IX -> 9', () => {
    const r = spawnSync(node, [script, '-f', 'IX'], { encoding: 'utf8' })
    expect(r.status).toBe(0)
    expect(r.stdout).toBe('9\n')
  })
  it('from-roman ix without permissive errors', () => {
    const r = spawnSync(node, [script, '-f', 'ix'], { encoding: 'utf8' })
    expect(r.status).toBe(2)
    expect(r.stderr).toBe('Non-canonical roman numeral\n')
  })
  it('from-roman ix with permissive succeeds', () => {
    const r = spawnSync(node, [script, '-f', 'ix', '--permissive'], { encoding: 'utf8' })
    expect(r.status).toBe(0)
    expect(r.stdout).toBe('9\n')
  })
})
