import React, { Component } from 'react'
import { Container, Content } from 'native-base';
import { Linking } from 'react-native';
import {
  SafeAreaViewWrapper,
  CustomStatusBar,
} from '../Components/ui'
import { SectionHeader } from '../Components/headers'
import { CourseLessonsListView } from '../Components/list-views';

const UsefulLinksList = [{
  title: 'ಭಟ್ಕಳ-ಹೊನ್ನಾವರ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರದ ಮತದಾರರ ಪಟ್',
  desc: '',
  link: 'http://ceo.karnataka.gov.in/ROLLSEARCH2019/Part_List_2019.aspx?ACNO=79',
},
{
  title: 'ಮತದಾರರ ಗುರುತಿನ ಕಾರ್ಡ ಪಡೆಯಲು ಮತ್ತು ವರ್ಗಾಯಿಸಲು ಹಾಗೂ ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿಯ ಸೇವೆ',
  desc: '',
  link: 'https://www.nvsp.in/',
},
{
  title: 'ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಮತ್ತು ಮತದಾರರ ಸಂಭಂದಿತ ಎಲ್ಲಾ ವ್ಯವಹಾರಳು',
  desc: '',
  link: 'https://www.ceokarnataka.kar.nic.in/9',
},
{
  title: 'ಭಟ್ಕಳ ತಾಲ್ಲೂಕಿನ ಗ್ರಾಮಪಂಚಾಯತಗಳ ಅಂತರ್ಜಾಲ ತಾಣ',
  desc: '',
  link: 'http://panchamitra.kar.nic.in/displayDistTal.aspx?context=talukaMap&distCode=1527&talCode=1527002 ',
},
{
  title: 'ಹೊನ್ನಾವರ ತಾಲ್ಲೂಕಿನ ಗ್ರಾಮಪಂಚಾಯತಗಳ ಅಂತರ್ಜಾಲ ತಾಣ',
  desc: '',
  link: 'http://panchamitra.kar.nic.in/displayDistTal.aspx?context=talukaMap&distCode=1527&talCode=1527004',
},
{
  title: 'ತಮಗೆ ಪ್ರತಿ ತಿಂಗಳು ದೊರೆತ ರೇಶನ್‌ ಬಗ್ಗೆ ತಿಳಿಯಲು ಹಾಗೂ ಇನ್ನಿತರ ರೇಶನ್‌ ಕಾರ್ಡ ಸೇವೆ',
  desc: '',
  link: 'https://ahara.kar.nic.in/e_services.aspx',
},
{
  title: 'ಪಾಸ್ ಪೋರ್ಟನ್ನು ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೇ ನೇರವಾಗಿ ಪಡೆಯಲು ಹಾಗೂ ಮತ್ತಿತರ ಪಾಸ್‌ ಪೋರ್ಟ ಸೇವೆ',
  desc: '',
  link: 'https://portal2.passportindia.gov.in/AppOnlineProject/welcomeLink',
},
{
  title: 'ಪಾನಕಾರ್ಡನ್ನು ಯಾವುದೇ ಮದ್ಯವರ್ತಿಗಳಿಲ್ಲದೇ ನೇರವಾಗಿ ಪಡೆಯಲು ಹಾಗೂ ಮತ್ತಿತರ ಪಾನಕಾರ್ಡ ಸೇವೆ',
  desc: '',
  link: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html ',
},
{
  title: 'ಭೂಮಿಯ ರೆಕಾರ್ಡ ಮತ್ತಿತರ ದಾಖಲೆ ಸೇವೆ',
  desc: '',
  link: 'http://landrecords.karnataka.gov.in/service2/RTC.aspx ',
},
{
  title: 'E-ಸ್ವತ್ತು ದಾಖಲೆಗಳ ಸೇವೆ',
  desc: '',
  link: 'http://e-swathu.kar.nic.in/(S(k03jz43enbmfy1ymzaeiqeic))/Issue0fForm9/Frm_PublicSearchForm9.aspx',
},
]
class UsefulLinksScreen extends Component {
  static navigationOptions = {
    title: 'ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು',
  }
  render() {
    return (
      <SafeAreaViewWrapper>
        <Container>
          <CustomStatusBar />
          <Content>
            <SectionHeader>ಸರ್ಕಾರಿ ಸೇವೆಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಲಿಂಕ್‌ಗಳು</SectionHeader>
            <CourseLessonsListView
              items={UsefulLinksList}
              onItemPress={item => Linking.openURL(item.link)}
            />
          </Content>
        </Container>
      </SafeAreaViewWrapper>
    )
  }
}

export default UsefulLinksScreen;
