import { For, If } from 'classic-react-components'
import { useEventListener } from 'classic-react-hooks'
import { MouseEvent, useRef, useState } from 'react'

import { getRandomArbitrary } from './lib'
import ClrBox from './components/ClrBox'
import useGameStatus from './hooks/useGameStatus'

export default function App() {
  const [clrBoxes, setClrBoxes] = useState([
    { color: "red", },
    { color: "blue" },
    { color: "green" },
    { color: "yellow" },
  ])
  const clrBoxesRef = useRef<Map<number, HTMLDivElement>>(new Map())
  const [level, setLevel] = useState(1)
  const {gameStatus, setGameStatus} = useGameStatus()
  const [currentLevelClrSequence, setCurrentLevelClrSequence] = useState({
    toSequenceMatch: [] as Array<string>,
    currentMatchedSequence: [] as Array<string>
  })
  const [currentClickIdx, setCurrentClickIdx] = useState(0)
  console.log(currentLevelClrSequence)

  useEventListener(window, "keydown", () => {
    setGameStatus("running")
  }, { shouldInjectEvent: gameStatus == "toStart" || gameStatus == "overed" })

  console.log(level)

  const handleClrBoxClick = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (gameStatus == "toStart" || gameStatus == "overed") return

    const box_clr = (e.target as HTMLDivElement)?.getAttribute("data-bg")


    if (level == 1) {
      if (box_clr) {
        currentLevelClrSequence.toSequenceMatch.push(box_clr)
      }
      setCurrentLevelClrSequence({
        toSequenceMatch: [...currentLevelClrSequence.toSequenceMatch],
        currentMatchedSequence: []
      })
      setLevel((_level) => _level + 1)
      setCurrentClickIdx(0) // reset to 0 on level change

      // animate random box on level change
      const randomIdx = getRandomArbitrary(1, 4)
      const boxToAnimate = clrBoxesRef.current.get(randomIdx)
      if (boxToAnimate) {
        boxToAnimate.classList.add("animate-box")
        setTimeout(() => {
          boxToAnimate.classList.remove("animate-box")
        }, 350)
        // boxToAnimate.addEventListener("animationend", () => boxToAnimate.classList.remove("animate-box"))

        // next level sequence generation
        currentLevelClrSequence.toSequenceMatch.push(boxToAnimate.getAttribute("data-bg")!)
        setCurrentLevelClrSequence({
          toSequenceMatch: [...currentLevelClrSequence.toSequenceMatch],
          currentMatchedSequence: []
        })
      }
    } else {
      // matched sequence with index wise
      currentLevelClrSequence.currentMatchedSequence.push(box_clr!)
      console.log(currentLevelClrSequence.toSequenceMatch, box_clr, currentClickIdx)

      if (currentLevelClrSequence.toSequenceMatch[currentClickIdx] == box_clr) {
        // if all matched are done correctly, then increase the level
        if (currentClickIdx == currentLevelClrSequence.toSequenceMatch.length - 1) {
          console.log("next")
          goToNextLevel()
        } else {
          setCurrentClickIdx((_val) => _val + 1)
        }
      } else {
        // game over
        setGameStatus("overed")
        setLevel(1)
        setCurrentClickIdx(0)
        setCurrentLevelClrSequence({
          toSequenceMatch: [],
          currentMatchedSequence: []
        })
      }
    }
  }

  const goToNextLevel = () => {
    setLevel((_level) => _level + 1)
    setCurrentClickIdx(0)
    const randomIdx = getRandomArbitrary(1, 4)
    console.log({ randomIdx })
    const boxToAnimate = clrBoxesRef.current.get(randomIdx)
    if (boxToAnimate) {
      boxToAnimate.classList.add("animate-box")
      setTimeout(() => {
        boxToAnimate.classList.remove("animate-box")
      }, 350)
      // boxToAnimate.addEventListener("animationend", () => boxToAnimate.classList.remove("animate-box"))

      // next level sequence generation
      currentLevelClrSequence.toSequenceMatch.push(boxToAnimate.getAttribute("data-bg")!)
      setCurrentLevelClrSequence({
        toSequenceMatch: [...currentLevelClrSequence.toSequenceMatch],
        currentMatchedSequence: []
      })
    }
  }

  // console.log(currentLevelClrSequence)



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