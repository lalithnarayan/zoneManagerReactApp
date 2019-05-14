import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, TouchableOpacity, Image, AsyncStorage,Dimensions } from 'react-native';
import { Container, Header, Content, Icon, Text, View, Badge } from 'native-base';

import HeaderComponent from '../Components/HeaderComponent';
import Styles from './Styles/BenefeciaryDetailViewStyle';
import Slick from 'react-native-slick';
import SliderFullImage  from '../Components/SliderFullIImage';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight =  Dimensions.get('window').height;

class FullScreenImages extends Component {
    constructor(props){
        super(props);
    }


    renderSliderImage(data){
        return(
            <Slick
            dot={<View style={{ backgroundColor: 'rgba(36, 42, 56, 1)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7 }} />}
            activeDot={<View style={{ backgroundColor: 'rgba(36, 42, 56, 1)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7 }} />}
            paginationStyle={{
                bottom: 20
            }}
            height={ScreenHeight - 100}
            loop={true}
            autoplay={false}>
           { 
               data.map((imageData, i) => 
               <SliderFullImage
                keyValue={i} 
                image={imageData} width ={ ScreenWidth}
                height={ ScreenWidth - 60 }>
               </SliderFullImage>)
            }

        </Slick>
        );
    }

    render(){
        const {navigation} = this.props;
        const backScreen = navigation.getParam('backScreen', 'NetworkError');
        const data = navigation.getParam('data', []);
        return (
            <Container>
                <Header style={Styles.navigation}>
                    <StatusBar backgroundColor="#242A38" animated barStyle="light-content" />
                    <View style={Styles.nav}>
                        <View style={Styles.navLeft}>
                            <View style={Styles.navLeft}>
                            </View>
                        </View>
                        <View style={Styles.navMiddle}>
                        </View>
                        <TouchableOpacity style={Styles.navRight}
                            onPress={() => { navigation.navigate(backScreen); }}>
                            <Icon name='times' type="FontAwesome5" style={Styles.navIcon} />
                        </TouchableOpacity>
                    </View>
                </Header> 
                <Content contentContainerStyle={[Styles.layoutDefault, {backgroundColor: '#242A38'}]}>

                    {this.renderSliderImage(data)}
                
                </Content>   
            </Container>
        )
    }
}

export default FullScreenImages;