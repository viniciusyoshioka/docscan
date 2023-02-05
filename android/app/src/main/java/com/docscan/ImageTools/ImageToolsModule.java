package com.docscan.ImageTools;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileOutputStream;

public class ImageToolsModule extends ReactContextBaseJavaModule {


    private final ReactApplicationContext mReactApplicationContext;


    public ImageToolsModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactApplicationContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return "ImageTools";
    }


    @ReactMethod
    public void getSize(String path, Promise promise) {
        try {
            Bitmap image = BitmapFactory.decodeFile(path);
            int width = image.getWidth();
            int height = image.getHeight();
            image.recycle();

            WritableMap response = Arguments.createMap();
            response.putInt("width", width);
            response.putInt("height", height);
            promise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }


    @Nullable
    private String getFileExtension(String path) {
        File imageFile = new File(path);
        String fileName = imageFile.getName();

        if (!fileName.contains(".")) {
            return null;
        }
        if (fileName.startsWith(".") && !fileName.substring(1).contains(".")) {
            return null;
        }
        String[] splitFileName = fileName.split("/./");
        return splitFileName[splitFileName.length - 1];
    }

    private Bitmap.CompressFormat getImageFormat(@Nullable String fileExtension) {
        if (fileExtension == null) {
            return Bitmap.CompressFormat.PNG;
        }

        switch (fileExtension.toLowerCase()) {
            case "jpg":
            case "jpeg":
                return Bitmap.CompressFormat.JPEG;
            case "webp":
                return Bitmap.CompressFormat.WEBP;
            default:
                return Bitmap.CompressFormat.PNG;
        }
    }

    @ReactMethod
    public void rotateDegree(String path, ReadableMap options, Promise promise) {
        int angle = options.getInt("angle");
        String pathToSave = options.getString("pathToSave");

        Matrix matrix = new Matrix();
        matrix.setRotate(angle);

        Bitmap originalFile = BitmapFactory.decodeFile(path);
        Bitmap rotatedImage = Bitmap.createBitmap(
                originalFile,
                0, 0,
                originalFile.getWidth(), originalFile.getHeight(),
                matrix, true);
        originalFile.recycle();

        String fileExtension = getFileExtension(path);
        Bitmap.CompressFormat imageFormat = getImageFormat(fileExtension);

        try {
            FileOutputStream fileOutputStream = new FileOutputStream(pathToSave);
            boolean successCompress = rotatedImage.compress(imageFormat, 100, fileOutputStream);
            fileOutputStream.close();

            if (successCompress) {
                promise.resolve(null);
                return;
            }

            promise.reject(new Exception("Rotated image was not compressed (saved) successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }
}
