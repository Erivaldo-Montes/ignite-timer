import { HandPalm, Play } from 'phosphor-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CycleContext } from '../../contexts/CyclesContext'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { NewCycleForm } from './components/newCycleForm'
import { Countdown } from './components/countdown'
import * as zod from 'zod'

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

export function Home() {
  const { activeCycle, createNewCycle, interruptCycle } =
    useContext(CycleContext)

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

  const { handleSubmit, watch /* reset */ } = newCycleForm

  // ============================================================================

  // observa o input com o nome  'task' em tempo real sem renderizar
  const task = watch('task')

  const isDisabledSubmit = !task

  return (
    <HomeContainer>
      <form action="" /* onSubmit={handleSubmit(handleCreateNewCycle)} */>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton
            disabled={isDisabledSubmit}
            type="submit"
            // o função de criar um novo ciclo é repassada para o handle para que o useForm seja criado
            onClick={handleSubmit(createNewCycle)}
          >
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
