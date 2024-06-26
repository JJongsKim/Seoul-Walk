import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import * as S from '../style';
import { useGetPlacesOfCategory } from '@hooks/api/places';

import { BLUERIBBON_FILTER, COST_FILTER, MENU, RATING_FILTER } from '@application/constant';
import SearchBar from '@components/common/SearchBar';
import ThumbnailList from '@components/common/ThumbnailList';
import Chip from '@components/common/Chip';
import Loading from '@components/common/Loading';
import {
  setCostOfCategory,
  setRatingOfCategory,
  setRibbonOfCategory,
} from '@store/reducers/PlacesOfFilterReducer';

interface CategoryPageProps {
  userId?: Record<string, string>;
}

const CategoryPage = ({ userId }: CategoryPageProps) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const storeData = useSelector((store: StoreType) => store.PlacesOfFilterReducer);
  const { categoryCost, categoryRating, categoryRibbon } = storeData;

  const [selectedCost, setSelectedCost] = useState<string[]>(categoryCost);
  const [selectedRating, setSelectedRating] = useState<string[]>(categoryRating);
  const [selectedRibbon, setSelectedRibbon] = useState<number[]>(categoryRibbon);

  // 무료 / 유료 선택
  const handleSelectedCost = useCallback(
    (selectedItem: string) => {
      const newFilter = new Set<string>(selectedCost);

      if (newFilter.has(selectedItem)) {
        newFilter.delete(selectedItem);
      } else {
        newFilter.clear();
        newFilter.add(selectedItem);
      }

      const returnFilter = Array.from(newFilter);
      setSelectedCost(returnFilter);
      dispatch(setCostOfCategory(returnFilter));
    },
    [selectedCost],
  );

  // 별점 높은순 / 낮은순 선택
  const handleSelectedRating = useCallback(
    (selectedItem: string) => {
      const newFilter = new Set<string>(selectedRating);

      if (newFilter.has(selectedItem)) {
        newFilter.delete(selectedItem);
      } else {
        newFilter.clear();
        newFilter.add(selectedItem);
      }

      const returnRating = Array.from(newFilter);
      setSelectedRating(returnRating);
      dispatch(setRatingOfCategory(returnRating));
    },
    [selectedRating],
  );

  // 블루리본 개수 선택
  const handleSelectedRibbon = useCallback(
    (selectedItem: number) => {
      const newFilter = new Set<number>(selectedRibbon);

      if (newFilter.has(selectedItem)) {
        newFilter.delete(selectedItem);
      } else {
        newFilter.clear();
        newFilter.add(selectedItem);
      }

      const returnRibbon = Array.from(newFilter);
      setSelectedRibbon(returnRibbon);
      dispatch(setRibbonOfCategory(returnRibbon));
    },
    [selectedRibbon],
  );

  const queryParam: Record<string, string | number> = {};
  if (categoryCost) {
    queryParam.price = categoryCost[0];
  }
  if (categoryRating) {
    queryParam.rating = categoryRating[0];
  }
  if (categoryRibbon) {
    queryParam.ribbon = categoryRibbon[0];
  }

  const { data, refetch, isLoading, fetchNextPage, hasNextPage } = useGetPlacesOfCategory(
    location.state.id,
    queryParam,
    userId,
  );

  useEffect(() => {
    refetch();
  }, [categoryCost, categoryRibbon, categoryRating]);

  return (
    <S.DetailPageWrap>
      <SearchBar name={`${location.state.name}`} backIcon={true} />
      {MENU.some(item => item.name === location.state.name) && (
        <S.FilterListWrap>
          {location.state.name === '맛집/카페' ? (
            <S.FilterList>
              <S.FilterListLabel>블루리본</S.FilterListLabel>
              {/* 맛집/카페 카테고리용 블루리본 필터 */}
              {BLUERIBBON_FILTER.map(ribbon => (
                <li key={ribbon.id} onClick={() => handleSelectedRibbon(ribbon.id)}>
                  <Chip
                    value={ribbon.type}
                    size="xsmall"
                    isClicked={categoryRibbon.includes(ribbon.id)}
                  />
                </li>
              ))}
            </S.FilterList>
          ) : (
            <S.FilterList>
              <S.FilterListLabel>가격</S.FilterListLabel>
              {/* 일반 카테고리용 유료/무료 필터 */}
              {COST_FILTER.map(item => (
                <li key={item.id} onClick={() => handleSelectedCost(item.id)}>
                  <Chip value={item.type} size="small" isClicked={categoryCost.includes(item.id)} />
                </li>
              ))}
            </S.FilterList>
          )}
          {/* 전체 카테고리 적용 별점순 필터 */}
          <S.FilterList>
            <S.FilterListLabel>별점</S.FilterListLabel>
            {RATING_FILTER.map(rat => (
              <li key={rat.id} onClick={() => handleSelectedRating(rat.id)}>
                <Chip value={rat.type} size="small" isClicked={categoryRating.includes(rat.id)} />
              </li>
            ))}
          </S.FilterList>
        </S.FilterListWrap>
      )}
      <S.DetailPageContentList>
        {isLoading ? (
          <Loading />
        ) : (
          <ThumbnailList
            places={data}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </S.DetailPageContentList>
    </S.DetailPageWrap>
  );
};

export default CategoryPage;
