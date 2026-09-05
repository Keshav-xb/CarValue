# Project TODO

- [x] Inspect car_price_model.pkl and verify model type, feature names, feature order, and output shape
- [x] Add the supplied model to the deployable project runtime without retraining or replacing it
- [x] Implement server-side valuation validation and exact categorical encoding
- [x] Add a public tRPC valuation endpoint backed by the real model prediction
- [x] Add automated tests for valuation input validation and model feature construction
- [x] Build the responsive CarValue landing page and valuation form
- [x] Add result card, input summary, disclaimer, loading, validation, and error states
- [x] Add local and production setup documentation for the Python model dependency
- [x] Run type checks, tests, and visual verification
- [x] Save the completed project checkpoint for delivery

## Request history

- [x] User requested an elegant, responsive CarValue website using the supplied prediction model and exact input contract
- [x] User requested a public tRPC valuation endpoint, automated coverage, and Python runtime setup documentation
- [x] User requested the supplied model's structure, order, encodings, and output to be inspected before implementation

## Verified model notes

- [x] Record inspection findings here after loading the pickle artifact
- [x] Verified class: sklearn.ensemble.RandomForestRegressor with 100 estimators and n_jobs=-1
- [x] Verified exact input count and order: 16 feature columns matching the supplied content, with no name column
- [x] Verified model.predict returns a numpy ndarray of shape [1] containing a float64 value for one row; a safe sample produced a real value of 557149.96
- [x] Verified one-hot baseline encoding from supplied content: CNG, Dealer, Automatic, and First Owner are all-zero baselines; all other listed categories set their corresponding dummy column to 1
- [x] Noted sklearn persistence warning: artifact was serialized with sklearn 1.6.1 and inspected with 1.9.0; deployment should pin a compatible sklearn version where possible

## Validation notes

- [x] Record test and visual verification findings here before checkpoint
- [x] TypeScript check passed; Vitest passed with 2 files and 7 tests; production build passed; compressed real Python adapter returned a numeric model prediction; desktop and mobile screenshots verified

## Delivery notes

- [x] Record final setup and deployment guidance here before delivery
- [x] Runtime files: Dockerfile, scripts/predict.py, scripts/car_price_model.pkl, server/valuation.ts, and the existing Node/React app
- [x] User-facing estimate is explicitly labeled indicative and does not expose model internals
- [x] Add a concise submitted-input summary to the result card
- [x] Add clear per-field validation messages and friendly server-validation feedback
- [x] Map server-side tRPC and validation failures to friendly user-facing messages
- [x] Add automated coverage for the server-failure message mapping
- [x] Handle structured tRPC/Zod validation payloads and map them to field-level feedback
- [x] Add an integration-style test for the tRPC validation failure response shape
- [x] Exercise the real valuation.predict tRPC procedure with invalid input and assert its structured validation error
- [x] Verify the client-facing mapper against a real tRPC error object shape
- [x] Assert structured field errors from an actual invalid valuation tRPC call where the runtime exposes them
- [x] Feed the actual tRPC validation error instance into the shared mapper in test coverage
- [x] Directly assert the runtime tRPC error cause or formatted data contains the mileage field error

## GitHub sync

- [ ] Locate and verify the target GitHub repository `keshav-xb`
- [ ] Push the completed CarValue project to the target repository
- [ ] Confirm the remote repository and share its URL

## GitHub sync

- [ ] Locate and verify the target GitHub repository `Keshav-xb/CarValue`
- [ ] Push the completed CarValue project to the target repository
- [ ] Confirm the remote repository and share its URL
