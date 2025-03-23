"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Check } from "lucide-react"

// Button component based on the design system
interface ButtonProps {
  onClick: (e: React.MouseEvent) => void
  radius?: "sm" | "md" | "lg"
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "outline"
  children?: React.ReactNode
  icon?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  radius = "md",
  size = "md",
  variant = "primary",
  children,
  icon,
  style,
  className,
}) => {
  // Styles based on the design system
  const baseStyles = "font-medium transition-colors focus:outline-none"

  const radiusStyles = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
  }

  const sizeStyles = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  }

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${radiusStyles[radius]} ${sizeStyles[size]} ${variantStyles[variant]} inline-flex items-center justify-center ${className || ""}`}
      style={style}
    >
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  )
}

// Definir los tipos de causas
interface Cause {
  id: number
  name: string
  value: number
  color: string
  activeColor: string
  description: string
}

// Datos de las causas
const causes: Cause[] = [
  {
    id: 1,
    name: "War in Ukraine",
    value: 120,
    color: "#F5F5F5",
    activeColor: "#FF6B6B",
    description: "Support humanitarian aid for civilians affected by the ongoing conflict in Ukraine.",
  },
  {
    id: 2,
    name: "Hamas War",
    value: 85,
    color: "#E0E0E0",
    activeColor: "#4ECDC4",
    description: "Provide emergency relief to families displaced by the conflict in Gaza and Israel.",
  },
  {
    id: 3,
    name: "Flood in Bahía Blanca",
    value: 150,
    color: "#CCCCCC",
    activeColor: "#FFD166",
    description: "Help rebuild communities devastated by severe flooding in Bahía Blanca, Argentina.",
  },
  {
    id: 4,
    name: "Hunger in Haiti",
    value: 95,
    color: "#B3B3B3",
    activeColor: "#6A0572",
    description: "Deliver food and nutrition support to combat the hunger crisis in Haiti.",
  },
  {
    id: 5,
    name: "Lack of Drinking Water in Ethiopia",
    value: 110,
    color: "#9E9E9E",
    activeColor: "#1A535C",
    description: "Fund clean water projects in drought-affected regions of Ethiopia.",
  },
]

// Componente de gráfico de torta estático con texto cambiante
const StaticPieChartWithText = ({ selectedCauses }: { selectedCauses: number[] }) => {
  const [messageIndex, setMessageIndex] = useState(0)
  const [key, setKey] = useState(0) // Para forzar la re-renderización de la animación
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mensajes que se mostrarán cíclicamente
  const messages = [
    "Find your cause",
    "War in Ukraine",
    "Hamas War",
    "Flood in Bahía Blanca",
    "Hunger in Haiti",
    "Lack of Drinking Water in Ethiopia",
  ]

  // Duración de cada mensaje en milisegundos
  const getDuration = (index: number) => {
    return index === 0 ? 2000 : 1500
  }

  // Calcular el total para los porcentajes
  const total = causes.reduce((sum, entry) => sum + entry.value, 0)

  // Calcular ángulos para cada sección
  const getAngles = () => {
    let startAngle = 0
    return causes.map((entry) => {
      const angle = (entry.value / total) * 360
      const result = {
        start: startAngle,
        end: startAngle + angle,
        mid: startAngle + angle / 2,
      }
      startAngle += angle
      return result
    })
  }

  const angles = getAngles()

  // Animación cíclica para cambiar el mensaje
  useEffect(() => {
    const nextMessage = () => {
      setMessageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % messages.length
        setKey((k) => k + 1) // Forzar re-renderización de la animación

        // Programar el siguiente cambio según la duración del mensaje actual
        timerRef.current = setTimeout(nextMessage, getDuration(newIndex))

        return newIndex
      })
    }

    // Iniciar el primer temporizador
    timerRef.current = setTimeout(nextMessage, getDuration(0))

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [messages.length])

  // Convertir ángulos a radianes
  const degToRad = (deg: number) => (deg * Math.PI) / 180

  return (
    <div className="flex flex-col items-center">
      {/* Gráfico de torta estático con efecto 3D */}
      <div className="relative mb-8">
        <svg width={320} height={320}>
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Gráfico de torta estático */}
          <g>
            {causes.map((entry, index) => {
              const angle = angles[index]
              const startAngleRad = degToRad(angle.start)
              const endAngleRad = degToRad(angle.end)

              // Calcular puntos para el path del sector
              const startX = 160 + Math.cos(startAngleRad - Math.PI / 2) * 120
              const startY = 160 + Math.sin(startAngleRad - Math.PI / 2) * 120

              // Determinar si el arco es mayor a 180 grados
              const largeArcFlag = angle.end - angle.start > 180 ? 1 : 0

              // Crear el path para el sector circular
              const pathData = [
                `M 160 160`,
                `L ${startX} ${startY}`,
                `A 120 120 0 ${largeArcFlag} 1 ${160 + Math.cos(endAngleRad - Math.PI / 2) * 120} ${160 + Math.sin(endAngleRad - Math.PI / 2) * 120}`,
                `Z`,
              ].join(" ")

              // Determinar si esta causa está seleccionada
              const isSelected = selectedCauses.includes(entry.id)

              return (
                <path
                  key={`sector-${index}`}
                  d={pathData}
                  fill={isSelected ? entry.activeColor : entry.color}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  filter="url(#shadow)"
                />
              )
            })}
          </g>

          {/* Círculo central para efecto 3D */}
          <circle cx="160" cy="160" r="60" fill="#FFFFFF" opacity="0.2" />
        </svg>

        {/* Sombra para efecto 3D */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.1) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Texto cambiante */}
      <div className="h-8 mb-8">
        <p key={`message-${key}`} className="text-sm font-medium text-gray-700 animate-fadeIn">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  )
}

// Componente para la animación "+1 USD"
const PlusOneAnimation = ({ x, y }: { x: number; y: number }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="absolute animate-float pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        color: "#00AB11",
        fontWeight: "bold",
      }}
    >
      +1 USD
    </div>
  )
}

// Componente de la página de votación
const VotingPage = ({
  selectedCauses,
  setSelectedCauses,
  onBack,
}: {
  selectedCauses: number[]
  setSelectedCauses: (causes: number[]) => void
  onBack: () => void
}) => {
  const [animations, setAnimations] = useState<{ id: number; x: number; y: number }[]>([])

  const handleVote = (id: number, e: React.MouseEvent) => {
    // Alternar la selección de la causa
    setSelectedCauses(
      selectedCauses.includes(id) ? selectedCauses.filter((causeId) => causeId !== id) : [...selectedCauses, id],
    )

    // Crear animación en la posición del clic
    const rect = e.currentTarget.getBoundingClientRect()
    setAnimations((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: rect.x - 20,
        y: rect.y - 30,
      },
    ])
  }

  return (
    <div className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Select a Cause</h1>
        <button onClick={onBack} className="text-blue-600">
          Back
        </button>
      </div>

      <div className="space-y-4">
        {causes.map((cause) => {
          const isSelected = selectedCauses.includes(cause.id)

          return (
            <div key={cause.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{cause.name}</h3>
                <p className="text-sm font-light text-gray-600">{cause.description}</p>
              </div>
              <div className="ml-4 relative">
                <Button
                  icon={<Check />}
                  onClick={(e) => handleVote(cause.id, e)}
                  radius="md"
                  className="w-12 h-12 p-0" // Hacer el botón cuadrado
                  style={{
                    backgroundColor: isSelected ? "#00AB11" : "",
                    borderColor: isSelected ? "#00AB11" : "",
                  }}
                  variant={isSelected ? "primary" : "outline"}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Renderizar animaciones */}
      {animations.map((anim) => (
        <PlusOneAnimation key={anim.id} x={anim.x} y={anim.y} />
      ))}
    </div>
  )
}

// Main screen component
export default function MobileScreen() {
  const [showVotingPage, setShowVotingPage] = useState(false)
  const [selectedCauses, setSelectedCauses] = useState<number[]>([])

  // Function for the button
  function handleVote() {
    setShowVotingPage(true)
  }

  // Function to go back to main screen
  function handleBack() {
    setShowVotingPage(false)
  }

  return (
    <div className="mx-auto bg-white font-sans" style={{ width: "1080px", height: "1920px", maxWidth: "100%" }}>
      {!showVotingPage ? (
        <>
          {/* Header with wallet address */}
          <header className="p-6">
            <div className="text-right text-sm font-medium text-gray-700 font-manrope">0x0123SD32</div>
          </header>

          {/* Main content */}
          <main className="px-6 flex flex-col items-center">
            {/* Main amount display */}
            <div className="mb-8 text-center w-full">
              <h1 className="mb-4 text-4xl font-bold font-poppins">3 USD</h1>
              {/* Shorter, subtle divider line */}
              <div className="mx-auto h-px w-24 bg-gray-300 mb-4"></div>
              <p className="text-lg font-manrope">Staked: 1,6 USD</p>
            </div>

            {/* Pie chart with changing text */}
            <div className="flex justify-center mb-8">
              <StaticPieChartWithText selectedCauses={selectedCauses} />
            </div>

            {/* Vote button - centered with just enough width for the text */}
            <div className="flex justify-center mb-8">
              <Button onClick={handleVote} radius="md" size="md" variant="primary">
                Votar
              </Button>
            </div>
          </main>
        </>
      ) : (
        <VotingPage selectedCauses={selectedCauses} setSelectedCauses={setSelectedCauses} onBack={handleBack} />
      )}
    </div>
  )
}

