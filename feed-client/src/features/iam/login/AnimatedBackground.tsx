"use client"

import {ReactElement, useEffect, useState} from "react"
import {CircleIcon, HeartIcon, RocketIcon, SparklesIcon, StarIcon, ZapIcon} from "lucide-react"

type AnimatedIcon = {
    id: number
    icon: ReactElement;
    x: number
    y: number
    size: number
    speed: number
    rotation: number
    rotationSpeed: number
    opacity: number
}

export function AnimatedBackground() {
    const [icons, setIcons] = useState<AnimatedIcon[]>([])

    useEffect(() => {
        // Create random icons
        const newIcons: AnimatedIcon[] = []
        const iconComponents = [
            <StarIcon key="star" className="text-yellow-300" />,
            <HeartIcon key="heart" className="text-pink-300" />,
            <ZapIcon key="zap" className="text-purple-300" />,
            <SparklesIcon key="sparkles" className="text-blue-300" />,
            <RocketIcon key="rocket" className="text-green-300" />,
            <CircleIcon key="circle" className="text-orange-300" />,
        ]

        for (let i = 0; i < 15; i++) {
            newIcons.push({
                id: i,
                icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 10 + 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.1,
            })
        }

        setIcons(newIcons)

        // Animation loop
        const interval = setInterval(() => {
            setIcons((prevIcons) =>
                prevIcons.map((icon) => {
                    // Update position based on speed
                    let newX = icon.x + 0.05 * (Math.random() - 0.5)
                    let newY = icon.y + 0.05 * (Math.random() - 0.5)

                    // Keep within bounds
                    if (newX < 0) newX = 100
                    if (newX > 100) newX = 0
                    if (newY < 0) newY = 100
                    if (newY > 100) newY = 0

                    // Update rotation
                    const newRotation = (icon.rotation + icon.rotationSpeed) % 360

                    return {
                        ...icon,
                        x: newX,
                        y: newY,
                        rotation: newRotation,
                    }
                }),
            )
        }, 50)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {icons.map((icon) => (
                <div
                    key={icon.id}
                    className="absolute transition-all duration-[3000ms] ease-in-out"
                    style={{
                        left: `${icon.x}%`,
                        top: `${icon.y}%`,
                        transform: `rotate(${icon.rotation}deg)`,
                        opacity: icon.opacity,
                        width: `${icon.size}px`,
                        height: `${icon.size}px`,
                    }}
                >
                    {icon.icon}
                </div>
            ))}
        </div>
    )
}
