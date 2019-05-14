import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './Styles/SliderEntryStyle';
import SliderEntry from './sliderEntry';
import styles, { colors } from './Styles/ImageViewerStyle';
import { scrollInterpolators, animatedStyles } from '../Lib/animation';
import Slick from 'react-native-slick';
import SliderItem  from './SliderItem';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const ScreenWidth = Dimensions.get('window').width;

export default class ImageViewerComponent extends Component {

    constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} />;
    }

    mainExample (number, title) {
        const { slider1ActiveSlide } = this.state;
        const { data } = this.props;
        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>Images</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={data}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={data.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    renderSlickSlider(){
        const { data } = this.props;
        return (
            <Slick
                dot={<View style={{ backgroundColor: 'rgba(220, 221, 208, 1)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7 }} />}
                activeDot={<View style={{ backgroundColor: 'rgba(1, 135, 232, 1)', width: 8, height: 8, borderRadius: 4, marginLeft: 7, marginRight: 7 }} />}
                paginationStyle={{
                bottom: 20
                }}
                loop={true}
                autoplay={true}
                autoplayTimeout={5.0}>
               { 
                   data.map((imageData, i) => 
                   <SliderItem
                    keyValue={i} 
                    image={imageData} imageDimension={ ScreenWidth / 2}
                    height={ (ScreenWidth / 2) +  60 }
                    onImageItemClick= {() => this.imageClicked}>
                   </SliderItem>)
                }

          </Slick>
        )
    }

    imageClicked = (image, keyValue) => {
        //alert("Hello Testing .... ", keyValue);
        console.log("Hello Testing...");
        this.props.onFullScreenEvent();
    }

    render () {
        var carousel;
        const { data, onFullScreenEvent } = this.props;
        if(onFullScreenEvent === undefined){
            carousel = this.mainExample(1, 'Default layout | Loop | Autoplay | Parallax | Scale | Opacity | Pagination with tappable dots');
        }else {
            carousel  = this.renderSlickSlider(); 
        }
        console.log("Data..... ", this.props);
        return (
            <SafeAreaView style={[styles.safeArea, { height: (ScreenWidth / 2) +  80 }]}>
              {data && data.length ? carousel : null}
            </SafeAreaView>
        );
    }
}