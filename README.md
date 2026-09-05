# 🚗 CarValue

### AI-Powered Used Car Price Prediction Platform

CarValue is an end-to-end machine learning application that estimates the market value of a used car from its specifications.

It combines a trained **Random Forest regression model** with a modern React frontend, type-safe API layer, Node.js backend, Python inference service, and Docker-based production environment.

> **From vehicle data to a price prediction - built as a complete ML product, not just a notebook.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green?logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-Random%20Forest-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Docker-Production-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🌟 Overview

Buying or selling a used car often starts with a difficult question:

> **"What is this car actually worth?"**

CarValue answers that question using machine learning.

A user enters information about a vehicle, including its age, mileage, engine, power, fuel type, transmission, ownership history, and other specifications.

The application then:

1. Validates the submitted information.
2. Converts categorical values into the feature representation expected by the model.
3. Sends the structured input through the backend.
4. Passes the data to the Python inference layer.
5. Loads the trained Random Forest model.
6. Generates a price prediction.
7. Returns the estimated value to the frontend.

The result is a simple user experience backed by a complete ML inference pipeline.

---

## 🎯 Project Goals

CarValue was designed to demonstrate practical machine-learning engineering rather than only model training.

The project focuses on:

- Building a complete ML-powered application.
- Connecting a web application to a Python machine-learning model.
- Maintaining consistent training and inference features.
- Validating API inputs before inference.
- Separating frontend, backend, and ML responsibilities.
- Packaging the application for production with Docker.
- Creating an architecture that can be extended with better models and additional data.

---

## 🧠 Machine Learning

The prediction engine uses a:

### Random Forest Regression Model

Random Forest is an ensemble learning algorithm that combines predictions from multiple decision trees.

For vehicle valuation, this makes it useful for learning nonlinear relationships between vehicle characteristics and historical selling prices.

The model consumes numerical and one-hot encoded features.

### Model Features

The inference pipeline expects the following feature structure:

```text
year
km_driven
mileage
engine
max_power
seats
fuel_Diesel
fuel_LPG
fuel_Petrol
seller_type_Individual
seller_type_Trustmark Dealer
transmission_Manual
owner_Fourth & Above Owner
owner_Test Drive Car
owner_First Owner
owner_Second Owner
owner_Third Owner