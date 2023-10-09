import { FC, useState, useCallback } from 'react';
import styled from 'styled-components';
import Student from '../../models/student';
import LessonSelector from './LessonSelector';
import { useEditor } from '../../contexts/editor-context';
import MainSelector from './MainSelector';

interface CastMemberProps {
  student: Student;
  twoPmStart: boolean;
  activeEdit: string | null;
  setActiveEdit: (studentOldName: string | null) => void;
}

const CastMember: FC<CastMemberProps> = ({ student, twoPmStart, activeEdit, setActiveEdit }) => {
  const { updateStudentInfo } = useEditor();
  const [nameInput, setNameInput] = useState(student.name);

  const handleNameConfirm = useCallback(() => {
    updateStudentInfo(student.name, { name: nameInput, lesson: student.lesson, main: student.main  });
    setActiveEdit(null);
  }, [updateStudentInfo, nameInput, student, setActiveEdit]);

  return (
    <CastMemberMain $disabled={ !!activeEdit && activeEdit !== student.name }>
      { activeEdit !== student.name && <>
        <div>
          <span className='material-symbols-outlined' onClick={ () => setActiveEdit(student.name) }>edit</span>
          <h3>{ student.name }</h3>
        </div>
        <LessonSelector student={ student } twoPmStart={ twoPmStart } />
        <MainSelector student={ student } />
      </> }
      { activeEdit === student.name && <>
        <ConfirmButton onClick={ handleNameConfirm }>
          <h3>Confirm</h3>
        </ConfirmButton>
        <NameInput autoFocus value={ nameInput } onChange={ event => setNameInput(event.currentTarget.value) } />
        <ActionButton onClick={ () => { setActiveEdit(null); setNameInput(student.name) } }>
          <h3>Discard Changes</h3>
        </ActionButton>
      </> }
    </CastMemberMain>
  )
}

interface CastMemberMainProps {
  $disabled: boolean;
}

const CastMemberMain = styled.div<CastMemberMainProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${ props => props.theme.colors.bgInner2 };
  padding: 4px;
  margin: 2px;
  border-radius: 4px;
  width: 100%;
  ${ props => props.$disabled && 'pointer-events: none;' }
  ${ props => props.$disabled && 'opacity: 0.5;' }


  > div {
    display: flex;
    align-items: center;
    margin-left: 4px;

    > span {
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }
  
    > h3 {
      color: white;
      margin: 0 8px 0 4px;
      text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
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
  border-radius: 4px;
  margin: 2px;
  padding: 5px 10px;
  background-color: ${ props => props.theme.colors.bgInner1 };
  cursor: pointer;

  > h3 {
    color: white;
    margin: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
`;

const ConfirmButton = styled(ActionButton)`
  background-color: orange;
`;

export default CastMember;
