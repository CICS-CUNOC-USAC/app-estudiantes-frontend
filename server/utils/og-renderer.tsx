import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { createElement as h, type JSX as SatoriJSX } from 'satori/jsx'

declare global {
  namespace JSX {
    interface IntrinsicElements extends SatoriJSX.IntrinsicElements {}
    type Element = SatoriJSX.Element
  }
}

const fontsDir = fileURLToPath(new URL('../../public/fonts', import.meta.url))
const interRegular = fs.readFileSync(`${fontsDir}/Inter-Regular.ttf`)
const interBold = fs.readFileSync(`${fontsDir}/Inter-Bold.ttf`)

const COLORS = {
  bg: '#F9F5F3',
  primary: '#ff6600',
  dark: '#272933',
  muted: '#6b6e7a',
  white: '#ffffff',
  border: '#e8e3df'
}

export interface OgCardData {
  title: string
  subtitle: string
  badge: 'Comunicado' | 'Publicación Oficial' | 'Portal'
}

export const FALLBACK_CARD: OgCardData = {
  title: 'CICS App',
  subtitle: 'Portal para estudiantes de Ingeniería, CUNOC',
  badge: 'Portal'
}

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + '…' : str
}

function OgCard({ title: rawTitle, subtitle, badge }: OgCardData) {
  const title = truncate(rawTitle, 80)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '1200px',
        height: '630px',
        backgroundColor: COLORS.bg,
        fontFamily: 'Inter',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top orange accent bar */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '6px',
          backgroundColor: COLORS.primary
        }}
      />

      {/* Decorative faint circle bottom-right */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          backgroundColor: COLORS.primary,
          opacity: '0.07'
        }}
      />

      {/* Badge pill */}
      <div style={{ display: 'flex', marginBottom: '28px', marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            borderRadius: '999px',
            padding: '6px 20px',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}
        >
          {badge}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          display: 'flex',
          fontSize: '52px',
          fontWeight: 700,
          color: COLORS.dark,
          lineHeight: '1.15',
          marginBottom: '24px',
          maxWidth: '1050px'
        }}
      >
        {title}
      </div>

      {/* Subtitle / date / meta */}
      <div
        style={{
          display: 'flex',
          fontSize: '24px',
          fontWeight: 400,
          color: COLORS.muted,
          flex: '1'
        }}
      >
        {subtitle}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: `2px solid ${COLORS.border}`
        }}
      >
        {/* Left: dot + brand name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* <div
            style={{
              display: 'flex',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: COLORS.primary
            }}
          /> */}
          <div
            style={{
              display: 'flex',
              fontSize: '22px',
              fontWeight: 700,
              color: COLORS.dark
            }}
          >
            CICS App
          </div>
        </div>

        {/* Right: domain */}
        <div
          style={{
            display: 'flex',
            fontSize: '18px',
            fontWeight: 400,
            color: COLORS.muted
          }}
        >
          cics.cunoc.edu.gt
        </div>
      </div>
    </div>
  )
}

export async function buildOgImage(card: OgCardData): Promise<Buffer> {
  const svg = await satori(<OgCard {...card} />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: interRegular.buffer as ArrayBuffer,
        weight: 400,
        style: 'normal'
      },
      {
        name: 'Inter',
        data: interBold.buffer as ArrayBuffer,
        weight: 700,
        style: 'normal'
      }
    ]
  })

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  return Buffer.from(resvg.render().asPng())
}
