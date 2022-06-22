import { Box, BoxProps, Card, CardContent, CardContentProps } from "@mui/material";
import { FC } from "react";
import { parentFull } from "styles/util";
import { ChildrenProps } from "types/util";

interface LayoutContentProps extends ChildrenProps, BoxProps {
    cardContentProps?: CardContentProps;
    disablePadding?: boolean;
    disableMargin?: boolean;
}

const LayoutContent: FC<LayoutContentProps> = ({ children, sx, cardContentProps, disablePadding = false, disableMargin = false, ...other }) => {
    const { sx: cardContentSx, ..._cardContentProps } = cardContentProps ?? {};
    return (
        <Box sx={{ p: disableMargin ? 0 : 0.5, ...parentFull, ...sx }} {...other}>
            <Card
                component="section" sx={{ m: 0, ...parentFull, overflow: "auto", }}
            >
                <CardContent sx={{ ...parentFull, ...cardContentSx, ...(disablePadding ? { p: 0, } : {}) }} {..._cardContentProps}>
                    {children}
                </CardContent>
            </Card>
        </Box>
    );
}

export default LayoutContent;

export const LC = LayoutContent

