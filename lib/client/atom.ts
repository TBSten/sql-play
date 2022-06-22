import { atom } from "jotai"

export const atoms = {
    show: {
        // sidebar: atomWithStorage<boolean>(key("atoms.show.sidebar"), false),
        sidebar: atom(false),
    }
}


