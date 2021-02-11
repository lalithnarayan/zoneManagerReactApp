import React, { Component } from 'react';
import { StatusBar, TouchableOpacity, Text, WebView} from 'react-native'
import { Container, Header, Content, Icon,View } from 'native-base'
import { Images } from '../Themes'
import { connect } from 'react-redux'
import LoadingOverlay from '../Components/LoadingOverlay';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import Styles from './Styles/FacebookPageStyle'

class FacebookPage extends Component {
    constructor(props){
        super(props);
        this.state = { visible: true };
    }

    hideSpinner(){
        this.setState({ visible: false });
    }

    render() {
        const { fetching, navigation } = this.props;
        return (
          <Container>
            <Header style={Styles.navigation}>
              <StatusBar backgroundColor="#242A38" animated barStyle="light-content" />
              <View style={Styles.nav}>
                <View style={Styles.navLeft}>
                  <TouchableOpacity style={Styles.navLeft} onPress={() => {
                    navigation.navigate("Home")
                  }}>
                    <Icon name='arrow-back' type="MaterialIcons" style={Styles.navIcon} />
                  </TouchableOpacity>
                </View>
                <View style={Styles.navMiddle}>
                  <Text style={[Styles.textHeader]}>Facebook Page</Text>
                </View>
                <View style={Styles.navRight} />
              </View>
            </Header>
    
            <Content contentContainerStyle={Styles.layoutDefault}>
            <WebView
                source={{uri: 'https://www.facebook.com/Sunilnaik581354/'}}
                style={{width: '100%', height: '100%'}}
                onLoad={() => this.hideSpinner()}
                />
           </Content>

            <LoadingOverlay
                visible={this.state.visible}
                color="white"
                indicatorSize="large"
                messageFontSize={24}
                message="Loading..."/>
          </Container>
        )
      }

}

const mapStateToProps = (state) => {
    return {
      //userObj: state.root.userDetails,
      fetching: state.root.fetching,
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(FacebookPage);

