import { useState } from 'react';

export default function useCurrentLevelSequence() {
    const [currentLevelClrSequence, setCurrentLevelClrSequence] = useState({
        toSequenceMatch: [] as Array<string>,
        currentMatchedSequence: [] as Array<string>
    })

    const [currentClickIdx, setCurrentClickIdx] = useState(0)


    return { currentLevelClrSequence, setCurrentLevelClrSequence, currentClickIdx, setCurrentClickIdx }
}