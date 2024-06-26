import ThumbnailList from '@components/common/ThumbnailList';
import AutoSlide from '@components/MainPage/AutoSlide';

import * as S from './style';
import { useGetPlacesOfTop20 } from '@hooks/api/places';
import { useNavigate } from 'react-router-dom';
import Loading from '@components/common/Loading';
import WarningMention from '@components/common/warning';

interface MainPageProps {
  userId: Record<string, string>;
}

const MainPage = ({ userId }: MainPageProps) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPlacesOfTop20(userId);
  const top20Places = data as PlacesType[];

  return (
    <S.MainPageWrap>
      <AutoSlide
        onClick={() =>
          navigate('/search/custom', {
            state: {
              name: '맞춤 필터',
            },
          })
        }
      />
      <S.RecommendTextWrap>
        <S.RecommendText>서울산책 회원들이 추천하는</S.RecommendText>
        <S.RecommendTop20>TOP20</S.RecommendTop20>
      </S.RecommendTextWrap>
      <S.ContentWrap>
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <WarningMention text="새로고침 해주세요!" />
        ) : (
          top20Places && <ThumbnailList places={top20Places} />
        )}
      </S.ContentWrap>
    </S.MainPageWrap>
  );
};

export default MainPage;
