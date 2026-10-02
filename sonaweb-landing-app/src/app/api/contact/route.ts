import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { adminDb } from '@/lib/firebase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, phone, message, services, timeline, budget, type } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Név és e-mail kötelező.' }, { status: 400 })
    }

    const flowType = type || 'project'
    const createdAt = new Date()

    // 1. Mentés a Firestore adatbázisba (mindhárom típus ide kerül)
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

    // Szolgáltatások kigyűjtése
    const servicesListText = services && services.length > 0
      ? services.map((s: { category: string; items: string[] }) => 
          `• ${s.category}: ${s.items.length > 0 ? s.items.join(', ') : 'Általános'}`
        ).join('\n')
      : ''

    // 2. Automatikus visszaigazolás a felhasználónak a típus alapján
    let userSubject = ''
    let userMessageBody = ''

    if (flowType === 'team') {
      userSubject = `Jelentkezésed rögzítettük — ${name}`
      userMessageBody = `Szia ${name}!

Köszönjük a jelentkezésedet a Sonaweb csapatába.

Megkaptuk a bemutatkozásodat és az elérhetőségeidet:
"${message || 'Nem adtál meg külön leírást.'}"

Átnézzük a profilodat, és amennyiben van nyitott, hozzád illő lehetőségünk, felvesszük veled a kapcsolatot a megadott e-mail címen.

Üdvözlettel,
A Sonaweb csapata`
    } else if (flowType === 'message') {
      userSubject = `Üzeneted megérkezett — ${name}`
      userMessageBody = `Szia ${name}!

Köszönjük a megkeresést, az üzeneted sikeresen megérkezett hozzánk:

"${message || ''}"

Hamarosan átnézzük a kérdésedet, és e-mailben válaszolunk.

Üdvözlettel,
A Sonaweb csapata`
    } else {
      // Projekt típus
      userSubject = `Projekt részletek rögzítve — ${name}`
      userMessageBody = `Szia ${name}!

Köszönjük a megkeresést. A projekt részleteit rögzítettük a rendszerünkben:

${servicesListText ? `${servicesListText}\n` : ''}Időzítés: ${timeline || 'Rugalmas'}
Költségkeret: ${budget || 'Megbeszélés tárgya'}
${message ? `\nÜzenet:\n"${message}"\n` : ''}
Hamarosan átnézzük a specifikációt, és felvesszük veled a kapcsolatot.

Üdvözlettel,
A Sonaweb csapata`
    }

    await resend.emails.send({
      from: 'SONAWEB. <hello@sonaweb.hu>',
      to: email,
      subject: userSubject,
      text: userMessageBody,
    })

    // 3. Belső értesítő e-mail neked (Admin)
    if (process.env.ADMIN_EMAIL) {
      const adminSubject = flowType === 'team'
        ? `[CSAPAT JELENTKEZÉS] ${name}`
        : flowType === 'message'
        ? `[ÚJ KÉRDÉS] ${name}`
        : `[ÚJ PROJEKT] ${name} — ${budget || 'Nincs keret'}`

      await resend.emails.send({
        from: 'Sonaweb Leads <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: `Típus: ${flowType === 'team' ? 'Csapat jelentkezés' : flowType === 'message' ? 'Közvetlen üzenet' : 'Projekt ajánlatkérés'}
Név: ${name}
E-mail: ${email}
Telefon: ${phone || 'Nincs megadva'}
${timeline ? `Időzítés: ${timeline}\n` : ''}${budget ? `Költségkeret: ${budget}\n` : ''}${servicesListText ? `\nSzolgáltatások:\n${servicesListText}\n` : ''}
Üzenet:
${message || 'Nincs szöveges üzenet'}

Azonosító: ${leadRef.id}`,
      })
    }

    return NextResponse.json({ success: true, id: leadRef.id })
  } catch (error) {
    console.error('Lead hiba:', error)
    return NextResponse.json({ error: 'Hiba a feldolgozás során.' }, { status: 500 })
  }
}
