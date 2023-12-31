import { styled } from 'styled-components';

const AutoSlideWrap = styled.div`
  position: relative;
  width: 340px;
  height: 200px;
  border-radius: 10px;
  margin: 20px 0 25px;
  overflow: hidden;
  cursor: pointer;
`;

const SlideImageList = styled.ul`
  display: flex;
  transition: transform 1.3s ease-in-out;
`;

const SlideImage = styled.img`
  width: 340px;
  height: 200px;
  object-fit: cover;
`;

const SlideText = styled.p<{
  imgidx: number;
}>`
  position: absolute;
  left: 15px;
  bottom: 12px;
  color: ${({ imgidx }) => (imgidx === 1 || imgidx === 3 ? '#202020' : 'white')};
  ${({ theme }) => theme.font.B_16};

  transition: color 2s ease-in-out;
`;

export { AutoSlideWrap, SlideImageList, SlideImage, SlideText };
