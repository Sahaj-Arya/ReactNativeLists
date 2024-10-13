import { ActivityIndicator, FlatList, Text } from "react-native";
import character from "../data/character.json";
import CharacterListItem from "./CharacterListItem";
import { Character } from "../types";
import { useEffect, useState } from "react";
let timer;
let initialPage: string = "https://rickandmortyapi.com/api/character?page=1";
const MyList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(character?.info);

  const fetchApi = async (url: string = "") => {
    const res = await fetch(initialPage);
    const response = await res.json();
    setItems(response.results);
    setPagination(response?.info);
    clearTimeout(timer);
    timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  useEffect(() => {
    fetchApi();
  }, []);

  const loadMore = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    const res = await fetch(pagination?.next);
    const response = await res.json();
    setItems((prev) => [...prev, ...response.results]);
    setPagination(response?.info);
    clearTimeout(timer);

    setLoading(false);
  };
  const onRefresh = async () => {
    fetchApi(initialPage);
  };

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => {
        // console.log(item.id);
        return <CharacterListItem character={item} />;
      }}
      contentContainerStyle={{ gap: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      keyExtractor={(item) => item?.id?.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={5}
      ListFooterComponent={() =>
        loading ? <ActivityIndicator size="large" /> : null
      }
      refreshing={loading}
      onRefresh={onRefresh}
      // debug
      windowSize={1}
      viewabilityConfig={{
        minimumViewTime: 5000,
        itemVisiblePercentThreshold: 60,
      }}
      onViewableItemsChanged={({ changed, viewableItems }) => {
        changed.forEach((changedItems) => {
          if (changedItems.isViewable) {
            console.log("+1 for ", changedItems.item.id);
          }
        });
      }}
      numColumns={2}
    />
  );
  // return <CharacterListItem character={character.results[0]} />;
};

export default MyList;
