import { useCallback, useState } from "react";

export function useOpen(init: boolean = false) {
    const [isOpen, setIsOpen] = useState(init)
    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(true), [])
    const toggle = useCallback(() => setIsOpen(p => !p), [])
    return {
        isOpen,
        setIsOpen,
        open,
        close,
        toggle,
    }
}
