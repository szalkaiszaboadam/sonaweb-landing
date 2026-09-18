'use server'

import { Resend } from 'resend'

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'message', string>>
}

export const initialContactState: ContactFormState = { status: 'idle' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get('name') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const budget = String(formData.get('budget') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const services = formData.getAll('services').map(String)

  const errors: ContactFormState['errors'] = {}
  if (!name) errors.name = 'Add meg a neved.'
  if (!email) {
    errors.email = 'Add meg az email címed.'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Adj meg egy érvényes email címet.'
  }
  if (!message) errors.message = 'Írj pár mondatot a projektről.'

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors, message: 'Nézd át még egyszer a kiemelt mezőket.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !to) {
    console.error(
      'Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set, cannot deliver the message.'
    )
    return {
      status: 'error',
      message: 'A küldés jelenleg nem elérhető. Írj nekünk közvetlenül emailben.',
    }
  }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'SONAWEB kérdőív <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `Új ajánlatkérés – ${name}${company ? ` (${company})` : ''}`,
      text: [
        `Név: ${name}`,
        company && `Cég: ${company}`,
        `Email: ${email}`,
        phone && `Telefon: ${phone}`,
        services.length ? `Miben segíthetünk: ${services.join(', ')}` : '',
        budget && `Becsült költségkeret: ${budget}`,
        '',
        'Üzenet:',
        message,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    if (error) {
      console.error('Resend returned an error', error)
      return {
        status: 'error',
        message: 'Hiba történt a küldés közben. Próbáld újra, vagy írj nekünk emailben.',
      }
    }
  } catch (err) {
    console.error('Failed to send contact form email', err)
    return {
      status: 'error',
      message: 'Hiba történt a küldés közben. Próbáld újra, vagy írj nekünk emailben.',
    }
  }

  return { status: 'success', message: 'Köszönjük! Hamarosan jelentkezünk egy ajánlattal.' }
}
