
import React, { useState } from 'react'

export const ClickSpark = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [sparks, setSparks] = useState<Array<{ id: number, x: number, y: number }>>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newSpark = { id: Date.now(), x, y }
    setSparks(prev => [...prev, newSpark])
    
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => spark.id !== newSpark.id))
    }, 1000)
  }

  return (
    <div className={`relative inline-block ${className}`} onClick={handleClick}>
      {children}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{ left: spark.x, top: spark.y }}
        >
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <div className="absolute inset-0 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }} />
        </div>
      ))}
    </div>
  )
}
