import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'
import QRCode from '../../models/QRCode'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { employeeEmail, qrCodeData } = req.body

      const client = await clientPromise
      const db = client.db()

      const result = await db.collection('qrcodes').insertOne({
        employeeEmail,
        qrCodeData,
        createdAt: new Date(),
      })

      res.status(201).json({ message: 'QR Code saved successfully', id: result.insertedId })
    } catch (error) {
      console.error('Error saving QR Code:', error)
      res.status(500).json({ message: 'Error saving QR Code', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}