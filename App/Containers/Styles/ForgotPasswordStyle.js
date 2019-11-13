import { StyleSheet, Platform } from 'react-native'

import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
    /** Header **/
    hTop: {
      flexDirection: 'column',
      alignItems: 'center',
      marginHorizontal: 15,
      marginBottom: 15
    },
    hImg: {
      fontSize: 86,
      color: '#FFD328',
      marginHorizontal: 10,
    },
    hRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    hContent: {
      justifyContent: 'center',
      marginLeft: 10
    },
    hTopText: {
      fontSize: 20,
      marginBottom: 10
    },
    hTopDesc: {
      fontSize: 12,
      lineHeight: 18,
      marginBottom: 10,
      textAlign: 'center'
    },
  
    /** Form **/
    regForm: {
      width: '100%',
      marginBottom: 15
    },
    regText: {
      fontSize: 12,
      // 
      color: '#FFF'
    },
    infoBox: {
      backgroundColor: '#FFF',
      marginHorizontal: 20,
      borderRadius: 3,
      padding: 15,
      marginBottom: 20
    },

    fRow: {
      position:'relative',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      ...Platform.select({
        ios: {
          paddingVertical: 10,
        },
      }),
      paddingHorizontal: 5,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderColor: 'rgba(36,42,56,0.07)'
    },
    fRowError: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    ...Platform.select({
      ios: {
        paddingVertical: 10,
      },
    }),
    paddingHorizontal: 5,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderColor: '#bb0000',
    backgroundColor: '#fff6f6',
  },
    fErrorLabel:{
    color: '#bb0000',
    fontSize: 10,
    position: 'absolute',
    bottom: -15,
  },

    fIcon: {
      color: 'rgba(36,42,56,0.4)',
      fontSize: 24,
      width: 30,
      marginRight: 5
    },
    fInput: {
      flex: 1,
      // 
      fontSize: 12
    },

    forgotPassword: {
      // 
      fontSize: 12,
      alignSelf: 'flex-end',
      color: 'rgba(36,42,56,0.8)'
    },
  
    account: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 20
    },
    accountText: {
      // 
      fontSize: 12,
      color: 'rgba(36,42,56,0.8)'
    },
    accountBtn: {
      paddingVertical: 5,
      paddingHorizontal: 5
    },
    accountBtnText: {
      // 
      fontSize: 12,
      color: 'rgba(36,42,56,0.99)'
    },
  errorText: {  
    fontSize: 12,
    color: Colors.fire,
    marginBottom: Metrics.baseMargin,
  },
})
