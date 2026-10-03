import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminDb } from '@/lib/firebase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

// --- HTML E-MAIL SABLON GENERÁTOR (Tiszta, kártya nélküli háttér) ---
function generateEmailWrapper(contentHtml: string) {
  const logoUrl = 'https://sonaweb.hu/sonaweb-logo-white.png' 

  return `
  <!DOCTYPE html>
  <html lang="hu">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; width: 100%; height: 100%;">
      <tr>
        <td align="center" style="padding: 60px 20px 80px 20px;">
          <!-- Középső konténer (kártya háttér nélkül) -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
            
            <!-- Fejléc / Logó -->
            <tr>
              <td style="padding-bottom: 64px; text-align: center;">
                <img src="${logoUrl}" alt="SONAWEB" width="160" style="display: block; margin: 0 auto; border: none; outline: none; text-decoration: none;" />
              </td>
            </tr>
            
            <!-- Tartalom -->
            <tr>
              <td style="text-align: left;">
                ${contentHtml}
              </td>
            </tr>

            <!-- Lábléc -->
            <tr>
              <td style="padding-top: 80px; text-align: center;">
                <p style="margin: 0 0 24px 0; font-size: 13px; font-weight: 400; color: #a3a3a3; line-height: 1.5;">
                  Ez egy automatikus üzenet, kérjük, ne válaszolj rá.<br>
                  <a href="https://www.sonaweb.hu/legal/imprint" style="color: #a3a3a3; text-decoration: underline;">Impresszum</a> &nbsp;|&nbsp; <a href="https://www.sonaweb.hu/legal/privacy-policy" style="color: #a3a3a3; text-decoration: underline;">Adatkezelési tájékoztató</a>
                </p>
                
                <p style="margin: 0; font-size: 12px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                  <a href="https://sonaweb.hu" style="color: #ffffff; text-decoration: none;">© ${new Date().getFullYear()}SONAWEB KFT.</a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, phone, message, services, timeline, budget, type } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Név és e-mail kötelező.' }, { status: 400 })
    }

    const flowType = type || 'project'
    const createdAt = new Date()

    // 1. Mentés a Firestore adatbázisba
    const leadRef = await adminDb.collection('inquiries').add({
      type: flowType,
      name,
      email,
      phone: phone || '',
      message: message || '',
      services: services || [],
      timeline: timeline || '',
      budget: budget || '',
      status: 'ÚJ',
      createdAt,
    })

    let userSubject = ''
    let userMessageBody = ''
    let userHtmlContent = ''

    // -- PONTOS DESIGN SYSTEM STÍLUSOK --
    const labelStyle = "margin: 0 0 12px 0; font-size: 14px; line-height: 14px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: -0.4px;"
    const h1Style = "margin: 0 0 40px 0; font-size: 32px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -1px; line-height: 1.1;"
    const pStyle = "margin: 0 0 32px 0; font-size: 16px; color: #ffffff; line-height: 1.6; font-weight: 400;"
    const dataValueStyle = "margin: 0 0 32px 0; font-size: 18px; color: #ffffff; font-weight: 600; line-height: 1.5;"
    const quoteStyle = "margin: 0 0 32px 0; font-size: 18px; color: #ffffff; font-weight: 400; line-height: 1.6; font-style: italic;"

    if (flowType === 'team') {
      userSubject = `Jelentkezés rögzítve — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a jelentkezésedet a Sonaweb csapatába.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlContent = `
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a jelentkezésedet a Sonaweb csapatába. Profilodat rögzítettük a rendszerünkben.</p>
        
        <p style="${labelStyle}">Bemutatkozásod</p>
        <div style="${quoteStyle}">
          "${message || 'Nem adtál meg külön leírást.'}"
        </div>

        <p style="${pStyle}">Átnézzük az anyagodat, és amint van a profilodhoz illő nyitott pozíciónk, felvesszük veled a kapcsolatot.</p>
      `
    } else if (flowType === 'message') {
      userSubject = `Üzeneted megérkezett — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlContent = `
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk.</p>
        
        <p style="${labelStyle}">Üzeneted</p>
        <div style="${quoteStyle}">
          "${message || 'Nincs szöveges üzenet.'}"
        </div>

        <p style="${pStyle}">Hamarosan átnézzük a kérdésedet, és a megadott e-mail címen válaszolunk.</p>
      `
    } else {
      userSubject = `Projekt részletek rögzítve — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést. A projekt részleteit rögzítettük.\n\nÜdvözlettel,\nA Sonaweb csapata`
      
      const htmlServicesList = services && services.length > 0
        ? `<p style="${labelStyle}">Érdeklődési körök</p>
           <p style="${dataValueStyle}">${services.map((s: any) => `${s.category}`).join(' • ')}</p>`
        : ''

      userHtmlContent = `
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a megkeresést. A projekt részleteit rögzítettük, a csapatunk hamarosan feldolgozza az adatokat.</p>
        
        ${htmlServicesList}
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td width="50%" valign="top" style="padding-right: 10px;">
              <p style="${labelStyle}">Időzítés</p>
              <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">${timeline || 'Rugalmas'}</p>
            </td>
            <td width="50%" valign="top">
              <p style="${labelStyle}">Költségkeret</p>
              <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">${budget || 'Megbeszélés tárgya'}</p>
            </td>
          </tr>
        </table>

        ${message ? `
        <p style="${labelStyle}">Kiegészítő információk</p>
        <div style="${quoteStyle}">
          "${message}"
        </div>` : ''}

        <p style="${pStyle}">Amíg felvesszük veled a kapcsolatot, addig is további szép napot kívánunk!</p>
      `
    }

    // 2. Automatikus visszaigazolás küldése az ügyfélnek
    await resend.emails.send({
      from: 'SONAWEB. <hello@sonaweb.hu>',
      to: email,
      subject: userSubject,
      text: userMessageBody,
      html: generateEmailWrapper(userHtmlContent),
    })

    // 3. Belső értesítő e-mail neked (Admin)
    if (process.env.ADMIN_EMAIL) {
      const adminSubject = flowType === 'team'
        ? `[CSAPAT] Új jelentkező: ${name}`
        : flowType === 'message'
        ? `[ÜZENET] Új megkeresés: ${name}`
        : `[PROJEKT] ${name}`

      const adminHtmlContent = `
        <h1 style="${h1Style}">${flowType.toUpperCase()} LEZÁRVA</h1>
        
        <p style="${labelStyle}">Ügyfél adatai</p>
        <p style="margin: 0 0 8px 0; font-size: 20px; color: #ffffff; font-weight: 600;">${name}</p>
        <p style="margin: 0 0 8px 0; font-size: 16px;"><a href="mailto:${email}" style="color: #ffffff; text-decoration: none;">${email}</a></p>
        <p style="margin: 0 0 32px 0; font-size: 16px; color: #ffffff;">${phone || 'Nincs telefonszám'}</p>

        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            ${timeline ? `
            <td width="50%" valign="top" style="padding-right: 10px;">
              <p style="${labelStyle}">Időzítés</p>
              <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">${timeline}</p>
            </td>` : ''}
            ${budget ? `
            <td width="50%" valign="top">
              <p style="${labelStyle}">Költségkeret</p>
              <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 600;">${budget}</p>
            </td>` : ''}
          </tr>
        </table>
        
        ${services && services.length > 0 ? `
        <p style="${labelStyle}">Szolgáltatások</p>
        <p style="${dataValueStyle}">${services.map((s: any) => `${s.category}`).join(' • ')}</p>
        ` : ''}

        <p style="${labelStyle}">Üzenet</p>
        <div style="${quoteStyle}">
          "${message || 'Nincs szöveges üzenet'}"
        </div>

        <div style="margin-top: 60px; padding-top: 20px;">
          <p style="font-size: 11px; color: #404040; text-transform: uppercase; letter-spacing: 1px;">Firestore ID: ${leadRef.id}</p>
        </div>
      `

      await resend.emails.send({
        from: 'SONAWEB. <hello@sonaweb.hu>',
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: `Új megkeresés érkezett: ${name}`,
        html: generateEmailWrapper(adminHtmlContent),
      })
    }

    return NextResponse.json({ success: true, id: leadRef.id })
  } catch (error) {
    console.error('Lead hiba:', error)
    return NextResponse.json({ error: 'Hiba a feldolgozás során.' }, { status: 500 })
  }
}
