import { FormContainer, MinutesAmountInput, TaskImput } from './styles'
import { useContext } from 'react'
import { CycleContext } from '../../../../contexts/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  // obtem a variavel pelo contextAPI definido no pai
  const { activeCycle } = useContext(CycleContext)

  // obtem o função pelo context do react-hook-form
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar</label>
      <TaskImput
        id="task"
        list="task-suggestion"
        disabled={!!activeCycle}
        placeholder="Dê um nome para seu projeto"
        // retorna e insere as propriedades no elemento
        {...register('task')}
      />

      <datalist id="task-suggestion">
        <option value="projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmout">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmout"
        placeholder="00"
        max={60}
        min={5}
        step={5}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
