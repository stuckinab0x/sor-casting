import { FC, SetStateAction, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import InputUpdate from '../models/input-update';
import { createInputs } from '../utils';
import Song from '../models/song';

const NewSongsView: FC = () => {
  const { currentEditingShow, newShowStatus, setNewShowStatus, setCurrentEditingShow, setEditorView } = useEditor();
  const [songInputs, setSongInputs] = useState<InputUpdate[]>(createInputs(20));
  const [artistInputs, setArtistInputs] = useState<InputUpdate[]>(createInputs(20));

  const handleInputChange = useCallback((index: number, input: HTMLInputElement, arraySetter: React.Dispatch<SetStateAction<InputUpdate[]>>) => {
    arraySetter(oldState => {
      const newInputs = [...oldState];
      newInputs[index] = { ...newInputs[index], value: input.value };
      return newInputs;
    });
  }, []);

  const addSongs = useCallback(() => {
    if (!currentEditingShow)
      return;
    let songs: Song[] = songInputs.map((x, i) => ({ name: x.value, artist: artistInputs[i].value })).filter(x => x.name);
    if (currentEditingShow.singleArtist)
      songs = songs.map(x => ({ name: x.name }))
    const newShow = { ...currentEditingShow };
    newShow.songs = [...songs];
    setCurrentEditingShow(newShow);
    if (newShowStatus === 'castWasAdded') {
      setEditorView('showOverview');
      setNewShowStatus(undefined);
    }
    else {
      setNewShowStatus('songsWereAdded');
      setEditorView('newShowCast');
    }
  }, [songInputs, artistInputs, currentEditingShow, setCurrentEditingShow, newShowStatus, setNewShowStatus, setEditorView]);

  const addAnotherInput = useCallback(() => {
    setSongInputs(oldState => [...oldState, { value: '', id: oldState.length }]);
    setArtistInputs(oldState => [...oldState, { value: '', id: oldState.length }]);
  }, []);

  if (currentEditingShow)
    return (
      <ViewMain>
        <h2>
          { currentEditingShow.name }: Songs
        </h2>
        <SongInputsContainer>
          <InputsColumn>
            <h2>Song Name</h2>
            { songInputs.map((x, i) => <Input type='text' $songInput={ !currentEditingShow.singleArtist } key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setSongInputs) } />) }
          </InputsColumn>
          { !currentEditingShow.singleArtist
          && <InputsColumn>
            <h2>Artist</h2>
            { artistInputs.map((x, i) => <Input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setArtistInputs) } />) }
          </InputsColumn> }
        </SongInputsContainer>
        <AddButton onClick={ addAnotherInput }>
          <h3>
            More
          </h3>
        </AddButton>
        <DoneButton onClick={ () => { addSongs(); } }>
          <h3>
            Next - { newShowStatus === 'castWasAdded' ? 'Casting/Overview' : 'Add Cast Members' }
          </h3>
        </DoneButton>
      </ViewMain>
    )
}

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;
  align-items: center;

  h2, h4 {
    margin: 0 0 4px 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
`;

interface InputProps {
  $songInput?: boolean;
}

const Input = styled.input<InputProps>`
  ${ props => props.$songInput && 'text-align: right;' }
  margin: 4px;
  background-color: ${ props => props.theme.colors.bgInner1 };
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  font-size: 20px;
  color: white;
  outline: none;
`;

const SongInputsContainer = styled.div`
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 4px;
  padding: 2px;
`;

const InputsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.div`
  background-color: orange;
  border-radius: 4px;
  padding: 4px;
  margin: 2px 2px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  min-width: 50%;
  
  > h3 {
    color: white;
    margin: 0;
  }
`;

const DoneButton = styled(AddButton)`
  margin-top: 20px;
  
  > h3 {
    font-size: 30px;
  }
`;


export default NewSongsView;
