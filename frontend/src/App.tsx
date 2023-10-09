import { FC } from 'react'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import theme from './styles/Theme'
import Nav from './components/Nav'
import EditorContainer from './components/EditorContainer'
import EditorProvider from './contexts/editor-context'

const GlobalStyle = createGlobalStyle`
  html, body {
    background-color : #353535;
    margin: 0;
    display: flex;
    height: 100vh;
    flex-direction: column;
    font-family: 'Segoe UI';
  }

  body > div {
    display: flex;
    flex: 1;
  }

  span {
    user-select: none;
  }
`;

const App: FC = () => {
  return (
    <ThemeProvider theme={ theme }>
      <EditorProvider>
        <Main>
          <GlobalStyle />
          <Nav />
          <Content>
            <EditorContainer />
          </Content>
        </Main>
      </EditorProvider>
    </ThemeProvider>
  )
}

const Main = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  flex: 1;
`

const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
`;

export default App
