# DocScan

App to take pictures of documents or school work and convert them into PDF files.

## Observation

Currently, this app was tested only in Android, and the dependencies also were
configured only for Android.

The minimum Android version supported is Android 8 (SDK 26).

## Develop

Install dependencies with:

```sh
yarn install
```

To develop the app, the development server is required. Start it with:

```sh
yarn start
```

## Build

Now, to build the development version, run:

```sh
yarn android
```

If you want the release version, build with:

```sh
yarn android --mode release
```
