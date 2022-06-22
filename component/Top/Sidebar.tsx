import { Box, Button, Drawer, useTheme } from "@mui/material"
import { LC } from "component/layout/LayoutContent"
import { useAtom } from "jotai"
import { atoms } from "lib/client/atom"
import { analyzeSql } from "lib/client/sql"
import { FC } from "react"
import { useBreakpoint } from "styles/hooks/breakpoint"

export interface SidebarProps {
    code?: string;
}
const PcSidebar: FC<SidebarProps> = (props) => {
    const [show, setShow] = useAtom(atoms.show.sidebar)
    const theme = useTheme()
    const handleClose = () => {
        setShow(false)
    }
    const { isPc, isSp } = useBreakpoint()
    if (!show) return <></>
    return (
        <Box position="absolute"
            right={0} top={isPc ? 0 : undefined} bottom={isSp ? 0 : undefined}
            width={isPc ? "60vw" : "100%"} height="100%"
            overflow="auto"
        >
            <LC disablePadding disableMargin cardContentProps={{ sx: { border: `solid 2px ${theme.palette.grey[300]}`, overflow: "auto", pb: 10, } }}>
                {show &&
                    <Box p={2}>
                        <SidebarContent {...props} />
                    </Box>
                }
            </LC >
        </Box >
    );
}
const SpSidebar: FC<SidebarProps> = (props) => {
    const [show, setShow] = useAtom(atoms.show.sidebar)
    return (
        <Drawer open={show} anchor="bottom" onClose={() => setShow(false)}>
            <LC>
                <SidebarContent {...props} />
            </LC>
        </Drawer>
    )
}

const SidebarContent: FC<SidebarProps> = ({ code = "none !", }) => {
    const handleAnalyze = () => {
        analyzeSql(code)
    }
    return (
        <Box>
            SQLAnalyzer
            <Button onClick={handleAnalyze}>analyze</Button>
            TableViewer
            ExecuteLogViewer
        </Box>
    )
}

const Sidebar: FC<SidebarProps> = (props) => {
    const { isPc } = useBreakpoint()
    return isPc ? <PcSidebar {...props} /> : <SpSidebar {...props} />
}
export default Sidebar

