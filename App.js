import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "d58b719859466d993c2c02b85b5406d8";

export default class extends React.Component  {
  state = {
    isLoading: true
  };

  getWeather = async(latitude, longitude) => {
    const { 
      data: {
        main : { temp },
        weather
      } 
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    this.setState({ 
      isLoading: false, 
      condition: weather[0].main, 
      temp
    });
  };

  getLocation = async() => {
    try {
      await Location.getForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude }
    } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }

  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
