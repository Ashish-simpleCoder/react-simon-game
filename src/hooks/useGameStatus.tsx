import { useEventListener } from 'classic-react-hooks'
import { useState } from 'react'

export default function useGameStatus() {
    const [gameStatus, setGameStatus] = useState<"overed" | "running" | "toStart">("toStart")


    useEventListener(window, "keydown", () => {
        setGameStatus("running")
    }, { shouldInjectEvent: gameStatus == "toStart" || gameStatus == "overed" })

    return { gameStatus, setGameStatus }
}