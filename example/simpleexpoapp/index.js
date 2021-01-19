import React, { PureComponent } from 'react';
import { StyleSheet, View, PixelRatio } from 'react-native';
import { WebView } from 'react-native-webview';
// webview only works online, unless you use inline html
import { html } from './drawHtml';

const styles = StyleSheet.create({
  drawBg: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

type ReactNativeDrawProps = {
  penColour: string,
  strokeWidth: number,
};

// create a component
class ReactNativeDraw extends PureComponent<ReactNativeDrawProps> {
  state = {
    htmlStr: html,
  };

  componentDidMount() {
    const { penColor, strokeWidth } = this.props;
    const ratio = PixelRatio.getPixelSizeForLayoutSize(strokeWidth);
    const adj = ratio / strokeWidth + strokeWidth;

    let htmlStr = html
      .replace('[[LINE_WIDTH]]', adj || 12)
      .replace('[[COLOR]]', penColor || '#000');
    this.setState({ htmlStr });
  }

  componentDidUpdate(prevProps) {
    this.updateView();
  }

  updateView = () => {
    this.changeColour(this.props.penColor);
    this.changeStrokeWidth(this.props.strokeWidth);
  };

  changeColour = (penColor) => {
    try {
      if (this.webref) {
        this.webref.injectJavaScript(`setColor('${penColor}')`);
      }
    } catch (err) {
      alert(err);
    }
  };

  changeStrokeWidth = (strokeWidth) => {
    try {
      if (this.webref) {
        const ratio = PixelRatio.getPixelSizeForLayoutSize(strokeWidth);
        const adj = ratio / strokeWidth + strokeWidth;
        this.webref.injectJavaScript(`setStrokeWidth(${adj})`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  clear = () => {
    try {
      if (this.webref) {
        this.webref.injectJavaScript('clearDrawing()');
      }
    } catch (err) {
      console.error(err);
    }
  };

  undo = () => {
    try {
      if (this.webref) {
        this.webref.injectJavaScript('undoLines()');
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { htmlStr } = this.state;

    return (
      <View style={styles.container}>
        <WebView
          style={styles.drawBg}
          ref={(r) => (this.webref = r)}
          useWebKit
          originWhitelist={['*']}
          scalesPageToFit
          source={{ html: htmlStr }}
          mixedContentMode={'compatibility'}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          incognito={true}
        />
      </View>
    );
  }
}

export default ReactNativeDraw;
