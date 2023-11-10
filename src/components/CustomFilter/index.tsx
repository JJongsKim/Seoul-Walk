import { ACTIVE_TASTE, MINI_FILTER, REGION_ARRAY } from '@application/constant';
import {
  CustomFilterForm,
  FilterButtonWrap,
  FilterList,
  FilterTitle,
  FilterTypeContainer,
} from './style';
import Chip from '@components/common/Chip';
import ButtonBase from '@components/common/ButtonBase';
import React, { useCallback, useState } from 'react';
import useToast from '@hooks/useToast';
import Toast from '@components/common/Toast';

const CustomFilter = () => {
  const { toast, handleFloatingToast } = useToast();

  // TODO 임시로 종류별로 따로받는 코드로 작성
  // TODO 백엔드 나오는대로 변경하기
  const [selectedCost, setSelectedCost] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);

  const handleSelectedFilter = useCallback(
    (arrayName: string, selectedItem: string) => {
      if (arrayName === 'cost') {
        const newFilter = new Set<string>(selectedCost);

        newFilter.has(selectedItem) ? newFilter.delete(selectedItem) : newFilter.add(selectedItem);
        const returnFilter = Array.from(newFilter);
        setSelectedCost(returnFilter);
      }
      if (arrayName === 'activity') {
        const newFilter = new Set<string>(selectedActivity);

        newFilter.has(selectedItem) ? newFilter.delete(selectedItem) : newFilter.add(selectedItem);
        const returnFilter = Array.from(newFilter);
        setSelectedActivity(returnFilter);
      }
      if (arrayName === 'location') {
        const newFilter = new Set<string>(selectedLocation);

        newFilter.has(selectedItem) ? newFilter.delete(selectedItem) : newFilter.add(selectedItem);
        const returnFilter = Array.from(newFilter);
        setSelectedLocation(returnFilter);
      }
    },
    [selectedCost, selectedActivity, selectedLocation],
  );

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 아무 조건을 걸지 않고 적용하기를 누를 시
    if (
      selectedCost.length === 0 &&
      selectedActivity.length === 0 &&
      selectedLocation.length === 0
    ) {
      handleFloatingToast();
    }
  };

  return (
    <CustomFilterForm onSubmit={handleSubmit}>
      <FilterTypeContainer>
        <FilterTitle>유료/무료 여부</FilterTitle>
        <FilterList>
          {MINI_FILTER[0].filters.map(item => (
            <li key={item} onClick={() => handleSelectedFilter('cost', item)}>
              <Chip size="small" value={item} isClicked={selectedCost?.includes(item)} />
            </li>
          ))}
        </FilterList>
      </FilterTypeContainer>
      <FilterTypeContainer>
        <FilterTitle>활동 취향</FilterTitle>
        <FilterList>
          {ACTIVE_TASTE.map(item => (
            <li key={item.id} onClick={() => handleSelectedFilter('activity', item.name)}>
              <Chip
                size="small"
                value={item.name}
                isClicked={selectedActivity?.includes(item.name)}
              />
            </li>
          ))}
        </FilterList>
      </FilterTypeContainer>
      <FilterTypeContainer>
        <FilterTitle>활동 지역</FilterTitle>
        <FilterList>
          {REGION_ARRAY.map(
            item =>
              item.locationName !== '현 위치' && (
                <li
                  key={item.locationId}
                  onClick={() => handleSelectedFilter('location', item.locationName)}
                >
                  <Chip
                    size="small"
                    value={item.locationName}
                    isClicked={selectedLocation?.includes(item.locationName)}
                  />
                </li>
              ),
          )}
        </FilterList>
      </FilterTypeContainer>
      <FilterButtonWrap>
        <ButtonBase name="적용하기" />
      </FilterButtonWrap>
      {toast && <Toast>필터를 선택해주세요!</Toast>}
    </CustomFilterForm>
  );
};

export default CustomFilter;
