import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminDb } from '@/lib/firebase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

// --- HTML E-MAIL SABLON GENERÁTOR (Kliensnek) ---
function generateUserEmailHtml(name: string, contentHtml: string) {
  // Cseréld ki a domain-t a sajátodra! Fontos: e-mailben a .png formátum a legbiztosabb!
  const logoUrl = 'https://sonaweb.hu/sonaweb-logo-white.png' 

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 40px 20px; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #222222; border-radius: 12px; overflow: hidden;">
      <!-- Header / Logo -->
      <tr>
        <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #1a1a1a;">
          <img src="${logoUrl}" alt="SONAWEB" width="160" style="display: block; margin: 0 auto; outline: none; text-decoration: none;" />
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td style="padding: 40px; line-height: 1.6; font-size: 16px; color: #e5e5e5;">
          <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: #ffffff;">Szia ${name}!</h2>
          ${contentHtml}
          <p style="margin: 32px 0 0 0; font-size: 15px; color: #a3a3a3;">
            Üdvözlettel,<br>
            <strong style="color: #ffffff;">A Sonaweb csapata</strong>
          </p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding: 24px 40px; background-color: #0a0a0a; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #222222;">
          © ${new Date().getFullYear()} Sonaweb. Minden jog fenntartva.<br>
          <a href="https://sonaweb.hu" style="color: #666666; text-decoration: underline;">sonaweb.hu</a>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

// --- HTML E-MAIL SABLON GENERÁTOR (Adminnak) ---
function generateAdminEmailHtml(title: string, detailsHtml: string, leadId: string) {
  return `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px; color: #111827;">
    <h2 style="color: #111827; margin-top: 0;">${title}</h2>
    <div style="background-color: #ffffff; padding: 24px; border-radius: 6px; border: 1px solid #e5e7eb;">
      ${detailsHtml}
    </div>
    <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
      Rendszer azonosító: <code>${leadId}</code>
    </p>
  </div>
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

    // Sima szöveges és HTML formázások előkészítése
    let userSubject = ''
    let userMessageBody = '' // Fallback text (ha a kliens nem tölt be HTML-t)
    let userHtmlBody = ''    // A szép design

    if (flowType === 'team') {
      userSubject = `Jelentkezésed rögzítettük — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a jelentkezésedet a Sonaweb csapatába.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlBody = `
        <p style="margin: 0 0 16px 0;">Köszönjük a jelentkezésedet a Sonaweb csapatába.</p>
        <p style="margin: 0 0 16px 0;">Megkaptuk a bemutatkozásodat és az elérhetőségeidet:</p>
        <div style="background-color: #1a1a1a; padding: 16px; border-left: 3px solid #BF2234; border-radius: 0 6px 6px 0; margin-bottom: 24px; font-style: italic; color: #a3a3a3;">
          "${message || 'Nem adtál meg külön leírást.'}"
        </div>
        <p style="margin: 0;">Átnézzük a profilodat, és amennyiben van nyitott, hozzád illő lehetőségünk, felvesszük veled a kapcsolatot a megadott e-mail címen.</p>
      `
    } else if (flowType === 'message') {
      userSubject = `Üzeneted megérkezett — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk.\n\nÜdvözlettel,\nA Sonaweb csapata`
      userHtmlBody = `
        <p style="margin: 0 0 16px 0;">Köszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk:</p>
        <div style="background-color: #1a1a1a; padding: 16px; border-left: 3px solid #BF2234; border-radius: 0 6px 6px 0; margin-bottom: 24px; font-style: italic; color: #a3a3a3;">
          "${message || ''}"
        </div>
        <p style="margin: 0;">Hamarosan átnézzük a kérdésedet, és e-mailben válaszolunk.</p>
      `
    } else {
      userSubject = `Projekt részletek rögzítve — ${name}`
      userMessageBody = `Szia ${name}!\n\nKöszönjük a megkeresést. A projekt részleteit rögzítettük.\n\nÜdvözlettel,\nA Sonaweb csapata`
      
      const htmlServicesList = services && services.length > 0
        ? `<ul style="margin: 0 0 24px 0; padding-left: 20px; color: #ffffff;">
            ${services.map((s: any) => `<li style="margin-bottom: 8px;"><strong>${s.category}:</strong>${s.items.length > 0 ? s.items.join(', ') : 'Általános'}</li>`).join('')}
           </ul>`
        : ''

      userHtmlBody = `
        <p style="margin: 0 0 24px 0;">Köszönjük a megkeresést. A projekt részleteit rögzítettük a rendszerünkben:</p>
        
        ${htmlServicesList}

        <div style="background-color: #1a1a1a; border: 1px solid #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #a3a3a3;"><strong>Időzítés:</strong> <span style="color: #ffffff;">${timeline || 'Rugalmas'}</span></p>
          <p style="margin: 0; font-size: 15px; color: #a3a3a3;"><strong>Költségkeret:</strong> <span style="color: #ffffff;">${budget || 'Megbeszélés tárgya'}</span></p>
        </div>

        ${message ? `
        <p style="margin: 0 0 8px 0; color: #a3a3a3; font-size: 14px;">Üzenet / Kiegészítés:</p>
        <div style="background-color: #1a1a1a; padding: 16px; border-radius: 6px; margin-bottom: 24px; color: #e5e5e5; font-size: 15px;">
          "${message}"
        </div>` : ''}

        <p style="margin: 0;">Hamarosan átnézzük a specifikációt, és felvesszük veled a kapcsolatot.</p>
      `
    }

    // 2. Automatikus visszaigazolás küldése az ügyfélnek
    await resend.emails.send({
      from: 'SONAWEB. <hello@sonaweb.hu>', // <--- Cseréld ki a verified domainedre
      to: email,
      subject: userSubject,
      text: userMessageBody, // Fallback
      html: generateUserEmailHtml(name, userHtmlBody), // Gyönyörű dizájn
    })

    // 3. Belső értesítő e-mail neked (Admin)
    if (process.env.ADMIN_EMAIL) {
      const adminSubject = flowType === 'team'
        ? `[CSAPAT] Új jelentkező: ${name}`
        : flowType === 'message'
        ? `[ÜZENET] Új megkeresés: ${name}`
        : `[PROJEKT] ${name} — ${budget || 'Nincs keret'}`

      const adminHtmlBody = `
        <p><strong>Név:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Telefon:</strong> ${phone || 'Nincs megadva'}</p>
        ${timeline ? `<p><strong>Időzítés:</strong> ${timeline}</p>` : ''}
        ${budget ? `<p><strong>Keret:</strong> ${budget}</p>` : ''}
        ${services && services.length > 0 ? `<p><strong>Szolgáltatások:</strong></p><ul>${services.map((s: any) => `<li>${s.category}: ${s.items.join(', ')}</li>`).join('')}</ul>` : ''}
        <p><strong>Üzenet:</strong></p>
        <blockquote style="border-left: 4px solid #e5e7eb; padding-left: 16px; color: #4b5563; background: #f3f4f6; padding: 12px; border-radius: 4px;">
          ${message || 'Nincs szöveges üzenet'}
        </blockquote>
      `

      await resend.emails.send({
        from: 'Sonaweb Leads <onboarding@resend.dev>', // Ezt is átírhatod, ha már megvan a domained
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: `Új megkeresés érkezett: ${name}`,
        html: generateAdminEmailHtml(adminSubject, adminHtmlBody, leadRef.id),
      })
    }

    return NextResponse.json({ success: true, id: leadRef.id })
  } catch (error) {
    console.error('Lead hiba:', error)
    return NextResponse.json({ error: 'Hiba a feldolgozás során.' }, { status: 500 })
  }
}
