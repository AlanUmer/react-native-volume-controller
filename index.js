import React, { Component }  from 'react';
import { View, NativeModules, DeviceEventEmitter, Slider, requireNativeComponent, TouchableOpacity, Image, Platform, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ReactNativeVolumeController = NativeModules.ReactNativeVolumeController;

export default class SliderVolumeController extends Component {
    constructor(props) {
        super(props);
        this.state = {volume_value:0.8, has_button_route:false};
    }

  componentDidMount() {
    DeviceEventEmitter.addListener(
        'VolumeControllerValueUpdatedEvent', (evt) => {
            console.log("update view volume "+evt.volume);
            this.setState({volume_value:evt.volume});
        }
      );

      ReactNativeVolumeController.update();
    }

    onVolumeUp() {
        var value = this.state.volume_value + 0.1;
        if (value > 1) {
            this.setState({volume_value: 1})
        } else {
            this.setState({volume_value: value})
        }
        
        ReactNativeVolumeController.change(value);
    }
    onVolumeDown() {
        var value = this.state.volume_value - 0.1;
        if (value < 0) {
            this.setState({volume_value: 0})
        } else {
            this.setState({volume_value: value})
        }
        
        ReactNativeVolumeController.change(value);
    }
    render() {

        const dimension = Dimensions.get("window")
        const viewWidth = dimension.width-70;
        let sliderWidth = viewWidth;
        let buttonWidth = sliderWidth*0.15
        let soundRouteButton = null;
        
        let downName = 'md-volume-down';
        if (this.state.volume_value == 0) {
            alert('xx');
            downName = "md-volume-mute";
        }

        return(<View style={[this.props.style, {marginLeft:10, marginRight:10,flex:1, flexDirection:"row", width:viewWidth,
              alignItems:'center',
              justifyContent:'center'}]}>
              <TouchableOpacity onPress={() => this.onVolumeDown()}>
                  <Icon name={downName} size={30} color="#900" style={{margin: 5}} />
              </TouchableOpacity>
              <Slider {...this.props} style={[{width:sliderWidth}]} value={this.state.volume_value} onValueChange={(value)=>console.log(value)}/>
              <TouchableOpacity onPress={() => this.onVolumeUp()}>
              <Icon name="md-volume-up" size={30} color="#900" style={{margin: 5}} />
              </TouchableOpacity>
          </View>
        );
    }
}

var SoundRouteButton = requireNativeComponent('ReactNativeVolumeController', null);

export {SliderVolumeController, ReactNativeVolumeController, SoundRouteButton}
