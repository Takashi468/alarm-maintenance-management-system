import { describe, expect, test } from "bun:test"
import { parseMachineFields } from "./validation"

function formData(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) fd.set(key, value)
  return fd
}

describe("parseMachineFields", () => {
  test("returns values when all fields are valid", () => {
    const result = parseMachineFields(
      formData({
        machine_id: "M-001",
        machine_name: "Press A",
        machine_type: "Press",
        location: "Line 1",
        status: "Running",
      })
    )

    expect(result.fieldErrors).toEqual({})
    expect(result.values).toEqual({
      machine_id: "M-001",
      machine_name: "Press A",
      machine_type: "Press",
      location: "Line 1",
      status: "Running",
    })
  })

  test("flags required fields that are empty or whitespace", () => {
    const result = parseMachineFields(
      formData({
        machine_id: "  ",
        machine_name: "",
        machine_type: "Press",
        location: "Line 1",
        status: "Running",
      })
    )

    expect(result.values).toBeUndefined()
    expect(result.fieldErrors.machine_id).toBeDefined()
    expect(result.fieldErrors.machine_name).toBeDefined()
    expect(result.fieldErrors.machine_type).toBeUndefined()
  })

  test("rejects an invalid status", () => {
    const result = parseMachineFields(
      formData({
        machine_id: "M-001",
        machine_name: "Press A",
        machine_type: "Press",
        location: "Line 1",
        status: "Broken",
      })
    )

    expect(result.values).toBeUndefined()
    expect(result.fieldErrors.status).toBe("Select a valid status.")
  })

  test("trims whitespace around text fields", () => {
    const result = parseMachineFields(
      formData({
        machine_id: "  M-002  ",
        machine_name: "  Press B  ",
        machine_type: "Press",
        location: "Line 2",
        status: "Stop",
      })
    )

    expect(result.values?.machine_id).toBe("M-002")
    expect(result.values?.machine_name).toBe("Press B")
  })
})
