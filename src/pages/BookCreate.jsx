import { CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import weatherJson from "../static/weather.json";

const BookCreate = () => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState("");
  const [geoLocation, setGeoLocation] = useState(null); //最初は位置情報がない
  const [place, setPlace] = useState("");
  const [weather, setWeather] = useState("");
  const [loading, setLoading] = useState(true);

  //API取得
  const getBooks = async (keyword) => {
    //url
    const url = "https://www.googleapis.com/books/v1/volumes?q=intitle:";
    const result = await axios.get(`${url}${keyword}`);
    // console.log(result.data.items);
    setBooks(result.data.items ?? []); //0件の場合は配列返す
  };

  //本のタイトル取得
  const selectBook = (book) => {
    // console.log(book.volumeInfo.title);
    setBook(book.volumeInfo.title);
  };

  //success
  const success = async (position) => {
    //緯度,経度を取得
    const { latitude, longitude } = position.coords;
    // console.log({ latitude, longitude });
    setGeoLocation({ latitude, longitude });

    //現在位置の地名を取得
    const placeData = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    // console.log(placeData.data.display_name);
    setPlace(placeData.data.display_name);

    //現在の天気を取得
    const weatherData = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FTokyo`
    );
    // console.log(weatherData.data.daily.weathercode[0]);
    setWeather(weatherJson[weatherData.data.daily.weathercode[0]]);

    //ローディング終了
    setLoading(false);
  };

  //error
  const fail = (error) => console.log(error);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, fail);
  }, []);

  //Loading
  if (loading)
    return (
      <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
        <CircularProgress color="success" />
      </Stack>
    );

  return (
    <>
      {/* 🔽 ここから追加 */}
      <table>
        <tbody>
          <tr>
            <td>場所</td>
            {/* <td>{JSON.stringify(geoLocation)}</td> */}
            <td>{place}</td>
          </tr>
          {/* 🔽 追加 */}
          <tr>
            <td>天気</td>
            <td>{weather}</td>
          </tr>
          <tr>
            <td>読んだ本</td>
            <td>{book}</td>
          </tr>
        </tbody>
      </table>
      {/* 🔼 ここまで追加 */}
      <p>キーワードで検索する</p>
      <input type="text" onChange={(e) => getBooks(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>書籍名</th>
            <th>出版社</th>
            <th>出版年</th>
            <th>リンク</th>
          </tr>
        </thead>
        <tbody>
          {books.map((x, i) => (
            <tr key={i}>
              <td>
                <button type="button" onClick={() => selectBook(x)}>
                  選択
                </button>
              </td>
              <td>{x.volumeInfo.title}</td>
              <td>{x.volumeInfo.publisher}</td>
              <td>{x.volumeInfo.publishedDate}</td>
              <td>
                <a
                  href={x.volumeInfo.infoLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BookCreate;
