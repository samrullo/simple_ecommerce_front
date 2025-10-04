// src/components/purchases/PurchaseByDateDetailCreate.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  MINIMAL_PRODUCTS_ENDPOINT,
  ACTIVE_WEIGHT_COST_ENDPOINT,
  ACTIVE_PROFIT_RATE_ENDPOINT,
  ACTIVE_PRODUCT_PRICES_ENDPOINT,
  ACTIVE_FXRATES_ENDPOINT,
  PRODUCT_TOTAL_INVENTORIES_ENDPOINT,
  LAST_PURCHASE_PRICES_ENDPOINT,
  PURCHASE_CREATE_ENDPOINT,
  CURRENCIES_ENDPOINT,
  CUSTOMERS_BY_ADMIN_ENDPOINT,
  CREATE_PURCHASE_ORDER_ENDPOINT, // <-- define in ApiEndpoints.js
} from "../ApiUtils/ApiEndpoints";

const PurchaseByDateDetailCreate = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { purchaseDate } = useParams();
  const { userInfo, setFlashMessages, baseCurrency } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [productInventories, setProductInventories] = useState([]);
  const [productInventory, setProductInventory] = useState("")
  const [fxRates, setFxRates] = useState([]);
  const [lastPurchasePrices, setLastPurchasePrices] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // toggle and order-related fields
  const [raiseOrder, setRaiseOrder] = useState(false);
  const [weight, setWeight] = useState(0.1);
  const [weightCost, setWeightCost] = useState("");
  const [weightCostCurrency, setWeightCostCurrency] = useState(null);
  const [profitRate, setProfitRate] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [soldPriceCurrency, setSoldPriceCurrency] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");

  const [loading, setLoading] = useState(false);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT);
        setCurrencies(data.map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` })));
      } catch (err) {
        console.error("Error fetching currencies", err);
        setCurrencies([]);
      }
    };
    fetchCurrencies();
  }, []);

  // Fetch minimal products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get(MINIMAL_PRODUCTS_ENDPOINT, false);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch supporting data (prices, inventories, fx)
  useEffect(() => {
    const fetchData = async () => {
      const [prices, inventories, rates] = await Promise.all([
        get(ACTIVE_PRODUCT_PRICES_ENDPOINT, false),
        get(PRODUCT_TOTAL_INVENTORIES_ENDPOINT, false),
        get(ACTIVE_FXRATES_ENDPOINT, false)
      ]);

      setProductPrices(prices);
      setProductInventories(inventories);
      setFxRates(
        rates.map(rate => ({
          currency_from: rate.currency_from.code,
          currency_to: rate.currency_to.code,
          rate: parseFloat(rate.rate)
        }))
      );
    };
    fetchData();
  }, []);


  // Fetch last purchase prices
  useEffect(() => {
    const fetchLastPrices = async () => {
      try {
        const data = await get(LAST_PURCHASE_PRICES_ENDPOINT, false);
        setLastPurchasePrices(data);
      } catch (err) {
        console.error("Error fetching last purchase prices", err);
        setLastPurchasePrices([]);
      }
    };
    fetchLastPrices();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await get(CUSTOMERS_BY_ADMIN_ENDPOINT, true);
        setCustomers(data.map((c) => ({ value: c.id, label: `${c.first_name} ${c.last_name} (${c.email})` })));
      } catch (err) {
        console.error("Error fetching customers", err);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  // Merge products with last purchase price
  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const lastPrice = lastPurchasePrices.find((lp) => lp.id === p.id);
      const productPrice = productPrices.find(productPrice => productPrice.product === p.id);
      const productInventory = productInventories.find(productInventory => productInventory.product === p.id);
      return {
        value: p.id,
        label: p.name,
        last_price: lastPrice?.last_price || "",
        last_currency: lastPrice?.last_currency || null,
        productPrice: productPrice,
        productInventory: productInventory
      };
    });
  }, [products, lastPurchasePrices, productPrices, productInventories]);

  // Auto-fill price + currency when product changes
  useEffect(() => {
    if (!selectedProduct) return;
    const match = enrichedProducts.find((p) => p.value === selectedProduct.value);
    if (match) {
      if (match.productPrice) {
        setSoldPrice(match.productPrice?.price);
        setSoldPriceCurrency({value:match.productPrice?.currency?.id,label:match.productPrice?.currency?.code})
        console.log(`match.productPrice is ${JSON.stringify(match.productPrice)}`)
      }

      if (match.productInventory) {
        setProductInventory(match.productInventory?.total_inventory);
        console.log(`match.productInventory is ${JSON.stringify(match.productInventory)}`)
      }
      if (match.last_price) setPricePerUnit(match.last_price);
      if (match.last_currency) {
        console.log(`last currency matching selected product ${JSON.stringify(match.last_currency)}`)
        const option = currencies.find(c => c.value === match.last_currency.id);
        console.log(`Setting purchase currency as ${JSON.stringify(option)}, currencies are ${JSON.stringify(currencies)}`)
        setSelectedCurrency(option || null);

      } else {
        setSelectedCurrency(null);
      }
    }
  }, [selectedProduct, enrichedProducts, currencies]);

  //fetch active weight cost and active profit rate
  useEffect(() => {
    const fetchActiveWeightCost = async () => {
      try {
        const data = await get(ACTIVE_WEIGHT_COST_ENDPOINT, false)
        setWeightCost(data?.cost_per_kg)
        setWeightCostCurrency({value:data?.weight_cost_currency?.id,label:data?.weight_cost_currency?.code})

      } catch (err) {
        console.log(`Error while fetching weight cost ${JSON.stringify(err)}`)
      }
    }
    fetchActiveWeightCost()
  }, [])

  useEffect(() => {
    const fetchActiveProfitRate = async () => {
      try {
        const data = await get(ACTIVE_PROFIT_RATE_ENDPOINT, false)
        setProfitRate(data?.profit_rate)
      } catch (err) {
        console.log(`Error while fetching active profit rate ${JSON.stringify(err)}`)
      }
    }
    fetchActiveProfitRate();
  }, [])

  if (!userInfo?.is_staff) {
    return <p>You are not authorized to create purchases.</p>;
  }

  // Apply profit calculation
  const handleApplyProfit = () => {
    if (!weight || !weightCost || !pricePerUnit || !profitRate) return;
    const calcPrice =
      parseFloat(weight) * parseFloat(weightCost) +
      parseFloat(pricePerUnit) * (1 + parseFloat(profitRate));
    setSoldPrice(calcPrice.toFixed(2));
  };

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: enrichedProducts,
    },
    { fieldType: "number", fieldLabel: "Purchase Quantity", fieldValue: quantity, setFieldValue: setQuantity },
    { fieldType: "number", fieldLabel: "Purchase Price per Unit", fieldValue: pricePerUnit, setFieldValue: setPricePerUnit },
    {
      fieldType: "select",
      fieldLabel: "Purchase Currency",
      fieldValue: selectedCurrency,
      setFieldValue: setSelectedCurrency,
      selectOptions: currencies,
    },
    {
      fieldType: "number",
      fieldLabel: "Product Inventory",
      fieldValue: productInventory,
      setFieldValue: setProductInventory,
      fieldProps: { disabled: true }
    },
    {
      fieldType: "checkbox",
      fieldLabel: "Raise Order Simultaneously",
      fieldValue: raiseOrder,
      setFieldValue: setRaiseOrder,
    },
  ];

  if (raiseOrder) {
    formFields.push(
      { fieldType: "number", fieldLabel: "Product Weight", fieldValue: weight, setFieldValue: setWeight },
      { fieldType: "number", fieldLabel: "Weight Cost per Kg", fieldValue: weightCost, setFieldValue: setWeightCost },
      {fieldType:"select",fieldLabel:"Weight Cost Currency",fieldValue:weightCostCurrency,setFieldValue:setWeightCostCurrency,selectOptions:currencies,fieldProps:{disabled:true}},
      { fieldType: "number", fieldLabel: "Profit Rate", fieldValue: profitRate, setFieldValue: setProfitRate },
      {
        fieldType: "number",
        fieldLabel: "Sold Price (calculated)",
        fieldValue: soldPrice,
        setFieldValue: setSoldPrice
      },
      {fieldType:"select",
        fieldLabel:"Sold Price Currency",
        fieldValue:soldPriceCurrency,
        setFieldValue:setSoldPriceCurrency,
        selectOptions:currencies,
        fieldProps:{disabled:true}},
      {
        fieldType: "select",
        fieldLabel: "Customer",
        fieldValue: selectedCustomer,
        setFieldValue: setSelectedCustomer,
        selectOptions: customers,
      },
      { fieldType: "number", fieldLabel: "Order Quantity", fieldValue: orderQuantity, setFieldValue: setOrderQuantity },
      {
        fieldType: "select",
        fieldLabel: "Payment Method",
        fieldValue: paymentMethod,
        setFieldValue: setPaymentMethod,
        selectOptions: [
          { value: "cash_on_delivery", label: "Cash on Delivery" }    
        ],
      }
    );
  }

  const handleNewData = async (e) => {
    e.preventDefault();
    if (!selectedProduct?.value) {
      setFlashMessages([{ category: "danger", message: "Please select a product." }]);
      return;
    }

    setLoading(true);
    try {
      if (raiseOrder) {
        // Combined purchase+order
        await post(
          CREATE_PURCHASE_ORDER_ENDPOINT,
          {
            product_id: selectedProduct.value,
            purchase_quantity: quantity,
            purchase_price_per_unit: pricePerUnit,
            purchase_currency_id: selectedCurrency?.value,
            purchase_datetime: `${purchaseDate}T00:00:00`,
            customer_id: selectedCustomer?.value,
            sold_quantity: orderQuantity,
            sold_price_per_unit: soldPrice,
            sold_currency_id: soldPriceCurrency?.value,
            payment_method: paymentMethod?.value,
            base_currency_id: currencies.find((c) => c.label.startsWith(baseCurrency))?.value,
          },
          true
        );
        setFlashMessages([{ category: "success", message: "Purchase and Order created successfully." }]);
      } else {
        // Only purchase
        await post(
          PURCHASE_CREATE_ENDPOINT,
          {
            product_id: selectedProduct.value,
            quantity,
            price_per_unit: pricePerUnit,
            currency_id: selectedCurrency?.value,
            purchase_datetime: `${purchaseDate}T00:00:00`,
          },
          true
        );
        setFlashMessages([{ category: "success", message: "Purchase created successfully." }]);
      }

      navigate(`/purchases-by-date-detail/${purchaseDate}`, { state: { timestamp: Date.now() } });
    } catch (err) {
      console.error("Error creating purchase/order:", err);
      setFlashMessages([{ category: "danger", message: "Failed to create purchase/order." }]);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <GenericNewData
      title={`New Purchase on ${purchaseDate}`}
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : raiseOrder ? "Create Purchase + Order" : "Create Purchase"}
      disableSubmit={loading}
    />
  </>
  );
};

export default PurchaseByDateDetailCreate;
