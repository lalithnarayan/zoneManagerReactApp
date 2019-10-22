import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Text, Button } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Image
} from 'react-native';
import styled from 'styled-components/native'

const Wrapper = styled.View`
  margin: 8px 0px;
`

const Label = styled(Text)`
  font-size: 12;
  color: #278D27;
  margin: 4px;
`;

const StyledImage = styled(Image)`
  height: 100,
`;


const styles = {
  container: {
    flex: 1,
    backgroundColor: 'grey',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  progressiveInput: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  listViewContainer: {
    flex: 0,
  },
  listView: {
    backgroundColor: 'white',
    margin: 10,
  },
  listItem: {
    padding: 10,
  },
  listItemSeparator: {
    borderWidth: 0.5,
    borderColor: 'lightgrey',
  },
  photoDelete: {
    position: 'absolute',
    right: 5,
    top: 1,
    padding: 3,
    borderRadius: 3,
    backgroundColor: '#FF0000'
  },
  photoDeleteIcon: {
    fontSize: 14,
    color: '#FFF'
  },
  photos: {
    flex: 1,
    flexDirection: 'row',
    padding: 15
  },
  truckImg: {
    height: 80,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 3,
    backgroundColor: 'red',
  },

};


const ImagePickerOptions = {
  title: 'ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಫೋಟೋಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class PhotoPicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    };
    this.renderRow = this.renderRow.bind(this);
  }

  clearAllPhoto = () => {
    this.setState({
      photos: [],
    })
  }

  addPhoto = () => {
    const { photos } = this.state;
    ImagePicker.showImagePicker(ImagePickerOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.resize(response);
      }
    });
  }

  resize = (response) => {
    const { photos } = this.state;
    ImageResizer.createResizedImage(response.uri, 800, 600, 'JPEG', 100)
      .then(({ uri }) => {
        let source = { uri, path: response.path };
        const newPhotos = photos.concat([{ label: response.fileName, file: source }]);
        this.setState({
          photos: newPhotos,
        });
        this.props.onChange(newPhotos);
      }).catch((err) => {
        console.log(err);
        return Alert.alert('Unable to resize the photo',
          'Check the console for full the error message');
      });
  }

  handlePhotoRemove(idx) {
    const photos = this.state.photos.filter((s, sidx) => idx !== sidx);
    this.setState({ photos });
    this.props.onChange(photos);
  }

  renderRow({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.handlePhotoRemove(index)}>
        <Image
          source={item.file}
          resizeMode="cover"
          style={{ flex: 1, width: 100, height: 100, margin: 4 }}
        />
        <View style={styles.photoDelete}>
          <Icon name='trash' type="FontAwesome" style={styles.photoDeleteIcon} />
        </View>
      </TouchableOpacity>
    )
  }
  renderSeparator() {
    return <View style={styles.listItemSeparator} />;
  }

  render() {
    const { label } = this.props;
    const { photos } = this.state;
    return (
      <Wrapper>
        {label ? <Label>{label}</Label> : null}
        <View>
          <Button onPress={() => this.addPhoto()} >
            <Icon name='camera' type="FontAwesome" style={{}} />
          </Button>
        </View>
        <View style={styles.photos}>
          <FlatList
            data={photos}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
            renderItem={this.renderRow}
          />
        </View>
      </Wrapper>
    )
  }
}




PhotoPicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}


export default PhotoPicker;
