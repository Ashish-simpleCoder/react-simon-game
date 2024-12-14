import { useEventListener } from 'classic-react-hooks'
import { useState } from 'react'

export default function useGameStatus({ onStart }: { onStart?: () => void }) {
    const [gameStatus, setGameStatus] = useState<"overed" | "running" | "toStart">("toStart")

    useEventListener(window, "keydown", () => {
        setGameStatus("running")
        onStart?.()
    }, { shouldInjectEvent: gameStatus == "toStart" || gameStatus == "overed" })


    return { gameStatus, setGameStatus }
}