import { Typography } from "@mui/material";
import { FC } from "react";
import { ChildrenProps } from "types/util";

interface LayoutTitleProps extends ChildrenProps {
}
const LayoutTitle: FC<LayoutTitleProps> = ({ children }) => {
    return (
        <Typography variant="h3" component="h2">{children}</Typography>
    );
}

export default LayoutTitle;

export const LTitle = LayoutTitle
