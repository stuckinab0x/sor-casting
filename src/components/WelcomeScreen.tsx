import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import { useViews } from '../contexts/views-context';
import { useProfile } from '../contexts/profile-context';

const WelcomeScreen: FC = () => {
  const { shows } = useProfile();
  const { setEditorView } = useViews();
  const { setCurrentEditingShow } = useEditor();

  const loadShow = useCallback(async (showId: string) => {
    const show = shows.find(x => x.id === showId);
    if (!show)
      return;

    setCurrentEditingShow({ ...show, setSplitIndex: Number(show.setSplitIndex) });
    setEditorView('showOverview');
    
  }, [setCurrentEditingShow, setEditorView, shows]);


  return (
    <ViewMain>
      <h1>
        Create/Edit Shows:
      </h1>
      { shows.length && <ShowsList>
        { shows.map(x => <Button key={ x.name } onClick={ () => loadShow(x.id) }>
          <h2>{ x.name }</h2>
        </Button>) }
      </ShowsList> }
      <Divider />
      <Button onClick={ () => setEditorView('newShow') }>
        <h2>Create New Show</h2>
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
  height: 15px;
  width: 100%;
  margin: 4px 0;
  border-radius: 4px;
`;

const Button = styled.div`
  display: flex;
  background-color: ${ props => props.theme.colors.accent };
  justify-content: center;
  border-radius: 4px;
  padding: 4px;
  margin: 4px 0px;
  cursor: pointer;
`;

export default WelcomeScreen;
