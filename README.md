# DocScan

App to take pictures of documents or school work and convert them into PDF files.

## Observation

Currently, this app was tested only in Android, and the dependencies also were
configured only for Android.

The minimum Android version supported is Android 8 (SDK 26).

## Develop

- Install dependencies

```sh
yarn install
```

- Start the development server

```sh
yarn start
```

- Build the app

To build the development version, run:

```sh
yarn android
```

If you want the release version, build with:

```sh
yarn android --variant release
```
