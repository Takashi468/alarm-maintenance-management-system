export const SIMULATOR_STATUSES = ["Running", "Stop", "Alarm", "Maintenance"] as const

export type SimulatorStatus = (typeof SIMULATOR_STATUSES)[number]
