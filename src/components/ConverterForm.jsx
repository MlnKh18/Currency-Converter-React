import React, { useEffect, useState } from "react";
import CurrencySelect from "./CurrencySelect";

function ConverterForm() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [amount, setAmount] = useState(""); // Gunakan string agar tidak ada format default angka
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getExChangeRate = async () => {
    if (!amount || parseFloat(amount) <= 0) return; // Pastikan amount valid

    setIsLoading(true);
    const APP_API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `https://v6.exchangerate-api.com/v6/${APP_API_KEY}/pair/${fromCurrency}/${toCurrency}`;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch exchange rate");

      const data = await response.json();
      const rate = (data.conversion_rate * parseFloat(amount)).toFixed(2);
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      setExchangeRate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getExChangeRate();
  }, [fromCurrency, toCurrency, amount]);

  // Format angka untuk tampilan (gunakan titik setiap 3 digit)
  const formatNumber = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Handle perubahan input
  const handleAmountChange = (e) => {
    let value = e.target.value.replace(/\./g, ""); // Hapus titik
    if (/^\d*$/.test(value)) {
      setAmount(value); // Simpan hanya angka
    }
  };

  return (
    <form className="converter-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="amount" className="form-label">
          Enter an Amount:
        </label>
        <input
          id="amount"
          type="text" // Ganti jadi text agar bisa menampilkan format titik
          min="1"
          className="form-input"
          required
          value={formatNumber(amount)}
          onChange={handleAmountChange}
        />
      </div>
      <div className="form-group form-currency-selection-group">
        <div className="form-section">
          <label htmlFor="from" className="form-label">
            From:
          </label>
          <CurrencySelect
            selectedCurrency={fromCurrency}
            onSelectCurrency={setFromCurrency}
          />
        </div>
        <div className="icon-swap" onClick={handleSwap} role="button">
          <svg
            width="16"
            viewBox="0 0 20 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
        <div className="form-section">
          <label htmlFor="to" className="form-label">
            To:
          </label>
          <CurrencySelect
            selectedCurrency={toCurrency}
            onSelectCurrency={setToCurrency}
          />
        </div>
      </div>
      <button
        type="button"
        className="form-button"
        onClick={getExChangeRate}
        disabled={isLoading}
      >
        {isLoading ? "Converting..." : "Convert"}
      </button>
      <p className="exchange-rate-result">
        {exchangeRate
          ? `${formatNumber(amount)} ${fromCurrency} = ${exchangeRate} ${toCurrency}`
          : "Exchange rate not available"}
      </p>
    </form>
  );
}

export default ConverterForm;
