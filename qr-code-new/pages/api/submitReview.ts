import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, performance, communication, teamwork, overall, comments, reviewedBy } = req.body

      if (!email || !reviewedBy) {
        return res.status(400).json({ message: 'Email and reviewer username are required' })
      }

      const client = await clientPromise
      const db = client.db()

      const result = await db.collection('reviews').insertOne({
        email,
        performance: Number(performance),
        communication: Number(communication),
        teamwork: Number(teamwork),
        overall: Number(overall),
        comments,
        reviewedBy,
        createdAt: new Date(),
      })

      res.status(201).json({ message: 'Review submitted successfully', id: result.insertedId })
    } catch (error) {
      console.error('Error submitting review:', error)
      res.status(500).json({ message: 'Error submitting review', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}