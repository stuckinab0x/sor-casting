import { FC } from 'react';
import styled, { css } from 'styled-components';
import { instAndFullNames } from '../../models/song';
import { useEditor } from '../../contexts/editor-context';

interface CastListHeaderProps {
  showName: string;
  disabled: boolean;
}

const CastListHeader: FC<CastListHeaderProps> = ({ showName, disabled }) => {
  const { toolsMode, setToolsMode } = useEditor();
  
  return (
    <HeaderMain $disabled={ disabled }>
      <CornerTile $active={ toolsMode } onClick={ () => toolsMode && setToolsMode(false) }>
        { !toolsMode && <span className='material-symbols-outlined' onClick={ () => setToolsMode(!toolsMode) }>settings</span> }
        <h3>{ toolsMode ? 'Click to  finish editing' : showName }</h3>
      </CornerTile>
      { instAndFullNames.map(x => 
        <InstrumentHeader key={ x[0] }>
          <h3>{ x[0] }</h3>
        </InstrumentHeader>)}
    </HeaderMain>
  );
}

interface HeaderProps {
  $disabled: boolean;
}

const HeaderMain = styled.div<HeaderProps>`
  display: flex;
  align-items: center;
  margin: 2px 2px 1px;
  ${ props => props.$disabled && 'opacity: 0.5;' }
  ${ props => props.$disabled && 'pointer-events: none;' }

  h3 {
    color: white;
    margin: 0;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }
`;

const InstrumentHeader = styled.div`
  display: flex;
  background-color: orange;
  padding: 5px 10px;
  margin: 2px;
  border-radius: 2px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  justify-content: center;
  width: 100px;
`;

interface CornerTileProps {
  $active: boolean;
}

const CornerTile = styled(InstrumentHeader)<CornerTileProps>`
  display: flex;
  background-color: #1f1f1f;
  justify-content: space-between;
  align-items: center;
  width: 250px;

  > span {
    cursor: pointer;
    color: white;
  }

  ${ props => props.$active
    && css`
      animation: pulse 5s infinite;
      cursor: pointer;
      justify-content: center;
    `
  }

  @keyframes pulse {
    0% {
      background-color: #1f1f1f;
    }

    50% {
      background-color: orange;
    }

    100% {
      background-color: #1f1f1f;
    }
  }
`;

export default CastListHeader;
