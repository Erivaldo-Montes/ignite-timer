import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycle/reducer'
import {
  addNewCycleAction,
  interruptCycleAction,
  markCurrentCycleAsFineshedAction,
  ActionTypes,
} from '../reducers/cycle/action'
import { differenceInSeconds } from 'date-fns'
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycle: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJson = localStorage.getItem(
        '@ignite-timer:state-cycle-1.0.0',
      )

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      }

      return { cycles: [], activeCycleId: null }
    },
  )

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:state-cycle-1.0.0', stateJson)
  }, [cyclesState])

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // armazena os segundos que foram passados
  const [amountSecondsPassed, setamountSecondsPassed] = useState(() => {
    if (activeCycleId) {
      const secondsDifference = differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate),
      )
    }

    return 0
  })

  function setSecondsPassaed(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  // em vez de enviar o função setCycle juntos com as tipagems basta enviar um função simples
  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFineshedAction())
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

    dispatch(addNewCycleAction(newCycle))

    setamountSecondsPassed(0)

    // reset()
  }

  // interronpe o ciclo e altera o ciclo no estado
  function interruptCycle() {
    dispatch(interruptCycleAction())
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
