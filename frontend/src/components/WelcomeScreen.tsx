import { FC } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';

const WelcomeScreen: FC = () => {
  const { setEditorView } = useEditor();

  return (
    <ViewMain>
      <h1>
        Create/Edit Shows:
      </h1>
      <ShowsList>
        <Button>
          <h2>Summer of Love*</h2>
        </Button>
        <Button>
          <h2>Genesis*</h2>
        </Button>
      </ShowsList>
      <Divider />
      <Button onClick={ () => setEditorView('newShow') }>
        <h2>New Show</h2>
      </Button>
    </ViewMain>
  )
}

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;

  h1, h2, h3, h4 {
    margin: 0 0 4px 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
`;

const ShowsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  display: flex;
  background-color: ${ props => props.theme.colors.bgInner3 };
  height: 30px;
  width: 100%;
  margin: 4px 0;
  border-radius: 4px;
`;

const Button = styled.div`
  display: flex;
  background-color: orange;
  justify-content: center;
  border-radius: 4px;
  padding: 4px;
  margin: 4px 0px;
  cursor: pointer;
`;

export default WelcomeScreen;
