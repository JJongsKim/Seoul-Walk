/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GeolocationAddress } from '@/types/index';
import Loading from '@components/common/Loading';
import useGeoLocation from '@hooks/useGeoLocation';

import { useEffect } from 'react';
import { styled } from 'styled-components';

declare global {
  interface Window {
    kakao: any;
  }
}

const geoLocationOptions = {
  timeout: 6000,
};

const Map = () => {
  const { location } = useGeoLocation(geoLocationOptions);

  const mapScript = document.createElement('script');
  mapScript.async = true;
  mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services,clusterer,drawing`;
  document.head.appendChild(mapScript);

  useEffect(() => {
    if (!location.isLoading) {
      const onLoadKakaoMap = () => {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById('map');
          const mapOption = {
            center: new window.kakao.maps.LatLng(location?.latitude, location?.longitude),
            level: 3,
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          const geocoder = new window.kakao.maps.services.Geocoder();

          // TODO 바로 받아온 2depth 자치구 전역변수에 넣기
          // TODO console부분은 다른 에러검증으로 대체하기
          const reverseGeocoding = (res: GeolocationAddress[], status: boolean) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = res[0].address.address_name;
              console.log('주소:', address);
              console.log('자치구명:', res[0].address.region_2depth_name);

              return address;
            } else {
              console.error('주소 변환 실패!');
            }
          };

          geocoder.coord2Address(location.longitude, location.latitude, reverseGeocoding);

          return map;
        });
      };

      mapScript.addEventListener('load', onLoadKakaoMap);

      return () => mapScript.removeEventListener('load', onLoadKakaoMap);
    }
  }, [location]);

  return location?.isLoading ? <Loading /> : <MapWrap id="map" />;
};

const MapWrap = styled.div`
  width: 375px;
  height: 500px;
  margin: 0 auto;

  @media screen and (min-width: 1200px) {
    width: 850px;
    height: 600px;
  }
`;

export default Map;
