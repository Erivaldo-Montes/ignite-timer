import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  TaskImput,
  MinutesAmountInput,
} from './styles'

// schema de validação do zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe o nome da tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo de ter no mínimo 5 minutos')
    .max(60, 'O ciclo de ter no máximo 60 minutos'),
})

export function Home() {
  // hook useForm
  const { register, handleSubmit, watch } = useForm({
    // integra o zod com o react-hook-form
    resolver: zodResolver(newCycleFormValidationSchema),
  })

  function handleCreateNewCycle(data: any) {
    console.log(data)
  }

  // observa o input com o nome  'task' em tempo real sem renderizar
  const task = watch('task')

  const isDisabledSubmit = !task

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
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isDisabledSubmit} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
