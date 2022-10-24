import { createContext, ReactNode, useState, useReducer } from 'react'
import { Cycle, cycleReducer, ActionTypes } from '../reducers/cycles'
interface CreateCyclesDate {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassaed: (seconds: number) => void
  createNewCycle: (data: CreateCyclesDate) => void
  interruptCycle: () => void
}

interface CyclesContextProviderProps {
  children: ReactNode
}

// cria o context do cycle
export const CycleContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // usado para quardar informações mais complexas e alterar os dados
  const [cyclesState, dispatch] = useReducer(cycleReducer, {
    cycles: [],
    activeCycleId: null,
  })

  const { cycles, activeCycleId } = cyclesState
  console.log(cycles)

  // armazena os segundos que foram passados
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassaed(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  // em vez de enviar o função setCycle juntos com as tipagems basta enviar um função simples
  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
  }

  // cria um novo ciclo e salva no estado
  function createNewCycle(data: CreateCyclesDate) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })

    setamountSecondsPassed(0)

    // reset()
  }

  // interronpe o ciclo e altera o ciclo no estado
  function interruptCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CYCLE,
      payload: {
        interruptCycle,
      },
    })
  }
  return (
    <CycleContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassaed,
        interruptCycle,
        createNewCycle,
        cycles,
      }}
    >
      {/* permite que HTML seja passado como elemento filho */}
      {children}
    </CycleContext.Provider>
  )
}
