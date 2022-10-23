import { HandPalm, Play } from 'phosphor-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useState } from 'react'
import { NewCycleForm } from './components/newCycleForm'
import { Countdown } from './components/countdown'
import * as zod from 'zod'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  start: Date
  interruptedDate?: Date
  finishedDate?: Date
}
interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassaed: (seconds: number) => void
}

// schema de validação do zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe o nome da tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo de ter no mínimo 5 minutos')
    .max(60, 'O ciclo de ter no máximo 60 minutos'),
})

// extrai as tipagens do schema com o zod
type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export const CycleContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])

  // armazena os segundos que foram passados
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // hook useForm
  // passa as tipagens para o useForm
  const newCycleForm = useForm<newCycleFormData>({
    // integra o zod com o react-hook-form
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  // ============================================================================

  function handleCreateNewCycle(data: newCycleFormData) {
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

    reset()
  }

  function setSecondsPassaed(seconds: number) {
    setamountSecondsPassed(seconds)
  }

  // interronpe o ciclo e altera o ciclo no estado
  function handleInterruptCycle() {
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

  // observa o input com o nome  'task' em tempo real sem renderizar
  const task = watch('task')

  const isDisabledSubmit = !task

  return (
    <HomeContainer>
      <form action="" /* onSubmit={handleSubmit(handleCreateNewCycle)} */>
        <CycleContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassaed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CycleContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton
            disabled={isDisabledSubmit}
            type="submit"
            // o função de criar um novo ciclo é repassada para o handle para que o useForm seja criado
            onClick={handleSubmit(handleCreateNewCycle)}
          >
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
