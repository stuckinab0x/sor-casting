import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useEditor } from '../../contexts/editor-context';
import SongCastingRow from './SongCastingRow';
import CastListHeader from './CastListHeader';
import LowerToolbar from './LowerToolbar';
import SongDragDropArea from './SongsDragDropArea';

const MainCastingContainer: FC = () => {
  const { currentEditingShow, currentCastEdit, reorderSong, toolsMode } = useEditor();
  const [activeSongEdit, setActiveSongEdit] = useState<string | null>(null);
  const [addingSong, setAddingSong] = useState(false);
  const [currentDragging, setCurrentDragging] = useState<string | null>('');
  const [endDragHover, setEndDragHover] = useState(false);

  const handleEndDrop = useCallback(() => {
    if (!currentDragging || !currentEditingShow)
      return;
    reorderSong(currentDragging, currentEditingShow?.songs.length)
    setEndDragHover(false);
    setCurrentDragging(null);
  }, [currentDragging, currentEditingShow, reorderSong]);

  if (currentEditingShow)
  return (
    <ContainerMain $fade={ !!currentCastEdit } >
      <CastListHeader showName={ currentEditingShow.name } disabled={ addingSong } />
      { currentEditingShow.songs.map(song => 
          <SongCastingRow
            key={ song.name }
            song={ song }
            disabled={ addingSong || (!!activeSongEdit && activeSongEdit !== song.name) }
            currentDragging={ currentDragging }
            setActiveEdit={ setActiveSongEdit } setCurrentDragging={ setCurrentDragging }
          />
      )}
      { toolsMode && <SongDragDropArea
        songName='$$last'
        currentDragging={ currentDragging }
        dragHover={ endDragHover }
        setDragHover={ setEndDragHover }
        handleDrop={ handleEndDrop }
      /> }
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
