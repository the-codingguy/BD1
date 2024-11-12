const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyalityRate = 2; // 2 Points Per Dollar

function getCartTotalPrice(newItemPrice, cartTotal) {
  let cartTotalPrice = newItemPrice + cartTotal;
  return cartTotalPrice;
}
app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(getCartTotalPrice(newItemPrice, cartTotal).toString());
});

function getFinalOfferPrice(cartTotal, isMember) {
  let finalPrice;
  if (isMember == 'true') {
    finalPrice = cartTotal - (cartTotal * discountPercentage) / 100;
  } else {
    finalPrice = cartTotal;
  }
  return finalPrice;
}
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(getFinalOfferPrice(cartTotal, isMember).toString());
});

function getTaxPrice(cartTotal) {
  let finalTaxPrice = (cartTotal * taxRate) / 100;
  return finalTaxPrice;
}
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(getTaxPrice(cartTotal).toString());
});

function getEstimatedDelivery(shippingMethod, distance) {
  let estimatedDelivery;
  if (shippingMethod == 'standard') {
    estimatedDelivery = parseFloat(distance / 50);
  } else if (shippingMethod == 'express') {
    estimatedDelivery = parseFloat(distance / 100);
  }
  return estimatedDelivery;
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(getEstimatedDelivery(shippingMethod, distance).toString());
});

function getShippingCost(weight, distance) {
  let shippimgCost = weight * distance * 0.1;
  return shippimgCost;
}
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(getShippingCost(weight, distance).toString());
});

function getLoyalityPoints(purchaseAmount) {
  let loyalityPoints = purchaseAmount * 2;
  return loyalityPoints;
}
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(getLoyalityPoints(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
