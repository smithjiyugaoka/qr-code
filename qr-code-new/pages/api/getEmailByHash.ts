import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { hash } = req.query

      if (!hash || typeof hash !== 'string') {
        return res.status(400).json({ message: 'Invalid hash parameter' })
      }

      const client = await clientPromise
      const db = client.db()

      const qrCode = await db.collection('qrcodes').findOne({ qrCodeData: `https://apex-reviews.com/${hash}` })

      if (!qrCode) {
        return res.status(404).json({ message: 'QR code not found' })
      }

      res.status(200).json({ email: qrCode.employeeEmail })
    } catch (error) {
      console.error('Error fetching email by hash:', error)
      res.status(500).json({ message: 'Error fetching email', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}