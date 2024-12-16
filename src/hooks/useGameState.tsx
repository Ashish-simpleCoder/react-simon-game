import { MouseEvent, useMemo, useRef, useState } from 'react'

import useGameSound from './useGameSound'
import useGameStatus from './useGameStatus'
import useCurrentLevelSequence from './useCurrentLevelSequence'
import { getRandomArbitrary } from '../lib'

export default function useGameState() {
    const [level, setLevel] = useState(1)
    const { playGameOverSound, playGameStartSound, playBoxClickSound } = useGameSound()

    const { gameStatus, setGameStatus } = useGameStatus({ onStart: () => playGameStartSound() })
    const { currentLevelClrSequence, setCurrentLevelClrSequence, currentClickIdx, setCurrentClickIdx } = useCurrentLevelSequence()

    const clrBoxes = useMemo(() => [
        { color: "red", },
        { color: "blue" },
        { color: "green" },
        { color: "yellow" },
    ], [])
    const clrBoxesRef = useRef<Map<number, HTMLDivElement>>(new Map())



    const handleClrBoxClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if (gameStatus == "toStart" || gameStatus == "overed") return

            ; (e.target as HTMLDivElement).classList.add("scale-down");
        setTimeout(() => {
            ; (e.target as HTMLDivElement).classList.remove("scale-down")
        }, 302)

        playBoxClickSound()

        const box_clr = (e.target as HTMLDivElement)?.getAttribute("data-bg")


        if (level == 1) {
            if (box_clr) {
                currentLevelClrSequence.toSequenceMatch.push(box_clr)
            }
            setTimeout(() => {
                goToNextLevel()
            }, 1000)
        } else {
            // console.log(currentLevelClrSequence.toSequenceMatch, box_clr, currentClickIdx)
            // matched sequence with index wise

            if (currentLevelClrSequence.toSequenceMatch[currentClickIdx] == box_clr) {
                // if all matched are done correctly, then increase the level
                if (currentClickIdx == currentLevelClrSequence.toSequenceMatch.length - 1) {
                    setTimeout(() => {
                        goToNextLevel()
                    }, 1000)
                    // console.log("next")
                } else {
                    setCurrentClickIdx((_val) => _val + 1)
                }
            } else {
                gameOver()
            }
        }
    }

    const gameOver = () => {
        playGameOverSound()
        setGameStatus("overed")
        setGameToInitialState()
    }

    const setGameToInitialState = () => {
        setLevel(1)
        setCurrentClickIdx(0)
        setCurrentLevelClrSequence({
            toSequenceMatch: [],
            currentMatchedSequence: []
        })
    }

    const goToNextLevel = () => {
        setLevel((_level) => _level + 1)
        setCurrentClickIdx(0)

        const { boxToAnimate, boxBg } = selectRandomBoxAndAnimate()

        if (boxToAnimate) {
            // next level sequence generation
            currentLevelClrSequence.toSequenceMatch.push(boxBg!)
            setCurrentLevelClrSequence({
                toSequenceMatch: [...currentLevelClrSequence.toSequenceMatch],
                currentMatchedSequence: []
            })
        }
    }

    const selectRandomBoxAndAnimate = () => {
        const randomIdx = getRandomArbitrary(1, 4)

        const boxToAnimate = clrBoxesRef.current.get(randomIdx)
        if (boxToAnimate) {
            boxToAnimate.classList.add("animate-box")
            setTimeout(() => {
                boxToAnimate.classList.remove("animate-box")
            }, 350)
        }

        return { boxToAnimate, boxBg: boxToAnimate?.getAttribute("data-bg") }
    }


    return { clrBoxes, handleClrBoxClick, gameStatus, level, clrBoxesRef }

}