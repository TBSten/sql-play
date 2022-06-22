import { Box } from "@mui/material";
import { FC } from "react";
import { ChildrenProps } from "types/util";
import Header from "./Header";

interface LayoutProps extends ChildrenProps {
}
const Layout: FC<LayoutProps> = ({ children, }) => {
    return (
        <Box sx={{
            width: "100vw", height: "100vh",
            display: "flex", flexDirection: "column",
        }}>
            <Header />
            <Box sx={{ flexGrow: 1, height: "100%", overflow: "auto" }}>
                {children}
            </Box>
        </Box>
    );
}

export default Layout;
