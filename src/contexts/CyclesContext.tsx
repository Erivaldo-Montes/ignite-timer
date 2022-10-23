import { createContext, ReactNode, useState } from 'react'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  start: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CreateCyclesDate {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
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
  const [cycles, setCycles] = useState<Cycle[]>([])

  // armazena os segundos que foram passados
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassaed(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  // em vez de enviar o função setCycle juntos com as tipagems basta enviar um função simples
  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  // cria um novo ciclo e salva no estado
  function createNewCycle(data: CreateCyclesDate) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      start: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setamountSecondsPassed(0)

    // reset()
  }

  // interronpe o ciclo e altera o ciclo no estado
  function interruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId('')
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
      }}
    >
      {/* permite que HTML seja passado como elemento filho */}
      {children}
    </CycleContext.Provider>
  )
}
