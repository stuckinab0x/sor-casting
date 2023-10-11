import { FC, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useEditor } from '../../contexts/editor-context';

interface LowerToolbarProps {
  addingSong: boolean;
  setAddingSong: (adding: boolean) => void;
}

const LowerToolbar: FC<LowerToolbarProps> = ({ addingSong, setAddingSong }) => {
  const { currentEditingShow, addSong, setEditorView } = useEditor();
  
  const [nameInput, setNameInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const handleAddSongClick = useCallback(() => {
    currentEditingShow?.singleArtist ? addSong(nameInput) : addSong(nameInput, artistInput);
    setAddingSong(false);
    setNameInput('');
    setArtistInput('');
  }, [nameInput, artistInput, addSong, currentEditingShow, setAddingSong]);

  const nameIsDupe = useMemo(() => {
    return currentEditingShow?.songs.some(x => x.name.toLowerCase() === nameInput.toLowerCase());
  }, [currentEditingShow, nameInput]);

  if (currentEditingShow)
    return (
      <ToolbarMain>
        <Button $disabled={ addingSong && (!nameInput || nameIsDupe) } onClick={ () => addingSong ? handleAddSongClick() : setAddingSong(true) }>
          { nameIsDupe ? <h3>Song already exists</h3>
          : <h3>{ addingSong ? 'Save and Add Song' : 'Add Song' }</h3>
          }
        </Button>
        { !addingSong
          && <Button onClick ={ () => setEditorView('editCast') }>
            <h3>Add/Edit Cast Members</h3>
          </Button>
        }
        { addingSong 
          && <>
            <NameInput value={ nameInput } placeholder='&nbsp;enter a song name' onChange={ event => setNameInput(event.currentTarget.value) } />
            { !currentEditingShow?.singleArtist && <NameInput value={ artistInput } onChange={ event => setArtistInput(event.currentTarget.value) } placeholder='&nbsp;enter an artist name' /> }
            <DiscardButton onClick={ () => setAddingSong(false) } $disabled={ nameIsDupe }>
              <h3>Discard</h3>
            </DiscardButton>
          </>
        }
      </ToolbarMain>
    )
}

const ToolbarMain = styled.div`
  display: flex;
  margin: 1px 2px;
  align-items: center;

  background-color: ${ props => props.theme.colors.bgInner2 };
`;

interface ButtonProps {
  $disabled?: boolean;
}

const Button = styled.div<ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  margin: 2px;
  padding: 5px 10px;
  background-color: orange;
  width: 250px;
  cursor: pointer;

  ${ props => props.$disabled && 'opacity: 0.7;' }
  ${ props => props.$disabled && 'pointer-events: none;' }

  > h3 {
    margin: 0;
    color: white;
    border-radius: 2px;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
`
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

const DiscardButton = styled(Button)`
  background-color: ${ props => props.theme.colors.bgInner1 };
  width: initial;
`;


export default LowerToolbar;
