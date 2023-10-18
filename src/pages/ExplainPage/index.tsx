import SearchBar from '@components/common/SearchBar';
import {
  ExplainPageWrap,
  InfoIcon,
  InfoIconWrap,
  InfoList,
  InfoText,
  InfoTextWrap,
  LikeIcon,
  LocationTitle,
  ThumbnailBox,
  ThumbnailBoxWrap,
} from './style';

import test from '../../images/IMG_9904.jpg';

import LikeEmpty from '@assets/like-empty.svg';
// import LikeFull from '@assets/like-full.svg';
import { MOCKUP2 } from '@application/mock';
import { useLocation } from 'react-router-dom';

const ExplainPage = () => {
  const location = useLocation();

  return (
    <ExplainPageWrap>
      <SearchBar name={location.state} backIcon={true} />
      <ThumbnailBoxWrap>
        <ThumbnailBox src={test} alt="장소썸네일" />
        <LikeIcon src={LikeEmpty} alt="찜버튼" />
      </ThumbnailBoxWrap>
      <LocationTitle>{location.state}</LocationTitle>
      <InfoList>
        {MOCKUP2.map(item => (
          <li key={item.type}>
            <InfoTextWrap>
              <InfoIconWrap>
                <InfoIcon src={item.svg} />
              </InfoIconWrap>
              <InfoText>{item.content}</InfoText>
            </InfoTextWrap>
          </li>
        ))}
      </InfoList>
    </ExplainPageWrap>
  );
};

export default ExplainPage;