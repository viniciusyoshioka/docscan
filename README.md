# DocScan

App to take pictures of documents or school work and convert them into PDF files.

## Observation
Currently, this app was tested only in Android, and the dependencies also were configured only for Android.

The minimum Android version supported is Android 8 (SDK 26).

## Develop

This app uses `@elementium/native`, `@elementium/theme` and some other libraries that are not in NPM currently. So you have to download [this repository](https://github.com/viniciusyoshioka/elementium) and extract the `.zip` file to the same directory of this project.

Then you have to build it, but the process is automatic. You only have to run one command inside that folder.

To enter the folder, run:

```sh
cd elementium
```

And then, build:

```sh
yarn install
```

Now you can go back to this app's folder.

- Install `node_modules`:

    ```sh
    yarn install
    ```

    When you run `yarn install`, those libraries will be installed from the `elementium` package you downloaded and built previously.

- Start development server:

    ```sh
    yarn start
    ```

- Build app:

    ```sh
    yarn android
    ```

- To build the release variant:

    ```sh
    yarn android --mode release
    ```
