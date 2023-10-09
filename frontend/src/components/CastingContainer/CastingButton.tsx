import { FC } from 'react';
import styled from 'styled-components';

interface CastingButtonProps {
  assignedStudent?: string;
  startCasting: () => void;
}

const CastingButton: FC<CastingButtonProps> = ({ assignedStudent, startCasting }) => {
  return (
    <ButtonMain onClick={ startCasting }>
      <h4>{ assignedStudent }</h4>
    </ButtonMain>
  )
}

const ButtonMain = styled.div`
  display: flex;
  background-color: ${ props => props.theme.colors.bgInner3 };
  padding: 5px 10px;
  margin: 2px;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  justify-content: left;
  width: 100px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  min-height: 25px;

  > h4 {
    display: flex;
    color: white;
    margin: 0;
  }
`;

export default CastingButton;
