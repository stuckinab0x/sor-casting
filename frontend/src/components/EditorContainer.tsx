import { FC } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import NewShowView from './NewShowView';
import NewCastView from './NewCastView';
import NewSongsView from './NewSongsView';
import ShowOverview from './ShowOverview';
import WelcomeScreen from './WelcomeScreen';
import CastMemberView from './CastMemberView';
import ProfilesView from './ProfilesView';

const EditorContainer: FC = () => {
  const { editorView } = useEditor();
  
  return (
  <ContainerMain>
    { editorView === 'profiles' && <ProfilesView /> }
    { editorView === 'welcome' && <WelcomeScreen /> }
    { editorView === 'newShow' && <NewShowView /> }
    { editorView === 'newShowCast' && <NewCastView /> }
    { editorView === 'newShowSongs' && <NewSongsView /> }
    { editorView === 'showOverview' && <ShowOverview /> }
    { editorView === 'editCast' && <CastMemberView /> }
  </ContainerMain>
)
  }

const ContainerMain = styled.div`
  display: flex;
  background-color: ${ props => props.theme.colors.bgInner1 };
  border-radius: 10px;
  box-shadow: 4px 4px 15px 2px rgba(0, 0, 0, 0.5);
  padding: 15px 20px;
`;

export default EditorContainer;
