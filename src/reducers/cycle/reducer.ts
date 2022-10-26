import { ActionTypes } from './action'
import { produce } from 'immer'
export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      // immer permite mudar os estados do react como se fossem mutaveis
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.INTERRUPT_CYCLE: {
      // return {
      //   ...state,
      //   cycles: state.cycles.map((cycle) => {
      //     return { ...cycle, interruptedDate: new Date() }
      //   }),
      //   activeCycleId: null,
      // }

      // immer ===========
      const cycleInterruptedIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (cycleInterruptedIndex < 0) {
        return null
      }

      return produce(state, (draft) => {
        draft.cycles[cycleInterruptedIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    }
    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const cycleFineshedIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (cycleFineshedIndex < 0) {
        return null
      }

      return produce(state, (draft) => {
        draft.cycles[cycleFineshedIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }
    default:
      return state
  }
}
