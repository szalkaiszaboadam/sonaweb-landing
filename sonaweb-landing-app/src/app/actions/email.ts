'use server'

import { Resend } from 'resend'

// A Vercel Environment Variables közé majd fel kell venned a RESEND_API_KEY-t!
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLeadEmail(data: any) {
  try {
    
    // Szép magyar formátum a számokhoz
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(amount)
    }

    const htmlContent = `
      <h2>Szia ${data.client.name.split(' ')[0]}!</h2>
      <p>Köszönjük, hogy megkerestél minket. A válaszaid alapján a rendszerünk elkészítette az előzetes költségkalkulációt a projektedre.</p>
      
      <h3>Becsült költségkeret:</h3>
      <ul>
        ${data.quote.oneTime > 0 ? `<li><strong>Egyszeri díj:</strong> ${formatPrice(data.quote.oneTime)} -tól</li>` : ''}
        ${data.quote.monthly > 0 ? `<li><strong>Havi díj:</strong> ${formatPrice(data.quote.monthly)} / hó -tól</li>` : ''}
      </ul>

      <p>Hamarosan felvesszük veled a kapcsolatot a megadott telefonszámodon (${data.client.phone || 'Nem adtál meg számot'}) vagy e-mailben, hogy pontosítsuk a részleteket!</p>
      
      <p>Üdvözlettel,<br/>A Sonaweb Csapata</p>
    `

    // AZ E-MAIL KÜLDÉS PARAMÉTEREI
    // AZ E-MAIL KÜLDÉS PARAMÉTEREI
    const { data: emailData, error } = await resend.emails.send({
      from: 'Sonaweb <onboarding@resend.dev>', 
      to: [data.client.email], // Teszteléskor IDE IS tv3adam@gmail.com-ot kell beírnod a formon!
      // bcc: KIVETTÜK, mert teszt módban ez okozta a blokkolást!
      subject: 'Az árajánlatod elkészült | SONAWEB',
      html: htmlContent,
    })

    if (error) {
      console.error("Resend hiba:", error)
      return { success: false, error }
    }

    return { success: true, data: emailData }
  } catch (error) {
    console.error("Server Action hiba:", error)
    return { success: false, error }
  }
}