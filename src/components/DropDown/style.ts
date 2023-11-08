import { styled } from 'styled-components';

const DropdownWrap = styled.div`
  position: relative;
  display: flex;
  width: 75px;
  height: 26px;
  border: 1px solid ${({ theme }) => theme.colors.text_gray};
  z-index: 2;
  background-color: white;

  @media screen and (min-width: 1200px) {
    width: 100px;
    height: 38px;
  }
`;

const DropdownTextWrap = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 100%;
  ${({ theme }) => theme.font.B_14};

  @media screen and (min-width: 1200px) {
    ${({ theme }) => theme.font.B_16};
  }
`;

const DropdownBtnWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
  cursor: pointer;
`;

const DropdownBtn = styled.img<{
  $clicked?: boolean;
}>`
  width: 15px;
  height: 8px;
  transform: ${props => props.$clicked && `rotate(180deg)`};

  @media screen and (min-width: 1200px) {
    width: 18px;
    height: 10px;
  }
`;

const DropdownListWrap = styled.div`
  position: absolute;
  top: 24px;
  width: 75px;
  height: 162px;
  border: 1px solid ${({ theme }) => theme.colors.text_gray};
  overflow-y: auto;
  background-color: white;

  @media screen and (min-width: 1200px) {
    top: 36px;
    width: 100px;
    height: 240px;
  }
`;

const DropdownList = styled.ul`
  ${({ theme }) => theme.font.M_14};
  user-select: none;

  li {
    padding: 0 4px;
    margin: 15px 0;
    cursor: pointer;
  }

  @media screen and (min-width: 1200px) {
    ${({ theme }) => theme.font.M_16};

    li {
      padding: 0 10px;
      margin: 22px 0;
    }
  }
`;

export {
  DropdownWrap,
  DropdownTextWrap,
  DropdownBtnWrap,
  DropdownBtn,
  DropdownListWrap,
  DropdownList,
};