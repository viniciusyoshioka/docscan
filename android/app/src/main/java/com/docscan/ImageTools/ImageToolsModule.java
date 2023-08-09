package com.docscan.ImageTools;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.exifinterface.media.ExifInterface;

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

    private int getRotationAngle(int orientation) {
        if (orientation == ExifInterface.ORIENTATION_ROTATE_90 || orientation == ExifInterface.ORIENTATION_TRANSVERSE) {
            return 90;
        }
        if (orientation == ExifInterface.ORIENTATION_ROTATE_180 || orientation == ExifInterface.ORIENTATION_FLIP_VERTICAL) {
            return 180;
        }
        if (orientation == ExifInterface.ORIENTATION_ROTATE_270 || orientation == ExifInterface.ORIENTATION_TRANSPOSE) {
            return 270;
        }
        return 0;
    }

    @ReactMethod
    public void rotate(ReadableMap options, Promise promise) {
        String sourcePath = options.getString("sourcePath");
        String destinationPath = options.getString("destinationPath");
        int angle = options.getInt("angle");

        if (sourcePath == null) {
            promise.reject("ImageTools", "Param sourcePath of rotate method should not be null");
            return;
        }
        if (destinationPath == null) {
            promise.reject("ImageTools", "Param destinationPath of rotate method should not be null");
            return;
        }

        try {
            ExifInterface exifInterface = new ExifInterface(sourcePath);

            int currentOrientationAttribute = exifInterface.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_UNDEFINED);
            int currentRotationAngle = getRotationAngle(currentOrientationAttribute);
            int newRotationAngle = (currentRotationAngle + angle) % 360;

            Matrix matrix = new Matrix();
            matrix.setRotate(newRotationAngle);

            Bitmap originalFile = BitmapFactory.decodeFile(sourcePath);
            Bitmap rotatedImage = Bitmap.createBitmap(
                    originalFile,
                    0, 0,
                    originalFile.getWidth(), originalFile.getHeight(),
                    matrix, true);

            String fileExtension = getFileExtension(sourcePath);
            Bitmap.CompressFormat imageFormat = getImageFormat(fileExtension);

            FileOutputStream fileOutputStream = new FileOutputStream(destinationPath);
            boolean isSavedSuccessfully = rotatedImage.compress(imageFormat, 100, fileOutputStream);
            fileOutputStream.close();

            originalFile.recycle();
            rotatedImage.recycle();

            if (isSavedSuccessfully) {
                promise.resolve(null);
                return;
            }

            promise.reject(new Exception("Rotated image was not saved successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
        }
    }
}
