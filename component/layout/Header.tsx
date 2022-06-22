import { Edit, PlayArrow } from "@mui/icons-material";
import { AppBar, Toolbar, Tooltip } from "@mui/material";
import IBtn from "component/util/short/IBtn";
import { useAtom } from "jotai";
import { atoms } from "lib/client/atom";
import { FC } from "react";

interface HeaderProps {
}
const Header: FC<HeaderProps> = () => {
    const [, setShowSidebar] = useAtom(atoms.show.sidebar)
    return (
        <AppBar position="static" color="inherit">
            <Toolbar variant="dense">
                <Tooltip title="SQLを編集する">
                    <IBtn color="inherit" size="small" >
                        <Edit />
                    </IBtn>
                </Tooltip>
                <Tooltip title="SQLを実行する">
                    <IBtn color="inherit" size="small" onClick={() => setShowSidebar(true)}>
                        <PlayArrow />
                    </IBtn>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
