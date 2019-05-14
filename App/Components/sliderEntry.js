import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './Styles/SliderEntryStyle'

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.string.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data, parallax, parallaxProps, even } = this.props;
        return (
          <ParallaxImage
            source={{ uri: data }}
            containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
            style={styles.image}
            parallaxFactor={0.35}
            showSpinner={true}
            spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
            {...parallaxProps}
          />
        );
    }

    imageClicked(){
        alert("Hello Testing.... ");
    }
    

    render () {
        const { data, even } = this.props;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              >
                <View style={styles.shadow} />
                <View
                    style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
            </TouchableOpacity>
        );
    }
}