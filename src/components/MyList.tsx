import { ActivityIndicator, FlatList, Text } from "react-native";
import character from "../data/character.json";
import CharacterListItem from "./CharacterListItem";
import { Character } from "../types";
import { useEffect, useState } from "react";
let timer;
const MyList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState();

  useEffect(() => {
    const fetchApi = async () => {
      const res = await fetch(
        "https://rickandmortyapi.com/api/character?page=1"
      );
      const response = await res.json();
      setItems(response.results);
      setPagination(response?.info);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchApi();
  }, []);

  const loadMore = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    console.log("fetch,", pagination?.next);

    const res = await fetch(pagination?.next);
    const response = await res.json();
    setItems((prev) => [...prev, ...response.results]);
    setPagination(response?.info);
    clearTimeout(timer);

    setLoading(false);
  };

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => {
        // console.log(item.id);
        return <CharacterListItem character={item} />;
      }}
      contentContainerStyle={{ gap: 50 }}
      keyExtractor={(item) => item?.id?.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={5}
      ListFooterComponent={() =>
        loading ? <ActivityIndicator size="large" /> : null
      }
    />
  );
  // return <CharacterListItem character={character.results[0]} />;
};

export default MyList;
