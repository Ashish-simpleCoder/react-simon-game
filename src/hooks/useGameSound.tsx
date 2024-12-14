import GameOverSound from "../assets/sounds/game-over.mp3"
import GameStartSound from "../assets/sounds/game-start.mp3"
import BoxClick from "../assets/sounds/box-click.mp3"

export default function useGameSound() {

    const playGameOverSound = async () => {
        const audio = new Audio(GameOverSound)
        await audio.play()
    }
    const playGameStartSound = async () => {
        const audio = new Audio(GameStartSound)
        await audio.play()
    }
    const playBoxClickSound = async () => {
        const audio = new Audio(BoxClick)
        // making to jump on 0.4 because of click sound
        audio.currentTime = 0.4
        await audio.play()
    }

    return { playGameOverSound, playGameStartSound, playBoxClickSound }
}