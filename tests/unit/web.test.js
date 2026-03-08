import { describe, it, expect } from 'vitest'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(path.resolve('src/web/index.html'), 'utf8')

describe('web demo structure', () => {
  it('contains expected elements and wiring', () => {
    const dom = new JSDOM(html, { runScripts: 'outside-only' })
    const doc = dom.window.document
    expect(doc.getElementById('num-input')).toBeTruthy()
    expect(doc.getElementById('num-convert')).toBeTruthy()
    expect(doc.getElementById('num-output')).toBeTruthy()
    expect(doc.getElementById('roman-input')).toBeTruthy()
    expect(doc.getElementById('roman-convert')).toBeTruthy()
    expect(doc.getElementById('roman-output')).toBeTruthy()
  })
})
