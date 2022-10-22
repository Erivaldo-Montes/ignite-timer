import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  TaskImput,
  MinutesAmountInput,
} from './styles'
import { useEffect, useState } from 'react'

// schema de validação do zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe o nome da tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo de ter no mínimo 5 minutos')
    .max(60, 'O ciclo de ter no máximo 60 minutos'),
})

// extrai as tipagens do schema com o zod
type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  start: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // armazena os segundos que foram passados
  const [amountSecondsPassed, setamountSecondsPassed] = useState(0)

  // hook useForm
  // passa as tipagens para o useForm
  const { register, handleSubmit, watch, reset } = useForm<newCycleFormData>({
    // integra o zod com o react-hook-form
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // executa no quando um componente é renderizado e quando o valor de sua dependências muda
  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setamountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.start),
        )
      }, 1000)
    }

    // reseta o intervalo assim que um novo ciclo é iniciado
    // o retorno sempre é uma função
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

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

  // observa o input com o nome  'task' em tempo real sem renderizar
  const task = watch('task')

  const isDisabledSubmit = !task

  // varianveis do contador

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)

  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')

  const seconds = String(secondsAmount).padStart(2, '0')

  // mostra o contador no title da pagina
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar</label>
          <TaskImput
            id="task"
            list="task-suggestion"
            placeholder="Dê um nome para seu projeto"
            // retorna e insere as propriedades no elemento
            {...register('task')}
          />

          <datalist id="task-suggestion">
            <option value="projeto 1" />
            <option value="ingite" />
            <option value="lotteir" />
          </datalist>

          <label htmlFor="minutesAmout">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmout"
            placeholder="00"
            min={5}
            max={60}
            step={5}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isDisabledSubmit} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
