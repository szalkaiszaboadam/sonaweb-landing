import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('inquiries')
      .orderBy('createdAt', 'desc')
      .get()

    const leads = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
      }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Fetch leads error:', error)
    return NextResponse.json({ error: 'Nem sikerült lekérni a megkereséseket.' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'Hiányzó paraméterek.' }, { status: 400 })
    }

    await adminDb.collection('inquiries').doc(id).update({ status })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: 'Hiba a státusz frissítésekor.' }, { status: 500 })
  }
}
