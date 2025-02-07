import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const categories = [
    { name: "Assiettes & plateaux", image: require('../images/assietes.png') },
    { name: "Barquettes & conteneurs", image: require('../images/barque.png') },
    { name: "Boîtes à burger", image: require('../images/burger.png') },
    { name: "Couverts & ustensiles", image: require('../images/couvert.png') },
    { name: "Emballages \npour kapsalon", image: require('../images/pizza.png') },
    { name: "Gobelets &\nverres", image: require('../images/barque.png') },
    { name: "Papiers &\nfilms alimentaires", image: require('../images/couvert.png') },
    { name: "Rouleaux de \npapier aluminium", image: require('../images/assietes.png') },
    { name: "Sachets & pochettes", image: require('../images/couvert.png') },
];

const filters = ["Tous", "Bois", "Frigolite", "Plastique", "Papier", "Verre", "Aluminium"];

const SearchScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("Tous");
    const navigation = useNavigation();

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate("CategoryProducts", { categoryName: item.name })}
        >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{item.name}</Text>
        </TouchableOpacity>
    );



    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    placeholder="Rechercher un produit"
                    style={styles.searchInput}
                />
            </View>

            <Text style={{ marginHorizontal: 20, marginBottom: 5, fontFamily: "InterBold", fontSize: 13 }}
            >Matérial</Text>


            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={{ paddingBottom: 5 }}
            >
                {filters.map((filter, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedFilter(filter)}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter && styles.activeFilter,
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter && styles.activeFilterText,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.name}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ backgroundColor: '#F1F5F9', paddingVertical: 10 }}
                columnWrapperStyle={{ justifyContent: "space-between", marginHorizontal: 10 }}
            />

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingTop: 50,
        flex: 1,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F5F9",
        borderRadius: 100,
        paddingHorizontal: 15,
        paddingVertical: 3,
        marginBottom: 10,
        marginHorizontal: 16,

    },
    searchInput: {
        marginLeft: 10,
        flex: 1,
        fontSize: 16,
        color: "#333",

    },
    filterContainer: {
        flexDirection: "row",
        marginBottom: 10,
        height: 55,
        marginHorizontal: 16,
    },
    filterButton: {
        paddingHorizontal: 15,
        borderWidth: 1,
        height: 40,
        borderColor: "#CCCCCC",
        borderRadius: 7,
        marginRight: 10,
        justifyContent: "center",
    },
    activeFilter: {
        backgroundColor: "#008E5C",
        borderWidth: 0,
    },
    filterText: {
        fontSize: 14,
        fontFamily: "InterBold",
        textAlign: "center",
        color: "black",
    },
    activeFilterText: {
        color: "#fff",
    },
    categoryItem: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#FFF",
        justifyContent: 'space-between',
        borderRadius: 10,
        margin: 5,
        paddingLeft: 10,
        flexDirection: 'row-reverse'
    },
    categoryImage: {
        width: 80,
        height: 110,
    },
    categoryText: {
        fontSize: 12,
        fontFamily: "InterBold",
        textAlign: "left",
        maxWidth: 100
    },
});



export default SearchScreen;