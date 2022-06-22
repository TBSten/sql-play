import { Box } from '@mui/material';
import CodeEditor, { useCodeEditor } from 'component/CodeEditor';
import Layout from 'component/layout/Layout';
import { LC } from 'component/layout/LayoutContent';
import Sidebar from 'component/Top/Sidebar';
import { SuggestBar, useSuggest } from 'component/Top/SuggestBar';
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from "jotai/utils";
import { atoms } from 'lib/client/atom';
import { createPage } from 'lib/client/page';
import { key } from 'lib/client/storage';
import { useBreakpoint } from 'styles/hooks/breakpoint';
import { columnFlex, parentFull } from 'styles/util';

type Props = {
}
const page = createPage<Props>()

const codeAtom = atomWithStorage(key("local-code"), `
-- SQLを入力して下さい

`.trimStart())
const Top = page.component(() => {
  const [code, setCode] = useAtom(codeAtom)
  const isSidebarShow = useAtomValue(atoms.show.sidebar)
  const {
    state,
    view,
    props,
  } = useCodeEditor()
  const selection = state?.selection.ranges[0]
  const suggestions = useSuggest({
    mode: isSidebarShow ? "execute" : "edit",
    view,
    selection: selection ?? null,
  })
  const { isPc } = useBreakpoint()
  return (
    <Layout>
      <Box display={isPc ? "flex" : "block"} height="100%" position="relative">
        <LC sx={{ minHeight: "100%", height: "100%", }} disablePadding>
          <Box sx={{ ...parentFull, ...columnFlex, }} >

            <Box flexGrow={1} pb={10}>
              <CodeEditor
                code={code}
                onChange={code => setCode(code)}
                {...props}
              />
            </Box>

            <Sidebar code={code} />

            <SuggestBar suggestions={suggestions} />

          </Box>
        </LC>
      </Box>
    </Layout >
  )
})

export default Top

// export const getServerSideProps = page.ssr({
//   get: async (ctx) => {
//     return {
//       props: {
//       }
//     }
//   },
//   // login: true,
// })

/* --- Sidebar --- */

// interface SidebarProps {
// }
// const Sidebar: FC<SidebarProps> = () => {
//   const [show, setShow] = useAtom(sidebarShowAtom)
//   const theme = useTheme()
//   const handleClose = () => {
//     setShow(false)
//   }
//   const { isPc, isSp } = useBreakpoint()
//   return (
//     <Box position="absolute"
//       right={0} top={isPc ? 0 : undefined} bottom={isSp ? 0 : undefined}
//       maxWidth={isPc ? "40vw" : "100vw"} maxHeight={isSp ? "60vh" : ""} width={isSp ? "100%" : undefined} height="100%"
//       overflow="auto"
//     >
//       {show &&
//         <LC cardContentProps={{ sx: { border: `solid 2px ${theme.palette.grey[300]}`, overflow: "auto", pb: 10, } }}>
//           {Array(1000).fill("content ")}
//           <Box pb={5} />
//         </LC>}

//     </Box>
//   );
// }
