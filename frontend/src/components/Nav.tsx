import { FC } from 'react';
import styled from 'styled-components';
import { useEditor } from '../contexts/editor-context';

const Nav: FC = () => {
  const { currentEditingShow } = useEditor()

  return (
  <NavMain>
    <h1>Rehearsal Manager</h1>
    { currentEditingShow && <h1> - { currentEditingShow.name }</h1> }
  </NavMain>
  )
}
const NavMain = styled.div`
  display: flex;
  align-items: center;
  background-color: ${ props => props.theme.colors.bgNav };
  height: 60px;
  padding: 10px 20px;
  box-shadow: 0px 2px 10px 2px rgba(0, 0, 0, 0.5);

  h1 {
    color: orange;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

    &:nth-child(2) {
      color: white;
      opacity: 0.6;
      margin-left: 10px;
    }
  }
`;

export default Nav;
