/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { api } from '@infra/api';

export const useGetPlacesOfFilter = (queryParam?: Record<string, string | number>) => {
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ['getPlacesOfFilter'],
    queryFn: ({ pageParam }) => api.places.getPlacesOfFilter(queryParam!, pageParam),
    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.totalItems) {
        const totalPages = Math.ceil(lastPage.data.totalItems / 12);
        return allPages.length !== totalPages ? allPages.length + 1 : undefined;
      }
    },

    retry: 0,
    enabled: false,
  });

  // 새로운 필터들을 선택 시 장소가 중복되어 담기지 않도록 정리 필요!
  const filterPlaceData: PlacesType[] = [];
  const idsSet = new Set<number>();

  if (data?.pages) {
    data.pages.map((page: any) => {
      page.data.result.map((place: PlacesType) => {
        if (!idsSet.has(place.id)) {
          idsSet.add(place.id);
          filterPlaceData.push(place);
        }
      });
    });
  }

  return { data: filterPlaceData, ...rest };
};

export const useGetPlacesOfCategory = (id: number, queryParams?: Record<string, string>) => {
  const { data, isLoading, ...rest } = useInfiniteQuery({
    queryKey: ['getPlacesOfCategory'],
    queryFn: ({ pageParam }) => api.places.getPlacesOfCategory(id, pageParam, queryParams),
    initialPageParam: 1, // v5 달라진 점

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.totalItems) {
        const totalPages = Math.ceil(lastPage.data.totalItems / 12);
        return allPages.length !== totalPages ? allPages.length + 1 : undefined;
        // return값이 pageParam으로 전달
      }
    },

    retry: 0,
  });

  const placeData = data?.pages.flatMap(page => page?.data.result) as PlacesType[];

  return { data: placeData, isLoading, ...rest };
};

export const useGetInfoByPlaceId = (placeId: number) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ['getInfoByPlaceId'],
    queryFn: () => api.places.getInfoByPlaceId(placeId),
    retry: 2,
  });

  return { data, isLoading, ...rest };
};

export const useGetPlacesNearBy = (queryParams: Record<string, number>) => {
  const { data, ...rest } = useQuery({
    queryKey: ['getPlacesNearBy'],
    queryFn: () => api.places.getPlacesNearBy(queryParams),
    enabled: false,
    retry: 1,
  });

  return { data, ...rest };
};
