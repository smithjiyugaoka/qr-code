'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

export default function QRCodeGenerator() {
  const [email, setEmail] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrCodeId, setQrCodeId] = useState('')

  const generateQRCode = async () => {
    try {
      // Generate a consistent ID based on the email
      const emailHash = await hashEmail(email)
      setQrCodeId(emailHash)

      // The URL should point to your review page with the email hash
      const reviewUrl = `https://apex-reviews.com/${emailHash}`
      const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl)
      setQrCodeUrl(qrCodeDataUrl)

      // Here you would typically save or update the QR code info in your database
      console.log('Saving/Updating QR code info:', { id: emailHash, email, url: reviewUrl })

      // TODO: Implement API call to save/update QR code info
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  // Function to create a consistent hash from an email
  const hashEmail = async (email: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(email)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 10)
  }

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter employee email"
          className="px-4 py-2 border rounded-md mr-2"
        />
        <button 
          onClick={generateQRCode}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Generate QR Code
        </button>
      </div>
      {qrCodeUrl && (
        <div className="mt-4 flex flex-col items-center">
          <img src={qrCodeUrl} alt="Generated QR Code" />
          <p className="mt-2">QR Code ID: {qrCodeId}</p>
          <p>Associated Email: {email}</p>
        </div>
      )}
    </div>
  )
}