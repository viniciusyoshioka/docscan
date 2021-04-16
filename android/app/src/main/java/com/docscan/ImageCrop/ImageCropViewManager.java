package com.docscan.ImageCrop;

import android.graphics.Bitmap;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.theartofdev.edmodo.cropper.CropImageView;

import java.io.File;
import java.util.Map;
import java.util.UUID;


public class ImageCropViewManager extends SimpleViewManager<CropImageView> {


    String REACT_CLASS = "RNImageCrop";
    final String SOURCE_URL_PROP = "sourceUrl";
    final String KEEP_ASPECT_RATIO_PROP = "keepAspectRatio";
    final String ASPECT_RATIO_PROP = "aspectRatio";
    final int SAVE_IMAGE_COMMAND = 1;
    final int ROTATE_IMAGE_COMMAND = 2;
    final String SAVE_IMAGE_COMMAND_NAME = "saveImage";
    final String ROTATE_IMAGE_COMMAND_NAME = "rotateImage";
    final String ON_IMAGE_SAVED = "onImageSaved";
    final String ON_SAVE_IMAGE_ERROR = "onSaveImageError";
    ReactApplicationContext mReactApplicationContext;


    public ImageCropViewManager(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactProp(name=SOURCE_URL_PROP)
    public void setSourceUrl(CropImageView view, String url) {
        view.setImageUriAsync(Uri.parse(url));
    }

    @ReactProp(name=KEEP_ASPECT_RATIO_PROP)
    public void setFixedAspectRatio(CropImageView view, Boolean fixed) {
        view.setFixedAspectRatio(fixed);
    }

    @ReactProp(name=ASPECT_RATIO_PROP)
    public void setAspectRatio(CropImageView view, ReadableMap aspectRatio) {
        if (aspectRatio != null) {
            view.setAspectRatio(aspectRatio.getInt("width"), aspectRatio.getInt("height"));
        } else {
            view.clearAspectRatio();
        }
    }


    @NonNull
    @Override
    public CropImageView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        CropImageView view = new CropImageView(themedReactContext);
        view.setOnCropImageCompleteListener(new CropImageView.OnCropImageCompleteListener() {
            @Override
            public void onCropImageComplete(CropImageView view, CropImageView.CropResult result) {
                WritableMap response = Arguments.createMap();
                response.putString("uri", result.getUri().toString());
                response.putInt("width", result.getCropRect().width());
                response.putInt("height", result.getCropRect().height());

                ReactContext reactContext = (ReactContext)view.getContext();
                reactContext
                        .getJSModule(RCTEventEmitter.class)
                        .receiveEvent(view.getId(), ON_IMAGE_SAVED, response);
            }
        });
        return view;
    }

    @Override
    public void receiveCommand(@NonNull CropImageView root, int commandId, ReadableArray args) {
        switch (commandId) {
            case SAVE_IMAGE_COMMAND:
                int quality = args.getInt(0);
                boolean preserveTransparency = args.getBoolean(1);

                String extension = ".jpg";
                Bitmap.CompressFormat format = Bitmap.CompressFormat.JPEG;
                if (preserveTransparency && root.getCroppedImage().hasAlpha()) {
                    extension = ".png";
                    format = Bitmap.CompressFormat.PNG;
                }

                try {
                    String path = new File(root.getContext().getCacheDir(), UUID.randomUUID().toString() + extension).toURI().toString();
                    root.saveCroppedImageAsync(Uri.parse(path), format, quality);
                } catch (Exception e) {
                    WritableMap response = Arguments.createMap();
                    response.putString("message", e.getMessage());

                    ReactContext reactContext = (ReactContext)root.getContext();
                    reactContext
                            .getJSModule(RCTEventEmitter.class)
                            .receiveEvent(root.getId(), ON_SAVE_IMAGE_ERROR, response);
                }
            case ROTATE_IMAGE_COMMAND:
                boolean clockwise = (args != null) && args.getBoolean(0);
                root.rotateImage(clockwise ? 90 : -90);
            default:
                throw new IllegalArgumentException("Unknown argument commandId");
        }
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
         return MapBuilder.<String, Object>builder()
                 .put(ON_IMAGE_SAVED, MapBuilder.of("registrationName", ON_IMAGE_SAVED))
                 .put(ON_SAVE_IMAGE_ERROR, MapBuilder.of("registrationName", ON_SAVE_IMAGE_ERROR))
                 .build();
    }

    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
                SAVE_IMAGE_COMMAND_NAME, SAVE_IMAGE_COMMAND,
                ROTATE_IMAGE_COMMAND_NAME, ROTATE_IMAGE_COMMAND
        );
    }
}
