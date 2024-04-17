"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlgorithmOptions, MoveOptions, applyMove, shufflePuzzle, solvePuzzle, undoMove } from "@/lib/eight-puzzle-solver";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";

interface PuzzleBoardProps {
    initialState: string
}

const SHUFFLE_MOVES = 10
const FINAL_STATE = '123456780'

const handleSolveBoard = (initialState: string, algorithm: AlgorithmOptions) => {
    console.log(`Solving the board with Algorithm ${algorithm}`)
    let steps = solvePuzzle(initialState, '123456780', algorithm)
    console.log(steps)
    return steps
}

const handleNextStep = (steps: MoveOptions[], currentStep: number, state: string) => {
    console.table({step: steps[currentStep], currentStep, state})
    if (currentStep < steps.length) {
        return applyMove(state, steps[currentStep])
    }
    return state
}

const handlePrevStep = (steps: MoveOptions[], currentStep: number, state: string) => {
    console.table({step: steps[currentStep], currentStep, state})
    if (currentStep > 0) {
        return undoMove(state, steps[currentStep - 1])
    }
    return state
}

export default function PuzzleBoard({ initialState }: PuzzleBoardProps) {
    const [algorithm, setAlgorithm] = useState<AlgorithmOptions>("A-STAR")
    const [state, setState] = useState(initialState)
    const [steps, setSteps] = useState<MoveOptions[] | null>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [autoPlay, setAutoPlay] = useState(false)

    useEffect(() => {
        if(state === FINAL_STATE) {
            setSteps([])
            setCurrentStep(0)
            setAutoPlay(false)
        }
    }, [state])

    useEffect(() => {
        if(autoPlay && steps && steps.length > 0) {
            const timer = setTimeout(() => {
                setState(handleNextStep(steps, currentStep, state))
                setCurrentStep(currentStep + 1)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [autoPlay, steps, currentStep, state])

    return (
        <div className="flex flex-col gap-16 items-center border border-border rounded-md p-8 relative">
            <AlgorithmSelection onChange={setAlgorithm} value={algorithm} />
            <Board initialState={state}/>
            
            {(steps && steps.length > 0) ? (
                <>
                    <div className="flex justify-center absolute right-4 top-4">
                        <span className="text-4xl text-foreground/80 font-bold">{currentStep+1}</span>
                        <span className="text-4xl text-foreground/30 font-bold">/</span>
                        <span className="text-4xl text-foreground/30 font-bold">{steps.length+1}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button disabled={currentStep === 0} onClick={() => {setState(handlePrevStep(steps, currentStep, state)); setCurrentStep(currentStep - 1)}} variant={"outline"} >Back</Button>
                        <Button disabled={currentStep === steps.length} onClick={() => {setState(handleNextStep(steps, currentStep, state)); setCurrentStep(currentStep + 1)}} variant={"outline"} >Next</Button>
                        <Button onClick={() => setState(FINAL_STATE) } variant={"outline"} >Reset</Button>
                        <Button onClick={() => setAutoPlay(!autoPlay)} variant={"outline"} >{autoPlay ? "Stop" : "Play"}</Button>
                    </div>
                </>
            ) : (
                <div className="flex gap-4">
                    <Button disabled={state === FINAL_STATE} onClick={() => setSteps(handleSolveBoard(state, algorithm))} variant={"outline"} >Solve</Button>
                    <Button onClick={() => setState(shufflePuzzle(state, SHUFFLE_MOVES))} variant={"outline"} >Shuffle</Button>
                </div>
            )}
        </div>
    )

}

interface AlgorithmSelectionProps {
    value: AlgorithmOptions
    onChange: Dispatch<SetStateAction<AlgorithmOptions>>
}

function AlgorithmSelection({onChange, value}: AlgorithmSelectionProps) {
    return (
            <Select onValueChange={(value:AlgorithmOptions) => onChange(value)} value={value}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select the algorithm" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Algorithms</SelectLabel>
                        <SelectItem value="A-STAR">A*</SelectItem>
                        <SelectItem value="DEEP">Deep Search</SelectItem>
                        <SelectItem value="WIDE">Wide Search</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
    )
}

interface BoardProps {
    initialState: string
}

function Board({ initialState }: BoardProps) {
    return (
        <div className="grid gap-2 grid-cols-3 place-items-center w-80">
            {initialState.split("").map((value, index) => (
                <Tile key={index} value={parseInt(value)} />
            ))}
        </div>
    )
}

interface TileProps {
    value: number
}

function Tile({ value }: TileProps) {
    return (
        value === 0 ?
            (
                <div className="rounded-md border border-border bg-foreground/10 size-20 flex items-center justify-center text-xl font-bold"> </div>
            ) : (
                <div className="rounded-md border border-border bg-background/50 size-20 flex items-center justify-center text-xl font-bold">{value}</div>
            )
    )
}