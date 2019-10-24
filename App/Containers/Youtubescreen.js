import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { Container, Content } from 'native-base'
import { connect } from 'react-redux'
import { CustomActivityIndicator } from '../Components/ui';

class FacebookPage extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: true };
    }
    static navigationOptions = {
        title: 'ಯೂಟ್ಯೂಬ್',
        headerBackTitle: null,
      }
    hideSpinner() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <Container>

                <Content contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#F1F2F6'
                }}>
                    <WebView
                        source={{ uri: 'https://www.youtube.com/channel/UCJpeMzzQfbalCg3VKMqCKig' }}
                        style={{ width: '100%', height: '100%' }}
                        onLoad={() => this.hideSpinner()}
                    />
                </Content>
                {
                    this.state.visible ? <CustomActivityIndicator /> : null
                }
            </Container>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        fetching: state.root.fetching,
    }
}

export default connect(mapStateToProps, null)(FacebookPage);
