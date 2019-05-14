import React, { Component } from 'react';
import { View, Dimensions, Image, PixelRatio, Text, TouchableWithoutFeedback } from 'react-native';

// Create a component
let ScreenWidth = Dimensions.get("window").width;

class SliderFullImage extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={[styles.containerStyle]}>
                 <TouchableWithoutFeedback>
                 <Image 
                         source={{ uri: this.props.image }}
                         style={{width:this.props.width, 
                                height: this.props.height, 
                                resizeMode:'cover', 
                                overflow: 'hidden',
                                alignSelf:'center',
                             }}
                         />
                 </TouchableWithoutFeedback>
             </View>
           );
    }
}

export default SliderFullImage;

const styles = {
  containerStyle: {
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
};

