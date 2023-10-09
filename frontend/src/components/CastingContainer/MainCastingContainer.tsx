import { FC, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../../contexts/editor-context';
import SongCastingRow from './SongCastingRow';
import CastListHeader from './CastListHeader';
import LowerToolbar from './LowerToolbar';

const MainCastingContainer: FC = () => {
  const { currentEditingShow, currentCastEdit } = useEditor();
  const [activeSongEdit, setActiveSongEdit] = useState<string | null>(null);
  const [addingSong, setAddingSong] = useState(false);

  if (currentEditingShow)
  return (
    <ContainerMain $fade={ !!currentCastEdit } >
      <CastListHeader showName={ currentEditingShow.name } disabled={ addingSong } />
      { currentEditingShow.songs.map(song => <SongCastingRow key={ song.name } song={ song } disabled={ addingSong || (!!activeSongEdit && activeSongEdit !== song.name) } setActiveEdit={ setActiveSongEdit } />)}
      <LowerToolbar addingSong={ addingSong } setAddingSong={ setAddingSong } />
    </ContainerMain>
  )
}

interface ContainerProps {
  $fade: boolean;
}

const ContainerMain = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 2px;
  margin: 2px 2px 16px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);

  ${ props => props.$fade && 'opacity: 0.5;' }
  ${ props => props.$fade && 'pointer-events: none;' }
  background-color: ${ props => props.theme.colors.bgInner2 };
`;

export default MainCastingContainer;
