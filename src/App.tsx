import { For, If } from 'classic-react-components'

import ClrBox from './components/ClrBox'
import useGameState from './hooks/useGameState'

export default function App() {
  const { clrBoxes, handleClrBoxClick, gameStatus, level, clrBoxesRef } = useGameState()
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