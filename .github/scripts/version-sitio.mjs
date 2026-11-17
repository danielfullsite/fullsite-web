#!/usr/bin/env node
// Antes de publicar: pone ?v=<huella del contenido> a /site/site.js y /site/site.css en todas las páginas.
//
// Por qué (2026-11-16): Cloudflare sirve /site/site.js con caché de 4 horas (max-age=14400) y las páginas lo pedían
// siempre sin versión. Un iPhone que ya había abierto fullsite.mx seguía con el site.js viejo después de publicar un
// arreglo. Con la huella en la URL, cada cambio es una URL nueva. Corre en el workflow de publicación, así que nadie
// tiene que acordarse; el repositorio guarda las páginas sin versión.
//
// Uso: node .github/scripts/version-sitio.mjs [carpeta]   (por defecto, la raíz del repositorio)
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = process.argv[2] || join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const RECURSOS = ['site/site.js', 'site/site.css']
const huella = (r) => createHash('sha256').update(readFileSync(join(RAIZ, r))).digest('hex').slice(0, 10)
const huellas = Object.fromEntries(RECURSOS.map((r) => [r, huella(r)]))

function paginas(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if (f.startsWith('.') || f === 'node_modules') continue
    const abs = join(dir, f)
    if (statSync(abs).isDirectory()) paginas(abs, out)
    else if (f.endsWith('.html')) out.push(abs)
  }
  return out
}

let cambiadas = 0
for (const p of paginas(RAIZ)) {
  const antes = readFileSync(p, 'utf8')
  let despues = antes
  for (const [r, h] of Object.entries(huellas)) {
    despues = despues.replace(new RegExp(`/${r.replace('.', '\\.')}(?:\\?v=[0-9a-f]+)?(?=["'])`, 'g'), `/${r}?v=${h}`)
  }
  if (despues !== antes) { writeFileSync(p, despues); cambiadas++ }
}
console.log(JSON.stringify({ huellas, paginas_versionadas: cambiadas }))
