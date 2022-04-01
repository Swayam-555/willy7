import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import db from "../config"
export default class SearchScreen extends React.Component {
    constructor() {
        super()
        this.state = {

            search: '',
            allTransactions: [],
            lastTransaction: null
        }
    }
    fetchTransactions = async (searchText) => {
        searchText = searchText.split("")[0].toUpperCase() + searchText.split("")[1].toLowerCase() + searchText.substring(2);
        console.log(searchText)
        var firstAlphabet = searchText.split("")[0];
        if (firstAlphabet === "B") {
            var transaction = await db.collection("transactions").where("bookId", "==", searchText).limit(5).get();
            transaction.docs.map(doc => {
                this.setState({
                    allTransactions: [...this.setState.allTransactions, doc.data()],
                    lastTransaction: doc
                })
            })
        }
        else if (firstAlphabet === "S") {
            var transaction = await db.collection("transactions").where("studentId", "==", searchText).limit(5).get();
            transaction.docs.map(doc => {
                this.setState({
                    allTransactions: [...this.setState.allTransactions, doc.data()],
                    lastTransaction: doc
                })
            })
        }
    }
    fetchMore = async (searchText) => {
        searchText = searchText.split("")[0].toUpperCase() + searchText.split("")[1].toLowerCase() + searchText.substring(2);
        console.log(searchText)
        var firstAlphabet = searchText.split("")[0];
        if (firstAlphabet === "B") {
            var transaction = await db.collection("transactions").where("bookId", "==", searchText).startAfter(this.state.lastTransaction).limit(5).get();
            transaction.docs.map(doc => {
                this.setState({
                    allTransactions: [...this.setState.allTransactions, doc.data()],
                    lastTransaction: doc
                })
            })
        }
        else if (firstAlphabet === "S") {
            var transaction = await db.collection("transactions").where("studentId", "==", searchText).startAfter(this.state.lastTransaction).limit(5).get();
            transaction.docs.map(doc => {
                this.setState({
                    allTransactions: [...this.setState.allTransactions, doc.data()],
                    lastTransaction: doc
                })
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TextInput placeholder="ENTER BOOK ID/STUDENT ID"
                    style={styles.input}
                    onChangeText={text => {
                        this.setState({
                            search: text
                        })
                    }}
                />

                <TouchableOpacity style={{ backgroundColor: "yellow" }}
                    onPress={() => this.fetchTransactions(this.state.search)}

                >
                    <Text>
                        Search
                        </Text>
                </TouchableOpacity>
                <FlatList
                    data={this.state.allTransactions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{"book Id" + item.bookId}</Text>
                            <Text>{"student Id" + item.studentId}</Text>
                            <Text>{"Transaction type" + item.transactionType}</Text>
                            <Text>{"Date" + item.date}</Text>
                        </View>
                    )}
                    onEndReached={() => this.fetchMore(this.state.search)}
                    onEndReachedThreshold={0.5}>

                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },

    input: {

        width: 200,
        height: 25,
        borderWidth: 3,

    }

})
