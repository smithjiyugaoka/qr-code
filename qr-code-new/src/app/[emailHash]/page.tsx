import { NextPage } from 'next'
import { useState, useEffect } from 'react'

interface ReviewPageProps {
  params: {
    emailHash: string
  }
}

const ReviewPage: NextPage<ReviewPageProps> = ({ params }) => {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState({
    performance: '',
    communication: '',
    teamwork: '',
    overall: '',
    comments: '',
  })

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const response = await fetch(`/api/getEmailByHash?hash=${params.emailHash}`)
        if (!response.ok) {
          throw new Error('Failed to fetch email data')
        }
        const data = await response.json()
        setEmail(data.email)
      } catch (err) {
        setError('Failed to load review data. Please try again.')
        console.error('Error fetching email data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmailData()
  }, [params.emailHash])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReviewData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/submitReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          ...reviewData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      alert('Review submitted successfully!')
      // Optionally, reset form or redirect
    } catch (err) {
      setError('Failed to submit review. Please try again.')
      console.error('Error submitting review:', err)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Employee Review</h1>
        {email ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="mb-4">Employee Email: {email}</p>

            {['performance', 'communication', 'teamwork', 'overall'].map((category) => (
              <div key={category}>
                <label className="block mb-2 capitalize">{category} Rating:</label>
                <input
                  type="number"
                  name={category}
                  value={reviewData[category]}
                  onChange={handleInputChange}
                  min="1"
                  max="5"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}

            <div>
              <label className="block mb-2">Comments:</label>
              <textarea
                name="comments"
                value={reviewData.comments}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p>No review found for this QR code.</p>
        )}
      </div>
    </div>
  )
}

export default ReviewPage