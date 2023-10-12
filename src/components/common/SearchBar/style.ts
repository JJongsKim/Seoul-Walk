import { styled } from 'styled-components';

const SearchBarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;

  @media screen and (min-width: 1200px) {
    margin: 35px 0;
  }
`;

const SearchBarItemWrap = styled.div`
  position: relative;
  width: 375px;

  @media screen and (min-width: 1200px) {
    width: 850px;
  }
`;

const SearchBarTitleWrap = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 6px 15px;
`;

const TitleText = styled.p`
  ${({ theme }) => theme.font.B_22};
  padding-left: 6px;

  @media screen and (min-width: 1200px) {
    ${({ theme }) => theme.font.B_26};
    padding-left: 8px;
  }
`;

const SearchBarLine = styled.hr`
  width: 350px;
  color: ${({ theme }) => theme.colors.text_gray};

  @media screen and (min-width: 1200px) {
    width: 850px;
  }
`;

const BackIcon = styled.img`
  width: 24px;
  height: 12px;
  cursor: pointer;

  @media screen and (min-width: 1200px) {
    width: 30px;
    height: 18px;
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
  top: 3px;
  right: 22px;
  cursor: pointer;

  @media screen and (min-width: 1200px) {
    width: 24px;
    height: 24px;
  }
`;

export {
  SearchBarWrap,
  SearchBarItemWrap,
  SearchBarTitleWrap,
  TitleText,
  SearchBarLine,
  BackIcon,
  SearchIcon,
};