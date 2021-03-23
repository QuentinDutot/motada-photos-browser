import { useRef, useEffect } from 'react'

// 16 ms its time on 1 frame
const FRAME_MS = 16

/**
 * @param fn - Debounce callback.
 * @param wait - Number of milliseconds to delay.
 * @param deps - Array values that the debounce depends (like as useEffect).
 */
const useDebouncy = (fn = () => {}, wait = 1000, deps = []) => {
  const defaultWait = wait || 0
  const defaultDeps = deps || []
  const rafId = useRef(0)
  const timeStart = useRef(0)
  const callback = useRef(fn)
  const isFirstRender = useRef(true)

  const renderFrame = useRef((timeNow) => {
    // call will be after the first frame - requires subtracting 16 ms for more accurate timing.
    timeStart.current = timeStart.current || timeNow - FRAME_MS

    // call next rAF if time is not up
    if (timeNow - timeStart.current < defaultWait) {
      rafId.current = requestAnimationFrame(renderFrame.current)
      return
    }

    callback.current()
  })

  // set new callback if it updated
  useEffect(() => {
    callback.current = fn
  }, [fn])

  // call update if deps changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return () => {}
    }

    timeStart.current = 0
    rafId.current = requestAnimationFrame(renderFrame.current)

    return () => {
      cancelAnimationFrame(rafId.current)
    }
  }, defaultDeps)
}

export default useDebouncy
