import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db()

      const analyticsData = await db.collection('qrcodes').aggregate([
        {
          $lookup: {
            from: 'reviews',
            localField: 'employeeEmail',
            foreignField: 'email',
            as: 'reviews'
          }
        },
        {
          $project: {
            email: '$employeeEmail',
            scanCount: { $ifNull: ['$scanCount', 0] },
            reviewCount: { $size: '$reviews' },
            lastReviewedBy: { $arrayElemAt: ['$reviews.reviewedBy', -1] }
          }
        }
      ]).toArray()

      res.status(200).json(analyticsData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      res.status(500).json({ message: 'Error fetching analytics data', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}