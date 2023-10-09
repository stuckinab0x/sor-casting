import { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { useEditor } from '../contexts/editor-context';
import { ALL_INSTRUMENTS } from '../models/student';
import CastByInstrumentColumn from './Cast/CastByInstrumentColumn';

const CastMemberView: FC = () => {
  const { currentEditingShow, setEditorView } = useEditor();
  const [activeEdit, setActiveEdit] = useState<string | null>(null);
  
  if (currentEditingShow)
  return (
    <ViewMain>
      <h2>{ currentEditingShow.name }:  Manage Cast Members</h2>
      <Button onClick={ () => setEditorView('showOverview') }>
        <h2>Return to Show Overview</h2>
      </Button>
      <div>{ ALL_INSTRUMENTS.map(x => <CastByInstrumentColumn key={ x } activeEdit={ activeEdit } setActiveEdit={ setActiveEdit } twoPmStart={ currentEditingShow.twoPmRehearsal } instrument={ x } castMembers={ currentEditingShow.cast.filter(student => student.main === x) } />) }</div>
    </ViewMain>
  )
}

const h2 = css`
  color: white;
  margin: 0;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
`;

const ViewMain = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  text-align: center;

  > h2 {
    ${ h2 }
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${ props => props.theme.colors.bgInner2 };
  border-radius: 4px;
  padding: 4px;
  margin: 14px 0px;
  cursor: pointer;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.5);

  > h2 {
    ${ h2 }
  }
`

export default CastMemberView;
