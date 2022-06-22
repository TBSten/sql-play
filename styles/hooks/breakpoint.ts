import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function useBreakpoint() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    return {
        isSp: !matches,
        isPc: matches
    }
}

