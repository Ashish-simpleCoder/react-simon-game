import { ComponentProps } from 'react'

export default function ClrBox(props:ComponentProps<"div"> & {boxRef?: (node:HTMLDivElement) =>void}) {
    const {boxRef, ...rest} = props
    return (
        <div className={`clr-box w-40 h-40 rounded-lg cursor-pointer`} {...rest} ref={(node) => boxRef?.(node!)}></div>
    )
}