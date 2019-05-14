import React, { Component } from 'react';
import { View, Dimensions, Image, PixelRatio, Text, TouchableWithoutFeedback } from 'react-native';

// Create a component
let ScreenWidth = Dimensions.get("window").width;

class SliderItem extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={[styles.containerStyle, {height: this.props.height-30}]}>
                 <TouchableWithoutFeedback
                     onPressIn={this.props.onImageItemClick(this.props.image, this.props.keyValue)}>
                 <Image 
                         source={{ uri: this.props.image }}
                         style={{width:this.props.imageDimension, height: this.props.imageDimension, 
                             resizeMode:'cover', 
                             borderRadius: 10,
                             overflow: 'hidden',
                             alignSelf:'center',
                             }}
                         />
                 </TouchableWithoutFeedback>
             </View>
           );
    }
}

export default SliderItem;

const styles = {
  containerStyle: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
    
  },
};

