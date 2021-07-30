import React, { useState } from 'react';
import { Text, View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import DataTableRow from './DataTableRow';
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');

export const COL_TYPES = {
    RADIO: 'RADIO',
    INT: 'INT',
    STRING: 'STRING',
    ICON: 'ICON'
}


const PADDING_HORIZONTAL = 15;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 40;

const TOTAL_WIDTH = 100; //'100%'

class DataTable extends React.Component {
    state = {
        data: [], //[{...}, {...}, ....]
        colNames: [],//['ad', 'asd', ...]
        defaultEachColumnWidth: '50%',
        noOfCols: 0, //default 2, set 0 because of fast rendering at start
        widthOfContainer: width
    }

    handleColPress = (name) => {
        console.log(name)
        this.state.data
    }

    componentDidMount() {
        this.colTypes = this.props.colSettings;
        this.colNameType = {}
        this.props.colSettings.forEach(setting => {
            if (!this.props.colNames.includes(setting.name)) throw new Error('No Column exists which mentioned in provided colSettings Name!')
            this.colNameType[setting.name] = setting.type;
        })
        this.setState((state) => {
            const noOfCols = this.props.colNames.length;
            return {
                data: [...this.props.data],
                colNames: [...this.props.colNames],
                defaultEachColumnWidth: TOTAL_WIDTH / noOfCols + '%',
                noOfCols: noOfCols
            }
        });
    }

    render() {
        console.log(this.state.noOfCols)
        return (
            <View style={styles.componentContainer} 
            onLayout={e => {
                this.setState({widthOfContainer: e.nativeEvent.layout.width})
            }}>

                <View style={styles.headerContainer}>
                    {
                        this.state.colNames.map((colName, index) => {
                            const colType = this.colNameType[colName]
                            const textAlign = (colType == COL_TYPES.STRING || colType == null) ? 'left' : (colType == COL_TYPES.ICON || colType == COL_TYPES.RADIO) ? 'center' : 'right'
                            let paddingLeft = 0;
                            let paddingRight = 0;
                            if (textAlign == 'left') {
                                paddingLeft = 13
                                paddingRight = 1;
                            } else if (textAlign == 'right') {
                                paddingRight = 13;
                                paddingLeft = 1
                            }
                            return (

                                <TouchableOpacity key={index} style={[styles.headerRow, { width: this.state.defaultEachColumnWidth }]} onPress={this.handleColPress.bind(null, colName)}>
                                    <Text
                                        style={{
                                            color: 'grey',
                                            fontSize: 12,
                                            textAlign,
                                            paddingLeft,
                                            paddingRight
                                        }}>
                                        <Image source={require('../assets/doubleArrow.png')} />

                                        {' ' + colName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    }

                </View>

                <View style={[styles.line, {width: this.state.widthOfContainer}]} />

                {this.state.data &&
                    this.state.data.map((item, index) => <DataTableRow
                        widthOfLine={this.state.widthOfContainer}
                        key={index}
                        data={item}
                        colNameType={this.colNameType}
                        colNames={this.state.colNames}
                        style={{ defaultWidth: this.state.defaultEachColumnWidth }}
                    // getRowSelectedData={getRowSelectedData} 
                    />)}
                <View style={styles.lastRow}>

                </View>
            </View>
        );
    }
}

export default DataTable;

const styles = StyleSheet.create({
    componentContainer: {
        backgroundColor: '#e4edec',
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingBottom: PADDING_BOTTOM,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'green'
    },
    headerRow: {
        paddingTop: PADDING_TOP,
        paddingBottom: 18,
        // backgroundColor: 'green'
    },
    firstColContainer: {
        width: '20%',
        // backgroundColor: 'green'
    },
    firstColLabel: {
        color: 'grey',
        fontSize: 12
    },
    line: {
        height: 0.2,
        backgroundColor: 'grey',
        width,
        alignSelf: 'center'
    },
    lastRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});

DataTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    colNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    colSettings: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,//Col Name
            type: PropTypes.string, //radio ||  int || string || icon
            width: PropTypes.string,
            showFullText: PropTypes.bool, //tranc || adjustSizeToFit
            noOfLines: PropTypes.number
        })
    ),
    showNoOfRowsAtATime: PropTypes.number //default all
}
