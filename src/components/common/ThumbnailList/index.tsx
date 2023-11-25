import { useNavigate } from 'react-router-dom';

import { NextFetchTarget, ThumbnailContentArea, ThumbnailListWrap } from './style';
import ThumbnailBox from '../ThumbnailBox';
import RecentViewPlaces from '@hooks/localStorage/RecentViewPlaces';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useToast from '@hooks/useToast';
import Toast from '../Toast';
import { useDeleteHeart, usePushHeart } from '@hooks/api/heart';

interface ThumbnailListProps {
  places?: PlacesType[] | PlacesOfMap[];
  isLoading?: boolean;
  totalPlaces?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
}

const MAX_RECENT_PLACES = 20;

/*
  - 장소 썸네일에 대한 정보 전달
  - 로그인 여부에 따른 찜 API 연결
    1. Course 장소일땐 body type: 'c'
    2. Course 이외 장소일땐 body type: 'p'
    3. 메인페이지에서는 전달해주는 type에 따라 'c', 'p'나누기
*/
const ThumbnailList = ({ places, isLoading, hasNextPage, fetchNextPage }: ThumbnailListProps) => {
  const naviagate = useNavigate();
  const { handleGetRecentPlaces, handleSaveRecentPlace } = RecentViewPlaces();
  const { toast, handleFloatingToast } = useToast();

  const userId = useSelector((state: StoreType) => state.UserIdReducer.userId);
  const nextFetchTargetRef = useRef<HTMLDivElement | null>(null);

  const [clickHeart, setClickHeart] = useState<HeartDataArgsType>();

  /*
    - 장소 상세보기로 이동
    - 최근 조회 장소 업데이트
  */
  const handleClickThumb = (data: PlacesType) => {
    naviagate(`/place/${data.id}`, { state: data.name });

    const recentPlaces: PlacesType[] = handleGetRecentPlaces();
    const updatedRecentPlaces = recentPlaces.filter(place => place.id !== data.id);

    updatedRecentPlaces.push({
      heart: data.heart,
      id: data.id,
      image_url: data.image_url,
      name: data.name,
    });

    if (updatedRecentPlaces.length > MAX_RECENT_PLACES) {
      updatedRecentPlaces.shift();
    }

    handleSaveRecentPlace(updatedRecentPlaces);
  };

  const { mutate: pushHeartMutation } = usePushHeart();
  const { mutate: deleteHeartMutation } = useDeleteHeart();
  const handleChangeHeartState = (id: number) => {
    if (location.pathname === '/search/course') {
      setClickHeart({
        type: 'c',
        course_id: id,
      });
    } else {
      setClickHeart({
        type: 'p',
        place_id: id,
      });
    }
  };

  const handleClickHeart = async (id: number, heartState: number) => {
    if (Object.keys(userId).length === 0) {
      handleFloatingToast();
    } else {
      await handleChangeHeartState(id);

      // - 찜이 눌리지 않은 장소
      if (heartState === 0) {
        if (clickHeart !== undefined) {
          pushHeartMutation({ args: clickHeart, headerArgs: userId });
        }
      }
      // - 이미 찜이 눌린 장소
      else if (heartState === 1) {
        if (clickHeart !== undefined) {
          deleteHeartMutation({ args: clickHeart, headerArgs: userId });
        }
      }
    }
  };

  // 데이터 무한스크롤
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const fetchCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage?.();
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(fetchCallback, options);

    if (nextFetchTargetRef.current) {
      observer.observe(nextFetchTargetRef.current);
    }

    return () => {
      if (nextFetchTargetRef.current) {
        observer.unobserve(nextFetchTargetRef.current);
      }
    };
  }, [places]);

  return places && places.length !== 0 ? (
    <ThumbnailListWrap>
      <ThumbnailContentArea>
        {places.map(data => (
          <ThumbnailBox
            key={data.id}
            data={data}
            like={data.heart}
            onClickHeart={() => handleClickHeart(data.id, data.heart)}
            onClick={() => handleClickThumb(data)}
          />
        ))}
      </ThumbnailContentArea>
      {!isLoading && hasNextPage && (
        <NextFetchTarget ref={nextFetchTargetRef}>• • •</NextFetchTarget>
      )}
      {toast && <Toast>찜 기능은 로그인 후 이용해주세요!</Toast>}
    </ThumbnailListWrap>
  ) : null;
};

export default ThumbnailList;
