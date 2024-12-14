import { For, If } from 'classic-react-components'
import { MouseEvent, useRef, useState } from 'react'

import ClrBox from './components/ClrBox'

import useGameStatus from './hooks/useGameStatus'
import useCurrentLevelSequence from './hooks/useCurrentLevelSequence'
import { getRandomArbitrary } from './lib'
import useGameSound from './hooks/useGameSound'

export default function App() {
  const [level, setLevel] = useState(1)
  const { playGameOverSound, playGameStartSound, playBoxClickSound } = useGameSound()

  const { gameStatus, setGameStatus } = useGameStatus({ onStart: () => playGameStartSound() })
  const { currentLevelClrSequence, setCurrentLevelClrSequence, currentClickIdx, setCurrentClickIdx } = useCurrentLevelSequence()

  const [clrBoxes] = useState([
    { color: "red", },
    { color: "blue" },
    { color: "green" },
    { color: "yellow" },
  ])
  const clrBoxesRef = useRef<Map<number, HTMLDivElement>>(new Map())



  const handleClrBoxClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (gameStatus == "toStart" || gameStatus == "overed") return

    ;(e.target as HTMLDivElement).classList.add("scale-down");
    setTimeout(()=>{
      ;(e.target as HTMLDivElement).classList.remove("scale-down")
    },302)

    playBoxClickSound()

    const box_clr = (e.target as HTMLDivElement)?.getAttribute("data-bg")


    if (level == 1) {
      if (box_clr) {
        currentLevelClrSequence.toSequenceMatch.push(box_clr)
      }
      setTimeout(() =>{
        goToNextLevel()
      },1000)
    } else {
      // console.log(currentLevelClrSequence.toSequenceMatch, box_clr, currentClickIdx)
      // matched sequence with index wise

      if (currentLevelClrSequence.toSequenceMatch[currentClickIdx] == box_clr) {
        // if all matched are done correctly, then increase the level
        if (currentClickIdx == currentLevelClrSequence.toSequenceMatch.length - 1) {
          setTimeout(()=>{
            goToNextLevel()
          },1000)
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


  return (
    <div className='bg-blue-950 h-screen'>

      <div className='text-center pt-10'>
        <If condition={gameStatus == "toStart"}>
          <p className='text-3xl'>Press a key to start</p>
        </If>
        <If condition={gameStatus == "running"}>
          <p className='text-3xl'>Level {level}</p>
        </If>
        <If condition={gameStatus == "overed"}>
          <p className='text-3xl'>Game overed, press any key to start!!</p>
        </If>
      </div>


      <div className='grid place-content-center w-1/2 mx-auto pt-16 gap-10' style={{ gridTemplateColumns: "auto auto" }}>
        <For data={clrBoxes}>
          {(box, idx) => {
            return (
              <ClrBox onClick={handleClrBoxClick} boxRef={(node) => { clrBoxesRef.current.set(idx + 1, node!) }} key={box.color} data-idx={idx} data-bg={box.color} style={{ backgroundColor: box.color }}></ClrBox>
            )
          }}
        </For>
      </div>
    </div>
  )
}