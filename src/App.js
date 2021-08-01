import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { APIKEY } from "./apikey";

//products data
const data = require("./data");

const API = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/INR`;

const currencyOptions = [
  { value: "INR", label: "INR" },
  { value: "USD", label: "USD" },
];

function App() {
  const [productsUSD, setProductsUSD] = useState([]);
  const [products, setProducts] = useState(data.products);
  const [currency, setCurrency] = useState("INR");

  //called when page loads
  useEffect(() => {
    //get the exchange rate values from external api
    getExchangeRateValue().then((response) => {
      if (response) {
        //save the values to state variable
        setProductsUSD(
          //get the converted array of products
          getConvertedValue(data.products, response.conversion_rates.USD)
        );
      }
    });
  }, []);

  // function to get the converted array of products
  function getConvertedValue(arr, exchangeRate) {
    //copy the original array of products
    let clonedArr = JSON.parse(JSON.stringify(arr));
    return clonedArr.map((ele) => {
      //round off the value to 2 decimal places
      ele.cost = (parseInt(ele.cost) * exchangeRate).toFixed(2);
      return ele;
    });
  }

  //called when dropdown value changes
  const handleSelect = (e) => {
    if (e.value === "USD") {
      setProducts(productsUSD);
      setCurrency(e.value);
    } else {
      setProducts(data.products);
      setCurrency(e.value);
    }
  };

  //call to external API
  const getExchangeRateValue = () => {
    return fetch(API, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Hey User, Welcome to PseudoKart!</h2>
        <label className="CurrencyLabel">Currency</label>
        <Dropdown
          className="ddCurrency"
          value={currency}
          options={currencyOptions}
          onChange={handleSelect}
          placeholder="Select Currency"
        />
        <Container className="Product-Container">
          <Row>
            {products &&
              products.map((prod, index) => {
                return (
                  <Col key={index + 1} className="Product" xs={6} md={4}>
                    <img src={prod.imgUrl} alt=""></img>
                    <br />
                    <label>{prod.name}</label>
                    <br />
                    <p>
                      {currency === "USD"
                        ? "$ " + prod.cost
                        : "\u20B9 " + prod.cost}
                    </p>
                  </Col>
                );
              })}
          </Row>
        </Container>
      </header>
    </div>
  );
}

export default App;
