import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useToast from '@hooks/useToast';

import * as S from './style';

import Marker from '@assets/marker.svg';
import Pin from '@assets/pin.svg';
import Time from '@assets/time.svg';
import Phone from '@assets/phone.svg';
import InfoEtc from '@assets/info-etc.svg';
import LinkIcon from '@assets/link.svg';

import Toast from '@components/common/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { useGetReviews } from '@hooks/api/reviews';
import ReviewList from '@components/common/ReviewList';

interface DefaultExplainProps {
  userId: Record<string, string>;
  placeId: number;
  placeInfo: PlaceType;
  address: string;
  isRelatedCourse?: boolean;
}

const DefaultExplain = ({
  userId,
  placeId,
  placeInfo,
  address,
  isRelatedCourse,
}: DefaultExplainProps) => {
  const navigate = useNavigate();
  const { description } = placeInfo;
  const { toast, handleFloatingToast } = useToast();

  const { reviewData } = useGetReviews({
    type: 'p',
    num: placeId,
  });

  const [findAddress, isFindAddress] = useState(false); // 지도
  const [defaultState, setDefaultState] = useState('default'); // 상세정보 파트 or 리뷰 파트

  const handleMoveCourse = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  useEffect(() => {
    if (findAddress) {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        let map;

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (res: GeolocationAddress[], status: boolean) {
          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(res[0].y, res[0].x);
            const mapOption = {
              center: coords,
              level: 4,
            };
            map = new window.kakao.maps.Map(mapContainer, mapOption);

            const markerImageInfo = {
              imageSrc: Marker,
              imageSize: new window.kakao.maps.Size(28, 40),
            };
            const markerImage = new window.kakao.maps.MarkerImage(
              markerImageInfo.imageSrc,
              markerImageInfo.imageSize,
              null,
            );
            const marker = new window.kakao.maps.Marker({
              position: coords,
              image: markerImage,
            });
            marker.setMap(map);
          }
        });

        return map;
      });
    }
  }, [findAddress]);

  return (
    <>
      <S.SelectBox>
        <S.SelectButton
          $state={defaultState === 'default' ? true : false}
          onClick={() => setDefaultState('default')}
        >
          상세정보
        </S.SelectButton>
        <S.SelectButton
          $state={defaultState === 'review' ? true : false}
          onClick={() => setDefaultState('review')}
        >
          리뷰
        </S.SelectButton>
      </S.SelectBox>
      {defaultState === 'review' ? (
        <ReviewList
          reviewData={reviewData?.data.reviews}
          placeType="place"
          placeNum={placeId}
          userId={userId}
        />
      ) : (
        <S.InfoList>
          {/* - 주소 - */}
          <li>
            <S.InfoTextWrap>
              <S.InfoIconWrap>
                <S.InfoIcon src={Pin} />
              </S.InfoIconWrap>
              <S.InfoText>{address}</S.InfoText>
            </S.InfoTextWrap>
            <S.CopyButtonWrap>
              <CopyToClipboard text={address} onCopy={handleFloatingToast}>
                <S.CopyButton>복사하기</S.CopyButton>
              </CopyToClipboard>
              <S.CopyButton type="button" onClick={() => isFindAddress(!findAddress)}>
                {findAddress ? '지도 닫기' : '길 찾기'}
              </S.CopyButton>
            </S.CopyButtonWrap>
            {findAddress && <S.MapWrap id="map" />}
          </li>
          {/* - 전화번호 - */}
          {placeInfo.phone_number && (
            <li>
              <S.InfoTextWrap>
                <S.InfoIconWrap>
                  <S.InfoIcon src={Phone} />
                </S.InfoIconWrap>
                <S.InfoText>{placeInfo.phone_number}</S.InfoText>
              </S.InfoTextWrap>
              <S.CopyButtonWrap>
                <CopyToClipboard text={placeInfo.phone_number} onCopy={handleFloatingToast}>
                  <S.CopyButton>복사하기</S.CopyButton>
                </CopyToClipboard>
              </S.CopyButtonWrap>
            </li>
          )}
          {/* - 운영시간 - */}
          {placeInfo.work_time && (
            <li>
              <S.InfoTextWrap>
                <S.InfoIconWrap>
                  <S.InfoIcon src={Time} />
                </S.InfoIconWrap>
                <S.InfoText>{placeInfo.work_time}</S.InfoText>
              </S.InfoTextWrap>
            </li>
          )}
          {/* - 가격 | 이외 정보 - */}
          <li>
            <S.InfoTextWrap>
              <S.InfoIconWrap>
                <S.InfoIcon src={InfoEtc} />
              </S.InfoIconWrap>
              <S.InfoText>
                {description === '' ? '편하게 산책다녀오세요 :D' : description}
              </S.InfoText>
            </S.InfoTextWrap>
          </li>
          {/* - 홈페이지 링크 - */}
          {placeInfo.page_url && (
            <li>
              <S.InfoTextWrap>
                <S.InfoIconWrap>
                  <S.InfoIcon src={LinkIcon} />
                </S.InfoIconWrap>
                <S.InfoText>
                  <Link to={placeInfo.page_url}>
                    <u>홈페이지 주소</u>
                  </Link>
                </S.InfoText>
              </S.InfoTextWrap>
            </li>
          )}
          {isRelatedCourse &&
            placeInfo.related_course &&
            placeInfo.related_course.map(course => (
              <section style={{ marginBottom: '10px' }}>
                <S.CourseIntroText>코스</S.CourseIntroText>
                <S.CourseIntroLine />
                <S.CourseIntroWrap key={course.id} onClick={() => handleMoveCourse(course.id)}>
                  <S.CourseIntroThumbnail>
                    <S.CourseIntroImage src={course.image_url} alt="장소코스" />
                  </S.CourseIntroThumbnail>
                  <S.CourseTitle>{course.name}</S.CourseTitle>
                  <S.CourseList>
                    <li>
                      <span>소요 시간</span>
                      {course.duration_time}
                    </li>
                    <li>
                      <span>기타 정보</span>
                      {course.price} 공간 있음
                    </li>
                  </S.CourseList>
                </S.CourseIntroWrap>
              </section>
            ))}
          {toast && <Toast>클립보드에 복사되었습니다!</Toast>}
        </S.InfoList>
      )}
    </>
  );
};

export default DefaultExplain;
