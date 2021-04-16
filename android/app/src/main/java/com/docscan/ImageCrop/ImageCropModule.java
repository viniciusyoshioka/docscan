package com.docscan.ImageCrop;

import android.graphics.Bitmap;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.theartofdev.edmodo.cropper.CropImageView;

import org.reactnative.camera.utils.ScopedContext;

import java.io.File;
import java.util.UUID;


public class ImageCropModule extends ReactContextBaseJavaModule {


    String REACT_CLASS = "ImageCropModule";
    ScopedContext mScopedContext;


    public ImageCropModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mScopedContext = new ScopedContext(reactApplicationContext);
    }


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactMethod
    public void saveImage(ReadableMap options, int viewTag, Promise promise) {
        final ReactApplicationContext context = getReactApplicationContext();

        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                CropImageView cropImageView = (CropImageView) nativeViewHierarchyManager.resolveView(viewTag);
                try {
                    String cacheDirectory = cropImageView.getContext().getCacheDir().toString();
                    boolean preserveTransparency = options.getBoolean("preserveTransparency");
                    int quality = options.getInt("quality");
                    String path = options.getString("path");

                    String extension = ".jpg";
                    Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
                    if (preserveTransparency && cropImageView.getCroppedImage().hasAlpha()) {
                        extension = ".png";
                        format = Bitmap.CompressFormat.PNG;
                    }

                    if (path.equals("")) {
                        path = new File(cacheDirectory, UUID.randomUUID().toString() + extension).toURI().toString();
                    } else {
                        if (extension.equals(".png") && path.endsWith(".jpg")) {
                            path = path.replaceAll(".jpg", ".png");
                        }
                    }

                    cropImageView.saveCroppedImageAsync(Uri.parse(path), format, quality);

                    promise.resolve(path);
                } catch (Exception e) {
                    promise.reject("SaveImageError", e.getMessage());
                }
            }
        });
    }

    @ReactMethod
    public void rotateImage(final boolean clockwise, final int viewTag) {
        final ReactApplicationContext context = getReactApplicationContext();

        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                CropImageView cropImageView = (CropImageView) nativeViewHierarchyManager.resolveView(viewTag);
                cropImageView.rotateImage(clockwise ? 90 : -90);
            }
        });
    }
}
