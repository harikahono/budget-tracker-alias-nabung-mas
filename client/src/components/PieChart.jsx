"use client"

import { useEffect, useRef } from "react"

const PieChart = ({ data, colors, totalLabel }) => {
  const canvasRef = useRef(null)
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) / 2 - 10

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw pie segments
    let startAngle = 0
    data.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.amount) / total
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.fillStyle = colors[index]
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      startAngle = endAngle
    })

    // Draw center circle
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fill()

    // Add total text
    ctx.fillStyle = "#2d3748"
    ctx.font = "bold 16px Poppins"
    ctx.textAlign = "center"
    ctx.fillText(totalLabel, centerX, centerY - 10)

    ctx.fillStyle = "#00bfa6"
    ctx.font = "bold 20px Poppins"
    ctx.fillText(
      total.toLocaleString("id-ID", { style: "currency", currency: "IDR" }),
      centerX,
      centerY + 20
    )
  }, [data, colors, total, totalLabel])

  return (
    <div className="pie-chart-container">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  )
}

export default PieChart