import { FC, useCallback, useState, useMemo } from 'react';
import styled from 'styled-components';
import Song from '../../models/song';
import CastingButton from './CastingButton';
import { ALL_CAST_INST, CastingInst } from '../../models/student';
import { useEditor } from '../../contexts/editor-context';
import SongDragDropArea from './SongsDragDropArea';

interface SongCastingRowProps {
  song: Song;
  disabled: boolean;
  setActiveEdit: (activeEdit: string | null) => void;
  currentDragging: string | null;
  setCurrentDragging: (songName: string | null) => void;
}

const SongCastingRow: FC<SongCastingRowProps> = ({ song, disabled, setActiveEdit, currentDragging, setCurrentDragging }) => {
  const { currentEditingShow, setCastEdit, toolsMode, renameSong, deleteSong, reorderSong } = useEditor();
  const [editingName, setEditingName] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [nameInput, setNameInput] = useState(song.name);
  const [artistInput, setArtistInput] = useState(currentEditingShow?.singleArtist ? undefined : song.artist);
  const [dragHover, setDragHover] = useState(false);

  const getCasting = useCallback((songName: string, inst: CastingInst) => {
    if (!currentEditingShow)
      return;
    const student = currentEditingShow.cast.find(x => !!x.castings.find(casting => casting.songName === songName && casting.inst === inst));
    if (student)
      return student.name;
  }, [currentEditingShow]);

  const nameIsDupe = useMemo(() => {
    if (!currentEditingShow)
      return false;
    return currentEditingShow?.songs.filter(x => x.name !== song.name).some(x => x.name.toLowerCase() === nameInput.toLowerCase());
  }, [currentEditingShow, nameInput, song.name]);

  const handleRenameConfirm = useCallback(() => {
    renameSong(song.name, nameInput, artistInput);
    setActiveEdit(null);
    setEditingName(false);
  }, [renameSong, nameInput, artistInput, setActiveEdit, song.name]);

  const handleDeleteConfirm = useCallback(() => {
    deleteSong(song.name);
    setActiveEdit(null);
    setDeleting(false);
  }, [deleteSong, setActiveEdit, setDeleting, song.name]);

  const handleDragStart = useCallback(() => {
    setCurrentDragging(song.name);
  }, [setCurrentDragging, song.name]);

  const handleDrop = useCallback(() => {
    if (currentDragging === song.name || !currentDragging)
      return;
    reorderSong(currentDragging, song.order)
    setDragHover(false);
    setCurrentDragging(null);
  }, [reorderSong, song.name, song.order, currentDragging, setCurrentDragging]);

  return (
    <RowMain $disabled={ disabled }>
      { toolsMode && <SongDragDropArea 
        songName={ song.name }
        currentDragging={ currentDragging }
        dragHover={ dragHover }
        setDragHover={ setDragHover }
        handleDrop={ handleDrop }
      /> }
      <div>
        <SongDisplay
          $green={ editingName }
          $red={ deleting }
          draggable={ toolsMode && !editingName && !deleting }
          onDrag={ handleDragStart }
          onDragEnd={ () => setCurrentDragging(null) }
          $toolsMode={ toolsMode && !editingName && !deleting }>
          { toolsMode && !editingName && !deleting
          && <div>
            <span className='material-symbols-outlined' onClick={ () => { setEditingName(true); setActiveEdit(song.name) } } >edit</span>
            <span className='material-symbols-outlined' onClick={ () => { setDeleting(true); setActiveEdit(song.name) } } >delete</span>
          </div> }
          { editingName && <h3>Rename: </h3>}
          <h3>{ song.name }{ song.artist && ` - ${ song.artist }` }</h3>
        </SongDisplay>
        { toolsMode && (editingName || deleting) &&
          <ButtonOrange onClick={ deleting ? handleDeleteConfirm : handleRenameConfirm } $disabled={ nameIsDupe }>
            { nameIsDupe && <h3>Duplicate song name</h3> }
            { !nameIsDupe && <h3>{ deleting ? 'Delete' : 'Save' }</h3> }
          </ButtonOrange> }
        { toolsMode && deleting && <h3>&nbsp;Really delete song { song.name }?&nbsp;</h3>}
        { toolsMode && editingName
          && <div>
            <NameInput type='text' autoFocus value={ nameInput } onChange={ event => setNameInput(event.currentTarget.value) }  />
            { !currentEditingShow?.singleArtist && <NameInput type='text' autoFocus value={ artistInput } onChange={ event => setArtistInput(event.currentTarget.value) }  /> }
          </div>
        }
        { toolsMode && (editingName || deleting) && <ActionButton onClick={ () => { setEditingName(false); setDeleting(false); setActiveEdit(null) } }><h3>{ deleting ? 'Cancel' : 'Discard Changes' }</h3></ActionButton> }
        { !editingName && !deleting && ALL_CAST_INST.map(inst => <CastingButton key={ inst } assignedStudent={ getCasting(song.name, inst) } startCasting={ () => setCastEdit(song.name, inst) } />) }
      </div>
    </RowMain>
  )
}

interface RowProps {
  $disabled: boolean;
}

const RowMain = styled.div<RowProps>`
  display: flex;
  flex-direction: column;
  margin: 1px 2px;
  align-items: center;
  ${ props => props.$disabled && 'pointer-events: none; opacity: 0.5;' }

  span {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  h3 {
    margin: 0;
    color: white;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  > div {
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
  }
`;

interface SongDisplayProps {
  $green: boolean;
  $red: boolean;
  $toolsMode: boolean;
}

const SongDisplay = styled.div<SongDisplayProps>`
  display: flex;
  justify-content: space-between;
  background-color: orange;
  background-color: ${ props => props.$green && props.theme.colors.bgGreen };
  background-color: ${ props => props.$red && props.theme.colors.bgRed };
  padding: 5px 10px;
  margin: 2px;
  border-radius: 2px;
  width: 250px;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  ${ props => props.$toolsMode && 'cursor: grab;' }

  > div {
    display: flex;
    justify-content: left;
    align-items: center;
    margin: 0px 6px 0px 0px;

    > span:first-child {
      margin-right: 8px;
    }
  }
`;

const NameInput = styled.input`
  color: white;
  border: none;
  border-radius: 2px;
  margin: 2px;
  padding: 5px 10px;
  min-height: 25px;
  background-color: ${ props => props.theme.colors.bgInner3 };
  outline: none;
  font-size: 1.3rem;
`;

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  border-radius: 2px;
  margin: 2px;
  padding: 5px 10px;
  background-color: ${ props => props.theme.colors.bgInner1 };
  cursor: pointer;
`;

interface ButtonOrangeProps {
  $disabled: boolean;
}

const ButtonOrange = styled(ActionButton)<ButtonOrangeProps>`
  background-color: orange;

  ${ props => props.$disabled && 'pointer-events: none; opacity: 0.5;' }
`;

export default SongCastingRow;
