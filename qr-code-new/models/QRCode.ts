import mongoose from 'mongoose'

const QRCodeSchema = new mongoose.Schema({
  employeeEmail: {
    type: String,
    required: true,
    unique: true,
  },
  qrCodeData: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.QRCode || mongoose.model('QRCode', QRCodeSchema)