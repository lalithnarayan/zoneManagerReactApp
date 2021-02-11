import React, { Component } from 'react'
import { Image, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native';
import LoginActions from '../Redux/LoginRedux'
import {
  Content,
  Text,
  // List,
  // ListItem,
  Icon,
  Container,
  // Left,
  Right,
  Badge,
  View
} from 'native-base';
import Styles from './Styles/SideMenuStyle'
import { Images } from '../Themes'

export const Menulist = [
  /** Transporter **/
    {
    name: 'Events',
    icon: 'truck',
    type: 'FontAwesome5',
    route: 'EventsListScreen'
  },
    {
    name: 'Feedback',
    icon: 'envelope',
    type: 'SimpleLineIcons',
    route: 'FeedbackList'
  },
  {
    name: 'Development Works',
    icon: 'toolbox',
    type: 'FontAwesome5',
    route: 'DevelopmentWorksList'
  },
  {
    name: 'Beneficiary Schemes',
    icon: 'dashboard',
    type: 'Octicons',
    route: 'BeneficiaryListingScreen'
  },
    {
    name: 'Facebook Page',
    icon: 'facebook-square',
    type: 'FontAwesome',
    route: 'FacebookPage'
  },
  {
    name: 'Profile',
    icon: 'user',
    type: 'FontAwesome',
    route: 'UserSettings'
  },
  // {
  //   name: 'Settings',
  //   icon: 'settings',
  //   type: 'SimpleLineIcons',
  //   route: 'TransporterSettings'
  // }
]
import { connect } from 'react-redux'

// Styles
import styles from './Styles/SideMenuStyle'

class SideMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    }

    this.renderMenuList = this.renderMenuList.bind(this)
  }
  navigateToScreen = (route) =>  {
    const { navigate } = this.props.navigation;
    navigate(route)

  }
  async deleteToken() {
    try {
      await AsyncStorage.removeItem('accessToken')
    } catch (err) {
      console.log(`The error is: ${err}`)
    }
    this.props.navigation.navigate('Login')
  }
  onLogout = () => {
    const { access_token } = this.props.userObj ? this.props.userObj.user : {};
    const accessToken = access_token;
    this.props.deleteToken(accessToken);
    const { navigate } = this.props.navigation;
    this.deleteToken();
  }
  renderMenuList(menus) {
    return menus.map((menu) => {
      return (
        <TouchableOpacity key={menu.route} style={Styles.profileItem} underlayColor='transparent' onPress={() => {
          this.navigateToScreen(menu.route)
        }}>
          <View style={Styles.navBtn}>
            <View style={Styles.navBtnLeft}>
              <Icon name={menu.icon} type={menu.type || 'FontAwesome'} style={Styles.navBtnIcon} />
            </View>
            <Text style={Styles.navBtnText}>{menu.name}</Text>
          </View>
          {
            menu.types &&
            <Right style={{ flex: 1 }}>
              <Badge>
                <Text
                  style={Styles.badgeText}
                >{`${menu.types}`}</Text>
              </Badge>
            </Right>
          }
        </TouchableOpacity>
      )
    })
  }
  render() {
    const user = this.props.userObj ? this.props.userObj.user : {};
    return (
      <Container>
        <Content
          bounces={false}
          contentContainerStyle={Styles.layout}
          render
        >
          <Image source={Images.navImage} resizeMode='cover' style={Styles.navImg} />
          <View style={Styles.nav}>
            <View style={Styles.navProfile}>
              <Image source={Images.background} style={Styles.bgImg} />
              <Icon name='user' type="FontAwesome5" style={Styles.hUserIcon} />
              
              <Text style={Styles.navName}>{user ? user.name : 'Citizen'}</Text>
            </View>

            <View style={Styles.navMenu}>
              <ScrollView>
                {this.renderMenuList(Menulist)}
              </ScrollView>

            </View>

          </View>
          <TouchableOpacity style={Styles.acceptBtn} onPress={this.onLogout}>
            <Text style={Styles.btnText}>Logout</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userObj: state.root.userDetails,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteToken: (accessToken) => dispatch(LoginActions.logoutRequest(accessToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
