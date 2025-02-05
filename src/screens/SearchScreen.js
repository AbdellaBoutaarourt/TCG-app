import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const categories = [
    {
        name: "Assiettes et plateaux", icon: <Svg width="26" height="12" viewBox="0 0 26 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M25.9482 0.347126C25.8811 0.132045 25.7593 0 25.6277 0H1.0078C0.876158 0 0.754349 0.131951 0.687339 0.347126C0.62033 0.562301 0.618146 0.828561 0.681582 1.0476C1.13402 2.60962 2.37375 4.56806 3.91697 6.15864C4.86756 7.13838 6.68814 8.74112 8.57742 8.93461V9.75507C8.57742 10.9764 9.1007 11.97 9.74389 11.97H16.8916C17.5348 11.97 18.0581 10.9764 18.0581 9.75507V8.93461C19.9474 8.74112 21.7679 7.13838 22.7185 6.15864C24.2617 4.56806 25.5015 2.60962 25.9539 1.0476C26.0174 0.828561 26.0152 0.562207 25.9482 0.347126ZM16.8916 10.5561H9.74389C9.51124 10.5561 9.32198 10.1967 9.32198 9.75497V8.95384H17.3135V9.75497C17.3135 10.1967 17.1243 10.5561 16.8916 10.5561ZM17.6858 7.54008H8.9497C6.35702 7.54008 3.04276 4.08531 1.74714 1.41376H24.8884C23.5927 4.08531 20.2785 7.54008 17.6858 7.54008Z" fill="black" />
        </Svg>
    },
    {
        name: "Barquettes et conteneurs", icon: <Svg width="26" height="16" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M1.22727 5.1V5.6H1.72727H17.2727H17.7727V5.1V2.55C17.7727 1.79689 17.1546 1.2 16.4091 1.2H2.59091C1.8453 1.2 1.22727 1.79692 1.22727 2.55V5.1ZM1.72727 6.3H1.22727V6.8V14.45C1.22727 15.2031 1.8453 15.8 2.59091 15.8H16.4091C17.1546 15.8 17.7727 15.2031 17.7727 14.45V6.8V6.3H17.2727H1.72727ZM0.5 2.55C0.5 1.42528 1.42859 0.5 2.59091 0.5H16.4091C17.5714 0.5 18.5 1.42528 18.5 2.55V14.45C18.5 15.5747 17.5714 16.5 16.4091 16.5H2.59091C1.42859 16.5 0.5 15.5747 0.5 14.45V2.55Z" stroke="black" />
        </Svg>
    },
    {
        name: "Boites à burger", icon: <Svg width="26" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16.3435 1.44062C14.7492 0.511595 12.6445 0 10.4173 0H8.58267C6.35555 0 4.25085 0.511595 2.65655 1.44062C0.943457 2.43884 0 3.80651 0 5.29166V6H19V5.29166C19 3.80651 18.0565 2.43884 16.3435 1.44062ZM1.55943 4.58333C2.19365 2.80713 5.15263 1.41667 8.58276 1.41667H10.4174C13.8475 1.41667 16.8065 2.80713 17.4407 4.58333H1.55943Z" fill="black" />
            <Path d="M19 12H0V13H19V12Z" fill="black" />
            <Path d="M15.1999 8C14.0892 8 13.5073 8.23558 12.9939 8.44342C12.5443 8.62546 12.1891 8.76923 11.3997 8.76923C10.6103 8.76923 10.2552 8.62546 9.80561 8.44342C9.29225 8.23573 8.71038 8 7.59978 8C6.48917 8 5.9073 8.23558 5.39394 8.44342C4.94435 8.62546 4.58926 8.76923 3.79991 8.76923C3.01056 8.76923 2.65543 8.62546 2.20584 8.44342C1.69248 8.23573 1.1106 8 0 8V9.23077C0.789351 9.23077 1.14448 9.37454 1.59407 9.55658C2.10743 9.76427 2.68931 10 3.79991 10C4.91051 10 5.49234 9.76442 6.0057 9.55658C6.45529 9.37454 6.81042 9.23077 7.59978 9.23077C8.38913 9.23077 8.74426 9.37454 9.19385 9.55658C9.70725 9.76427 10.2891 10 11.3997 10C12.5104 10 13.0923 9.76442 13.6057 9.55658C14.0553 9.37454 14.4104 9.23077 15.1999 9.23077C15.9893 9.23077 16.3444 9.37454 16.7941 9.55658C17.3075 9.76427 17.8894 10 19 10V8.76923C18.2106 8.76923 17.8554 8.62546 17.4058 8.44342C16.8923 8.23558 16.3104 8 15.1999 8Z" fill="black" />
            <Path d="M0 18.0769C0.000332072 18.3217 0.113747 18.5563 0.315365 18.7293C0.516983 18.9024 0.790341 18.9997 1.07547 19H17.9245C18.2097 18.9997 18.483 18.9024 18.6846 18.7293C18.8863 18.5563 18.9997 18.3217 19 18.0769V15H0V18.0769ZM1.43396 16.2308H17.566V17.7692H1.43396V16.2308Z" fill="black" />
        </Svg>
    },
    {
        name: "Couverts et ustensiles", icon: <Svg width="26" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.4831 14.0001V3.00006M12.4831 14.0001C10.8247 14.0001 9.48038 15.4355 9.48038 16.6251C9.48038 18.3751 10.8247 21.0001 12.4831 21.0001C14.1414 21.0001 15.4857 18.3751 15.4857 16.6251C15.4857 15.4355 14.1414 14.0001 12.4831 14.0001Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M5.47841 10.0283V21M4.18615 3.12945L3.40347 3.20753C2.83225 3.26452 2.42596 3.78885 2.51382 4.35564L3.1828 8.67118C3.29612 9.40225 3.926 10.0106 4.66644 10.0106H6.2904C7.03083 10.0106 7.66071 9.40225 7.77404 8.67118L8.44301 4.35564C8.53087 3.78885 8.12458 3.26452 7.55336 3.20753L6.77337 3.12962C5.91311 3.04368 5.04642 3.04363 4.18615 3.12945Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M18.496 13.8182V3.02594C19.6545 3.34592 21.5815 4.55268 21.9006 7.52842L22.4737 12.0424C22.5743 12.8351 22.3727 13.6261 21.5846 13.7616C20.9244 13.8751 19.9229 13.9122 18.496 13.8182ZM18.496 13.8182V21.0001" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    },
    {
        name: "Emballages pour pizza", icon: <Svg width="26" height="16" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M23.8421 15.1024L20.4515 5.66473C20.324 5.3098 19.9874 5.0731 19.6103 5.0731H16.91V2.06666C16.91 1.57304 16.5098 1.17285 16.0162 1.17285C15.5225 1.17285 15.1223 1.57304 15.1223 2.06666V5.0731H8.77238V2.06666C8.77238 1.57304 8.37219 1.17285 7.87857 1.17285C7.38495 1.17285 6.98476 1.57304 6.98476 2.06666V5.0731H4.28448C3.90734 5.0731 3.57085 5.30985 3.44326 5.66473L0.0525963 15.1024C0.0189477 15.1962 0 15.2996 0 15.4045V21.1062C0 21.5998 0.400189 22 0.89381 22H23.0009C23.4945 22 23.8947 21.5998 23.8947 21.1062V15.4045C23.8947 15.3018 23.8764 15.1977 23.8421 15.1024ZM4.91311 6.86072H6.98476V8.71228C6.98476 9.2059 7.38495 9.60609 7.87857 9.60609C8.37219 9.60609 8.77238 9.2059 8.77238 8.71228V6.86072H15.1223V8.71228C15.1223 9.2059 15.5224 9.60609 16.0161 9.60609C16.5097 9.60609 16.9099 9.2059 16.9099 8.71228V6.86072H18.9815L21.73 14.5107C20.9524 14.5107 2.75937 14.5107 2.16466 14.5107L4.91311 6.86072ZM14.1448 16.2983C13.2315 18.0981 10.663 18.0977 9.74987 16.2983H14.1448ZM22.1071 20.2123H1.78762V16.2983H7.84534C8.33682 18.1131 10.0005 19.438 11.9473 19.438C13.8942 19.438 15.5578 18.1132 16.0493 16.2983H22.1071V20.2123Z" fill="black" />
            <Path d="M11.9473 4.31677C12.441 4.31677 12.8412 3.91658 12.8412 3.42296V0.89381C12.8412 0.400189 12.441 0 11.9473 0C11.4537 0 11.0535 0.400189 11.0535 0.89381V3.42291C11.0535 3.91658 11.4537 4.31677 11.9473 4.31677Z" fill="black" />
        </Svg>
    },
    {
        name: "Gobelets et verres", icon: <Svg width="26" height="20" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M11.938 6.53284L11.2464 0.672676C11.2012 0.289041 10.8769 0 10.4918 0H1.50832C1.12317 0 0.798888 0.289041 0.753594 0.672676L0.0620168 6.53284C-0.395868 10.4131 1.71679 14.0834 5.24003 15.6453V21.6177L3.65882 22.5875C3.36844 22.7656 3.23149 23.1157 3.32375 23.4443C3.41601 23.7729 3.71491 24 4.0553 24H7.94477C8.28517 24 8.58406 23.7729 8.67633 23.4443C8.76859 23.1157 8.63164 22.7656 8.34125 22.5875L6.76005 21.6177V15.6453C10.2832 14.0834 12.3959 10.4131 11.938 6.53284ZM1.57148 6.71205L2.18364 1.52448H9.81644L10.4286 6.71205C10.5741 7.94558 10.4054 9.1535 9.97771 10.2469H2.02237C1.59458 9.1535 1.42587 7.94558 1.57148 6.71205ZM2.83866 11.7713H9.16134C8.38868 12.8756 7.30738 13.7692 6 14.3156C4.69262 13.7693 3.6114 12.8756 2.83866 11.7713Z" fill="black" />
        </Svg>
    },
    { name: "Films et Papiers alimentaires", icon: "filmstrip" },
    { name: "Rouleaux de papier aluminium", icon: "roll-paper" },
    { name: "Sachets et pochettes", icon: "bag-personal" },
];

const filters = ["Tous", "Bois", "Frigolite", "Plastique", "Papier", "Verre", "Aluminium"];

const SearchScreen = () => {
    const [selectedFilter, setSelectedFilter] = useState("Tous");
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Barre de recherche */}
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    placeholder="Rechercher un produit"
                    style={styles.searchInput}
                />
            </View>

            {/* Filtres */}
            <View style={styles.filterContainer}>
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
            </View>

            {/* Liste des catégories */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {categories.map((category, index) => (
                    <TouchableOpacity key={index} style={styles.categoryItem}
                        onPress={() => navigation.navigate("CategoryProducts", { category: category.name })}
                    >
                        <View style={styles.categoryContent}>
                            <Text style={styles.categoryText}>{category.icon}</Text>
                            <Text style={styles.categoryText}>{category.name}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="gray" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 10,
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
        flexWrap: "wrap",
        gap: 5,
        alignItems: 'flex-start',
        alignContent: 'flex-start'
    },
    filterButton: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        borderRadius: 20,
        minWidth: 80
    },
    activeFilter: {
        backgroundColor: "#DEEDE0",
    },
    filterText: {
        fontSize: 13,
        fontFamily: 'InterBold',
        textAlign: 'center'
    },
    activeFilterText: {
        color: "#008E5C",
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    categoryContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10
    },
    categoryText: {
        fontSize: 13,
        fontFamily: 'InterBold',
    },
});

export default SearchScreen;
