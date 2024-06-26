import { useCallback, useEffect, useState } from 'react';

import { LabelText, LikeIcon, ThumbLabel, ThumbWrap, Thumbnail } from './style';
import { ReactComponent as LikeEmpty } from '@assets/like-gray.svg';
import { ReactComponent as LikeFull } from '@assets/like-full.svg';
import DEFAULT_IMAGE from '../../../images/default.png';

import Toast from '../Toast';
import useToast from '@hooks/useToast';
import { useDeleteHeart, usePushHeart } from '@hooks/api/heart';
import debounce from '@hooks/debounce';

interface ThumbnailProps {
  data: PlacesType | PlacesOfMap | HeartPlacesType;
  userId?: Record<string, string>;
  like?: boolean;
  recentView?: boolean | null;
  onClick?: () => void;
}

const ThumbnailBox = ({ userId, data, like, recentView, onClick }: ThumbnailProps) => {
  const { toast, handleFloatingToast } = useToast();
  const [heartState, setHeartState] = useState(like);

  // 이미지 로딩 실패 시, default 이미지로 대체
  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = `${DEFAULT_IMAGE}`;
  }, []);

  const { mutate: pushHeartMutation } = usePushHeart();
  const { mutate: deleteHeartMutation } = useDeleteHeart();
  const handleClickHeart = (id: number) => {
    if (userId && Object.keys(userId).length === 0) {
      handleFloatingToast();
    } else {
      // - 일반 | 찜이 눌리지 않은 장소 > 찜 누르기
      if (!heartState) {
        pushHeartMutation({
          args: {
            place_id: id,
          },
          headerArgs: userId!,
        });
        setHeartState(true);
      }
      // - 일반 | 이미 찜이 눌린 장소 > 찜 해제
      if (heartState) {
        deleteHeartMutation({
          args: {
            place_id: id,
          },
          headerArgs: userId!,
        });
        setHeartState(false);
      }
    }
  };

  const debounceClickHeart = debounce(handleClickHeart, 300);

  useEffect(() => {
    setHeartState(like);
  }, [like]);

  return (
    <>
      <Thumbnail>
        <ThumbWrap onClick={onClick} src={data.image_url} onError={handleImageError} />
        <ThumbLabel>
          <LabelText>{data.name}</LabelText>
        </ThumbLabel>
        {!recentView ? (
          <LikeIcon onClick={() => debounceClickHeart(data.id)}>
            {heartState ? <LikeFull /> : <LikeEmpty />}
          </LikeIcon>
        ) : null}
      </Thumbnail>
      {toast && <Toast>찜 기능은 로그인 후 이용해주세요!</Toast>}
    </>
  );
};

export default ThumbnailBox;
