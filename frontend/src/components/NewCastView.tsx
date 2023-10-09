import { FC, SetStateAction, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import Student from '../models/student';
import InputUpdate from '../models/input-update';
import { createInputs } from '../utils';

const NewCastView: FC = () => {
  const { newShowStatus, setNewShowStatus, currentEditingShow, setCurrentEditingShow, setEditorView } = useEditor();
  const [guitarInputs, setGuitarInputs] = useState<InputUpdate[]>(createInputs(8));
  const [bassInputs, setBassInputs] = useState<InputUpdate[]>(createInputs(4));
  const [drumInputs, setDrumInputs] = useState<InputUpdate[]>(createInputs(4));
  const [keysInputs, setKeysInputs] = useState<InputUpdate[]>(createInputs(4));
  const [voxInputs, setVoxInputs] = useState<InputUpdate[]>(createInputs(4));

  const handleInputChange = useCallback((index: number, input: HTMLInputElement, arraySetter: React.Dispatch<SetStateAction<InputUpdate[]>>) => {
    arraySetter(oldState => {
      const newInputs = [...oldState];
      newInputs[index] = { ...newInputs[index], value: input.value };
      return newInputs;
    })
  }, []);

  const addAnotherInput = useCallback((arraySetter: React.Dispatch<SetStateAction<InputUpdate[]>>) => {
    arraySetter(oldState => [...oldState, { value: '', id: oldState.length }]);
  }, [])

  const addCast = useCallback(() => {
    if (!currentEditingShow)
      return;
    const newShow = { ...currentEditingShow };
      const guitar: Student[] = guitarInputs.map(x => ({ name: x.value.trim(), main: 'Guitar', castings: [], }));
      const bass: Student[] = bassInputs.map(x => ({ name: x.value.trim(), main: 'Bass', castings: [], }));
      const drums: Student[] = drumInputs.map(x => ({ name: x.value.trim(), main: 'Drums', castings: [], }));
      const keys: Student[] = keysInputs.map(x => ({ name: x.value.trim(), main: 'Keys', castings: [], }));
      const vox: Student[] = voxInputs.map(x => ({ name: x.value.trim(), main: 'Vocals', castings: [], }));
      newShow.cast = [...guitar, ...bass, ...drums, ...keys, ...vox].filter(x => x.name);
    setCurrentEditingShow(newShow);
    if (newShowStatus === 'songsWereAdded') {
      setEditorView('showOverview');
      setNewShowStatus(undefined);
    }
    else {
      setNewShowStatus('castWasAdded');
      setEditorView('newShowSongs');
    }
  }, [guitarInputs, bassInputs, drumInputs, keysInputs, voxInputs, currentEditingShow, newShowStatus, setNewShowStatus, setEditorView, setCurrentEditingShow])

  if (currentEditingShow)
    return (
      <ViewMain>
        <h2>
          { currentEditingShow.name }: Cast Members
        </h2>
        <h4><i>Add students to the cast list.<br />
        Instrument groups will help with organization later<br/>
        and don't affect song casting possibilities.</i></h4>
        <InstrumentSection>
          <InstrumentHeader>
            <h3>Guitar</h3>
          </InstrumentHeader>
          { guitarInputs.map((x, i) => <input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setGuitarInputs) } />) }
          <AddButton  onClick={ () => addAnotherInput(setGuitarInputs) }>
            <h3>
              More
            </h3>
          </AddButton>
        </InstrumentSection>
        <InstrumentSection>
          <InstrumentHeader>
            <h3>Bass</h3>
          </InstrumentHeader>
          { bassInputs.map((x, i) => <input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setBassInputs) } />) }
          <AddButton onClick={ () => addAnotherInput(setBassInputs) }>
            <h3>
              More
            </h3>
          </AddButton>
        </InstrumentSection>
        <InstrumentSection>
          <InstrumentHeader>
            <h3>Drums</h3>
          </InstrumentHeader>
          { drumInputs.map((x, i) => <input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setDrumInputs) } />) }
          <AddButton  onClick={ () => addAnotherInput(setDrumInputs) }>
            <h3>
              More
            </h3>
          </AddButton>
        </InstrumentSection>
        <InstrumentSection>
          <InstrumentHeader>
            <h3>Keys</h3>
          </InstrumentHeader>
          { keysInputs.map((x, i) => <input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setKeysInputs) } />) }
          <AddButton  onClick={ () => addAnotherInput(setKeysInputs) }>
            <h3>
              More
            </h3>
          </AddButton>
        </InstrumentSection>
        <InstrumentSection>
          <InstrumentHeader>
            <h3>Vocals</h3>
          </InstrumentHeader>
          { voxInputs.map((x, i) => <input type='text' key={ x.id } value={ x.value } onChange={ event => handleInputChange(i, event.currentTarget, setVoxInputs) } />) }
          <AddButton onClick={ () => addAnotherInput(setVoxInputs) }>
            <h3>
              More
            </h3>
          </AddButton>
        </InstrumentSection>
        <DoneButton onClick={ addCast }>
          <h3>
            Next - { newShowStatus === 'songsWereAdded' ? 'Casting/Overview' : 'Add Songs' }
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

  h2, h4 {
    margin: 0 0 4px 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  input {
    margin: 2px;
    background-color: ${ props => props.theme.colors.bgInner1 };
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    font-size: 16px;
    color: white;
    outline: none;
  }
`;

const InstrumentSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 4px;
  padding: 2px;
`;

const InstrumentHeader = styled.div`
  background-color: ${ props => props.theme.colors.bgInner2 };
  text-align: center;
  padding: 5px;
  margin: 2px;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  
  > h3 {
    color: white;
    margin: 0;
  }
`;

const AddButton = styled.div`
  background-color: orange;
  border-radius: 4px;
  padding: 4px;
  margin: 2px 2px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  
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


export default NewCastView;
