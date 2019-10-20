import React from 'react'
import { Container } from 'native-base'
import styled from 'styled-components/native'
import { CustomStatusBar, RegularButton } from '../Components/ui'
import { Images } from '../Themes/'

const TopContentWrapper = styled.View`
  flex: 1;
  padding: 16px;
  justify-content: center;
  align-items: center;
`

const PageTitle = styled.Text`
  font-size: 28;
  text-align: center;
  margin: 32px 16px 8px;
`

const DescriptionText = styled.Text.attrs({
  numberOfLines: 3
})`
  font-size: 15;
  color: #8a8a8f;
  text-align: center;
  margin: 0px 16px;
`

const HeroWrapper = styled.View`
  flex: 1;
`

const Hero = styled.Image.attrs({
  source: Images.heroImage,
  resizeMode: 'cover'
})`
  flex: 1;
  width: null;
  height: null;
  margin: 0px 0px 0px;
`

const StartButtonWrapper = styled(TopContentWrapper)`
  justify-content: flex-start;
  align-items: stretch;
  margin: 0px 16px;
`

export default class EmptyScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { navigation } = this.props

    return (
      <Container>
        <CustomStatusBar />
        <TopContentWrapper>
          <PageTitle>ಪ್ರದರ್ಶಿಸಲು ಏನೂ ಇಲ್ಲ</PageTitle>
          <DescriptionText>
            ಈ ಸಮಯದಲ್ಲಿ ನಮಗೆ ತೋರಿಸಲು ಯಾವುದೇ ಮಾಹಿತಿ ಇಲ್ಲ
          </DescriptionText>
        </TopContentWrapper>
        <HeroWrapper>
          <Hero />
        </HeroWrapper>
        <StartButtonWrapper>
          <RegularButton
            text="ರಿಫ್ರೆಶ್ ಮಾಡಿ"
            onPress={() => this.props.onButtonClick()}
          />
        </StartButtonWrapper>
      </Container>
    )
  }
}
