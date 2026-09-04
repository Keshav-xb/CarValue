

# CarValue implementation notes

CarValue is a public-facing valuation experience backed by the supplied `scripts/car_price_model.pkl.gz`. The artifact was inspected before implementation and is a `sklearn.ensemble.RandomForestRegressor` with 100 estimators, 16 inputs, and `n_jobs=-1`. It expects the following columns in exactly this order: `year`, `km_driven`, `mileage(km/ltr/kg)`, `engine`, `max_power`, `seats`, `fuel_Diesel`, `fuel_LPG`, `fuel_Petrol`, `seller_type_Individual`, `seller_type_Trustmark Dealer`, `transmission_Manual`, `owner_Fourth & Above Owner`, `owner_Second Owner`, `owner_Test Drive Car`, and `owner_Third Owner`. A one-row prediction returns a NumPy array with shape `[1]` and a floating-point value.

## Request and prediction flow

The React form in `client/src/pages/Home.tsx` collects human-readable vehicle details and calls the typed `trpc.valuation.predict` mutation. The public procedure in `server/routers.ts` validates the request with the shared Zod schema in `server/valuation.ts`. The server converts categories into the exact one-hot columns using the documented dropped baselines: CNG, Dealer, Automatic, and First Owner produce zeroes in every dummy column. The name is retained for the response summary but is never sent to the model. The Node server invokes `scripts/predict.py`, which decompresses and loads the artifact with `joblib.load`, creates a pandas DataFrame using the verified column list, calls `model.predict(frame)`, and returns only the numeric price to the tRPC layer.

## Local setup

Use Node.js 22 or later and Python 3.11 or later. From the project root, install the JavaScript dependencies with `pnpm install`. Create a virtual environment with `python3 -m venv .venv`, activate it, then install the pinned model dependencies with `python -m pip install joblib pandas scikit-learn==1.6.1`. The exact scikit-learn pin is intentional because the supplied artifact was serialized with scikit-learn 1.6.1. Start the application with `pnpm dev`; the managed server serves the React client and the tRPC API together. The Python bridge defaults to `python3`, or can be overridden with `PYTHON_BIN=/absolute/path/to/python`.

To run quality checks, use `pnpm check` for TypeScript and `pnpm test` for the valuation contract tests and scaffold tests. The model file must remain at `scripts/car_price_model.pkl.gz` beside `scripts/predict.py`.

## Production setup

The root `Dockerfile` is included because production needs a Python runtime in addition to Node. It installs Python, creates `/opt/carvalue-venv`, pins `scikit-learn==1.6.1`, installs the JavaScript dependencies, runs the normal full-stack build, and starts `dist/index.js`. Keep `Dockerfile`, `package.json`, `pnpm-lock.yaml`, `patches/`, `scripts/predict.py`, and `scripts/car_price_model.pkl.gz` together in the deployed source. Do not replace, retrain, or edit the pickle artifact. The runtime listens on the platform-provided `PORT` through the existing template server and does not expose the model file to the browser.

The estimate is an indicative model output rather than a guaranteed sale price. Actual market value may vary with vehicle condition, location, documentation, and timing.
