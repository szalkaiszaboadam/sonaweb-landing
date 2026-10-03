import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminDb } from '@/lib/firebase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

// --- HTML E-MAIL SABLON GENERÁTOR (Közös keret) ---
function generateEmailWrapper(contentHtml: string) {
  // Cseréld ki a domain-t a sajátodra!
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
        <td align="center" style="padding: 60px 20px;">
          <!-- Középső konténer -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto;">
            
            <!-- Fejléc / Logó -->
            <tr>
              <td style="padding-bottom: 50px; text-align: left;">
                <img src="${logoUrl}" alt="SONAWEB" width="160" style="display: block; border: none; outline: none; text-decoration: none;" />
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
              <td style="padding-top: 60px; text-align: left; border-top: 1px solid #1a1a1a;">
                <p style="margin: 0; font-size: 13px; font-weight: 600; color: #606060; text-transform: uppercase; letter-spacing: -0.4px;">
                  © ${new Date().getFullYear()} SONAWEB. Minden jog fenntartva.
                </p>
                <p style="margin: 10px 0 0 0;">
                  <a href="https://sonaweb.hu" style="font-size: 13px; color: #a3a3a3; text-decoration: none;">sonaweb.hu</a>
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

    // Témák és tartalom előkészítése
    let userSubject = ''
    let userMessageBody = ''
    let userHtmlContent = ''

    // -- STÍLUS VÁLTOZÓK A LANDING OLDAL ALAPJÁN --
    const labelStyle = "margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #606060; text-transform: uppercase; letter-spacing: -0.4px;"
    const h1Style = "margin: 0 0 24px 0; font-size: 32px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -1px; line-height: 1.1;"
    const pStyle = "margin: 0 0 32px 0; font-size: 16px; color: #d1d5db; line-height: 1.6; font-weight: 400;"
    const boxStyle = "background-color: #141414; border: 1px solid #1f1f1f; border-radius: 16px; padding: 24px; margin-bottom: 32px;"
    const buttonStyle = "display: inline-block; background-color: #ffffff; color: #0a0a0a; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: -0.4px; text-decoration: none; padding: 14px 28px; border-radius: 50px;"

    if (flowType === 'team') {
      userSubject = `Jelentkezés rögzítve — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a jelentkezésedet a Sonaweb csapatába.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlContent = `
        <p style="${labelStyle}">Jelentkezés beérkezett</p>
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a jelentkezésedet a Sonaweb csapatába. Profilodat rögzítettük a rendszerünkben.</p>
        
        <div style="${boxStyle}">
          <p style="${labelStyle}">Bemutatkozásod</p>
          <p style="margin: 0; font-size: 16px; color: #ffffff; font-style: italic;">"${message || 'Nem adtál meg külön leírást.'}"</p>
        </div>

        <p style="${pStyle}">Átnézzük az anyagodat, és amint van a profilodhoz illő nyitott pozíciónk, felvesszük veled a kapcsolatot.</p>
      `
    } else if (flowType === 'message') {
      userSubject = `Üzeneted megérkezett — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlContent = `
        <p style="${labelStyle}">Kapcsolatfelvétel</p>
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk.</p>
        
        <div style="${boxStyle}">
          <p style="${labelStyle}">Üzeneted</p>
          <p style="margin: 0; font-size: 16px; color: #ffffff; font-style: italic;">"${message || 'Nincs szöveges üzenet.'}"</p>
        </div>

        <p style="${pStyle}">Hamarosan átnézzük a kérdésedet, és a megadott e-mail címen válaszolunk.</p>
      `
    } else {
      userSubject = `Projekt részletek rögzítve — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést. A projekt részleteit rögzítettük.\n\nÜdvözlettel,\nA Sonaweb csapata`
      
      const htmlServicesList = services && services.length > 0
        ? `<div style="margin-bottom: 24px;">
            <p style="${labelStyle}">Érdeklődési körök</p>
            <ul style="margin: 0; padding-left: 20px; color: #ffffff; font-size: 15px; line-height: 1.6;">
              ${services.map((s: any) => `<li style="margin-bottom: 6px;"><strong>${s.category}:</strong> <span style="color: #a3a3a3;">${s.items.length > 0 ? s.items.join(', ') : 'Általános'}</span></li>`).join('')}
            </ul>
           </div>`
        : ''

      userHtmlContent = `
        <p style="${labelStyle}">Projekt indítása</p>
        <h1 style="${h1Style}">Szia ${name}!</h1>
        <p style="${pStyle}">Köszönjük a megkeresést. A projekt részleteit rögzítettük, a csapatunk hamarosan feldolgozza az adatokat.</p>
        
        <div style="${boxStyle}">
          ${htmlServicesList}
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" valign="top">
                <p style="${labelStyle}">Időzítés</p>
                <p style="margin: 0; font-size: 16px; color: #ffffff; font-weight: 500;">${timeline || 'Rugalmas'}</p>
              </td>
              <td width="50%" valign="top">
                <p style="${labelStyle}">Költségkeret</p>
                <p style="margin: 0; font-size: 16px; color: #ffffff; font-weight: 500;">${budget || 'Megbeszélés tárgya'}</p>
              </td>
            </tr>
          </table>

          ${message ? `
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #1f1f1f;">
            <p style="${labelStyle}">Kiegészítő információk</p>
            <p style="margin: 0; font-size: 15px; color: #a3a3a3; font-style: italic;">"${message}"</p>
          </div>` : ''}
        </div>

        <p style="${pStyle}">Amíg felvesszük veled a kapcsolatot, nézz szét a kiemelt munkáink között.</p>
        
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 50px;" bgcolor="#ffffff">
              <a href="https://sonaweb.hu/#work" style="${buttonStyle}">Kiemelt munkáink</a>
            </td>
          </tr>
        </table>
      `
    }

    // 2. Automatikus visszaigazolás küldése az ügyfélnek
    await resend.emails.send({
      from: 'SONAWEB. <hello@sonaweb.hu>', // <--- Cseréld ki a verified domainedre
      to: email,
      subject: userSubject,
      text: userMessageBody,
      html: generateEmailWrapper(userHtmlContent),
    })

    // 3. Belső értesítő e-mail neked (Admin - ez is dark mode-ban!)
    if (process.env.ADMIN_EMAIL) {
      const adminSubject = flowType === 'team'
        ? `[CSAPAT] Új jelentkező: ${name}`
        : flowType === 'message'
        ? `[ÜZENET] Új megkeresés: ${name}`
        : `[PROJEKT] ${name} — ${budget || 'Nincs keret'}`

      const adminHtmlContent = `
        <p style="${labelStyle}">Új beérkező lead</p>
        <h1 style="${h1Style}">${flowType.toUpperCase()}</h1>
        
        <div style="${boxStyle}; border-color: #BF2234;">
          <p style="${labelStyle}">Ügyfél adatai</p>
          <p style="margin: 0 0 8px 0; color: #ffffff;"><strong>Név:</strong> ${name}</p>
          <p style="margin: 0 0 8px 0; color: #ffffff;"><strong>E-mail:</strong> <a href="mailto:${email}" style="color: #BF2234;">${email}</a></p>
          <p style="margin: 0 0 24px 0; color: #ffffff;"><strong>Telefon:</strong> ${phone || 'Nincs megadva'}</p>

          ${timeline ? `<p style="margin: 0 0 8px 0; color: #ffffff;"><strong>Időzítés:</strong> ${timeline}</p>` : ''}
          ${budget ? `<p style="margin: 0 0 24px 0; color: #ffffff;"><strong>Keret:</strong> ${budget}</p>` : ''}
          
          ${services && services.length > 0 ? `
            <p style="${labelStyle}">Szolgáltatások</p>
            <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #a3a3a3; font-size: 14px;">
              ${services.map((s: any) => `<li style="margin-bottom: 4px;">${s.category}: ${s.items.join(', ')}</li>`).join('')}
            </ul>
          ` : ''}

          <p style="${labelStyle}">Üzenet</p>
          <p style="margin: 0; font-size: 15px; color: #a3a3a3; font-style: italic;">"${message || 'Nincs szöveges üzenet'}"</p>
        </div>

        <p style="font-size: 12px; color: #606060;">Firestore ID: ${leadRef.id}</p>
      `

      await resend.emails.send({
        from: 'Sonaweb Leads <onboarding@resend.dev>', // Ha megvan a domain, ezt is átírhatod
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
