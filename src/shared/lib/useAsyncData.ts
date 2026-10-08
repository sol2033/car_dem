import { useEffect, useState } from 'react'

export function useAsyncData<T, A>(load: (arg: A) => Promise<T>, arg: A) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    load(arg)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [load, arg, attempt])

  function reload() {
    setLoading(true)
    setError('')
    setAttempt(attempt + 1)
  }

  return { data, loading, error, reload }
}
