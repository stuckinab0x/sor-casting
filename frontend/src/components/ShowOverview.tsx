import { FC } from 'react';
import styled from 'styled-components';
import MainCastingContainer from './CastingContainer/MainCastingContainer';
import CastingPicker from './CastingContainer/CastingPicker';
import { useEditor } from '../contexts/editor-context';

const ShowOverview: FC = () => {
  const { currentCastEdit } = useEditor();
  
  return(
    <OverviewMain>
      <MainCastingContainer />
      { currentCastEdit && <CastingPicker /> }
    </OverviewMain>
  )
}

const OverviewMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export default ShowOverview;
