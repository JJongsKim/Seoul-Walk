import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from 'styled-components';

import { BOTTOM_SHEET_HEIGHT } from '@application/constant';
import useBottomSheet from '@hooks/useBottomHook';
import { setSubmitFilter } from '@store/reducers/FilterReducer';

interface BottomSheetProps {
  children: React.ReactElement;
  submitState?: boolean;
}

const BottomSheet = ({ children, submitState }: BottomSheetProps) => {
  const dispatch = useDispatch();
  const { sheet, handleClickSheet } = useBottomSheet();

  useEffect(() => {
    if (submitState) {
      handleClickSheet();
      dispatch(setSubmitFilter(false));
    }
  }, [submitState]);

  return (
    <BottomSheetWrap ref={sheet}>
      <HandleWrap onClick={handleClickSheet}>
        <HandleIcon />
      </HandleWrap>
      <SheetContent>{children}</SheetContent>
    </BottomSheetWrap>
  );
};

const BottomSheetWrap = styled.div`
  display: flex;
  flex-direction: column; // 바텀시트의 핸들, body 세로정렬
  align-items: center;

  position: fixed;
  top: calc(100% - 140px);
  left: 0;
  right: 0;
  z-index: 2;

  width: 375px;
  height: ${BOTTOM_SHEET_HEIGHT}px;
  margin: 0 auto;
  padding: 80px 0 30px;

  border-radius: 30px 30px 0 0;
  background-color: white;
  transition: transform 700ms ease-out;

  @media screen and (min-width: 1200px) {
    top: calc(100% - 135px);
    padding-bottom: 40px;
  }
`;

const HandleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 40px;

  border-radius: 30px 30px 0 0;
  background-color: #f3f3f3;
  cursor: pointer;
`;

const HandleIcon = styled.div`
  width: 100px;
  height: 5px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.text_gray};
`;

const SheetContent = styled.section`
  width: 100%;
  overflow-y: scroll;
`;

export default BottomSheet;
