import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { emailHash } = req.body

      const client = await clientPromise
      const db = client.db()

      const result = await db.collection('qrcodes').updateOne(
        { qrCodeData: `https://apex-reviews.com/${emailHash}` },
        { $inc: { scanCount: 1 } }
      )

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'QR code not found' })
      }

      res.status(200).json({ message: 'Scan tracked successfully' })
    } catch (error) {
      console.error('Error tracking scan:', error)
      res.status(500).json({ message: 'Error tracking scan', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}