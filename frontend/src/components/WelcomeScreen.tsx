import { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import { useViews } from '../contexts/views-context';

interface ShowNameAndId {
  id: string;
  name: string;
}

const WelcomeScreen: FC = () => {
  const { setEditorView } = useViews();
  const { setCurrentEditingShow } = useEditor();

  const [showNamesAndIds, setShowNamesAndIds] = useState<ShowNameAndId[] | undefined>();

  useEffect(() => {
    const requestShowNames = async () => {
      try {
        const res = await fetch('/api/shows');
        const shows: ShowNameAndId[] = await res.json();
          setShowNamesAndIds(shows);
      } catch (error) {
        console.log(error);
      }
    }
    requestShowNames();
  }, []);

  const loadShowRequest = useCallback(async (showId: string) => {
    try {
      const res = await fetch(`/api/shows/${ showId }`);
      const show = await res.json();
      
      setCurrentEditingShow({ ...show, setSplitIndex: Number(show.setSplitIndex) });
      setEditorView('showOverview');
    } catch (error) {
      console.log(error);
    }
  }, [setCurrentEditingShow, setEditorView]);


  return (
    <ViewMain>
      <h1>
        Create/Edit Shows:
      </h1>
      { showNamesAndIds && <ShowsList>
        { showNamesAndIds.map(x => <Button key={ x.name } onClick={ () => loadShowRequest(x.id) }>
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
  background-color: orange;
  justify-content: center;
  border-radius: 4px;
  padding: 4px;
  margin: 4px 0px;
  cursor: pointer;
`;

export default WelcomeScreen;
